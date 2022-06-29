import { apiDelete } from "../api/utils";

export const deleteRecord = (recordID, data, setData, baseURL, onDelete) => {
  apiDelete(`${baseURL}${recordID}/`)
    .then((res) => {
      const newData = {
        ...data,
        records: {...data.records, results: data.records.results.filter(el => el.id !== recordID)},
      }
      if (onDelete) onDelete(newData);
      else setData(newData);
    })
    .catch((err) => console.log(err));
};

export const parseFormData = (formData) => {
  if ('data' in formData && 'ora' in formData) {
    formData['data'] = new Date(formData['data'] + " " + formData['ora']).toISOString()
    delete formData['ora']
  }
  const formDataCopy = {...formData}
  Object.keys(formDataCopy).forEach(key => {
    if (formData[key]?.constructor.name === "File" && formData[key].name === "" && formData[key].size === 0) delete formData[key];
    else if (key.split('__').length >= 3) { 
      parseNestedObject(key, formData, formDataCopy)
    }
  })
  cleanObj(formData)
}

const parseNestedObject = (name, formData, initialFormData) => {
  let [ chiave, index, ...campo ] = name.split('__')
  if (campo.length >= 3 && formData[chiave]) {
    let initial = {}
    for (const [key, value] of Object.entries({...initialFormData})) {
      if (key.startsWith(`${chiave}__`)) {
        if (key.startsWith(`${chiave}__${index}`)) {
          initial[key.split('__').slice(2).join('__')] = value
        }
      } else {
        initial[key] = value
      }
    }
    if (formData[chiave][index] === undefined) formData[chiave][index] = {}
    parseNestedObject(campo.join('__'), formData[chiave][index], initial)
    delete formData[name]
  } else {
    const nElementiPerRiga = Object.keys(initialFormData).filter(k => k.startsWith(chiave + '__0')).length || Object.keys(initialFormData).filter(k => k.startsWith(chiave + '__1')).length
    if (!(chiave in formData)) {
      const nElementi = Object.keys(initialFormData).filter(k => k.startsWith(chiave + '__')).length
      formData[chiave] = Array.from(Array(Math.floor(nElementi / nElementiPerRiga)))
    }
    if (!formData[chiave][index]) formData[chiave][index] = {}
    if (formData[name] !== "") {
      formData[chiave][index][campo[0]] = initialFormData[name]
    }
    delete formData[name]
    // Se il record è completo elimina la riga se è vuota
    if (Object.keys(formData[chiave][index]).length + 1 === nElementiPerRiga) {
      if (Object.values(formData[chiave][index]).every(value => !value)) {
        formData[chiave].splice(index, 1)
      }
    }
  }
}

export const findNestedElement = (obj, path) => {
  if (typeof obj !== "object" || !path) return null
  let stack = path.split('__');
  while(stack.length > 1) {
    const key = stack.shift()
    if (!(key in obj)) return null
    obj = obj[key];
  }
  const key = stack.shift()
  if (!(key in obj)) return null
  return obj[key]
}

export const modifyNestedObject = (obj, path, newValue) => {
  obj = Array.isArray(obj) ? [...obj] : {...obj}
  let startObj = obj
  let stack = path.split('__');
  while(stack.length > 1){
    obj = obj[stack.shift()];
  }
  obj[stack.shift()] = newValue;
  return startObj
}

export const addToNestedArray = (obj, path, element) => {
  let newValue = [...findNestedElement(obj, path), element]
  return modifyNestedObject(obj, path, newValue)
} 

export const removeFromNestedArray = (obj, path, idx) => {
  let newValue = [...findNestedElement(obj, path)].filter((_, i) => idx !== i)
  return modifyNestedObject(obj, path, newValue)
}

const cleanObj = (obj) => {
  Object.keys(obj).forEach(key => {
    if (obj[key]?.constructor.name === "File") return;
    const isArray = Array.isArray(obj[key])
    const isEmpty = obj[key] === undefined || obj[key] === null || obj[key] === ""
    const isEmptyObj = typeof obj[key] === 'object' && obj[key] !== null && Object.keys(obj[key]).length === 0
    const isObject = typeof obj[key] === 'object' && obj[key] !== null
    if (isArray) {
      obj[key] = obj[key].filter(el => el !== undefined && !(typeof el === 'object' && (Object.keys(el).length === 0 || Object.values(el).every(value => value === undefined || value === null || value === ""))))
      cleanObj(obj[key])
    } else if (isEmpty || isEmptyObj) {
      delete obj[key]
    } else if (isObject) {
      if (Object.values(obj[key]).every(value => value === undefined || value === null || value === "")) {
        delete obj[key]
      } else {
        cleanObj(obj[key])
      }
    } 
  })
}

export const getBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

export const objectsEqual = ( x, y ) => {
  if ( x === y ) return true;
    // if both x and y are null or undefined and exactly the same

  if ( ! ( x instanceof Object ) || ! ( y instanceof Object ) ) return false;
    // if they are not strictly equal, they both need to be Objects

  if ( x.constructor !== y.constructor ) return false;
    // they must have the exact same prototype chain, the closest we can do is
    // test there constructor.

  for ( var p in x ) {
    if ( ! x.hasOwnProperty( p ) ) continue;
      // other properties were tested using x.constructor === y.constructor

    if ( ! y.hasOwnProperty( p ) ) return false;
      // allows to compare x[ p ] and y[ p ] when set to undefined

    if ( x[ p ] === y[ p ] ) continue;
      // if they have the same strict value or identity then they are equal

    if ( typeof( x[ p ] ) !== "object" ) return false;
      // Numbers, Strings, Functions, Booleans must be strictly equal

    if ( ! objectsEqual( x[ p ],  y[ p ] ) ) return false;
      // Objects and Arrays must be tested recursively
  }

  for ( p in y )
    if ( y.hasOwnProperty( p ) && ! x.hasOwnProperty( p ) )
      return false;
        // allows x[ p ] to be set to undefined

  return true;
}