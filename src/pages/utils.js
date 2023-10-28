import { apiDelete } from "../api/api";

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

export const parseFormData = (form, formData) => {
  [...form.elements].forEach(el => {
    if (el.type === 'checkbox' && !el.checked) {
      formData[el.name] = "false"
    } else if (el.type !== 'text') {
      if (formData[el.name] === "") formData[el.name] = null
      if (el.parentElement.parentElement.classList.contains('react-select')) {
        const name = el.name
        formData[name] = [...el.parentElement.children].map(el => el.value).join(',')
      }
    } 
    if (el.type === "file") {
      if (el.files.length === 0) {
        delete formData[el.name]
      }
    }
  })
  if ('data' in formData && 'ora' in formData) {
    formData['data'] = new Date(formData['data'] + " " + formData['ora']).toISOString()
    delete formData['ora']
  }
}

export const focusErrorInput = (form, errors) => {
  for (const el of form.elements) {
    const hasError = findNestedElement(errors, el.name) !== null
    if (hasError) {
      if (el.type === "hidden" && el.parentElement.classList.contains("react-select")) {
        el.previousSibling.querySelector('input').focus()
      } else {
        el.focus()
      }
      return el
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
  if ((typeof obj !== "object") || !(key in obj)) return null
  return obj[key]
}

export const modifyNestedObject = (obj, path, newValue) => {
  obj = Array.isArray(obj) ? [...obj] : {...obj}
  let startObj = obj
  let stack = path.split('__');
  while(stack.length > 1){
    obj = obj[stack.shift()];
  }
  let r = stack.shift()
  obj[r] = newValue;
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

export const buildURL = (baseURL, params) => {
  const url = new URL(baseURL)
  Object.keys(params).forEach(key => params[key] !== "" && url.searchParams.append(key, params[key]))
  return url.toString()
}

export const isFormComponent = (Component) => {
  return (
    typeof Component === 'function' &&
    Component.prototype?.constructor?.name?.includes('Form')
  );
}
