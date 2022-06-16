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

export const parseFromAPI = (data, name) => {
  if (name.split('__').length === 3) {
      const [ chiave, index, campo ] = name.split('__')
      if (data[chiave] && data[chiave][index] && campo in data[chiave][index]) {
        return data[chiave][index][campo]
      } 
      return null
  } else {
      return data[name]
  }
}

export const parseFormData = (formData, update) => {
  const formDataCopy = {...formData}
  Object.keys(formDataCopy).forEach(key => {
    if ((update !== true || key.endsWith('id')) && formData[key] === "") delete formData[key]
    else if (formData[key]?.constructor.name === "File" && formData[key].name === "" && formData[key].size === 0) delete formData[key];
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

const findNestedElement = (obj, path) => {
  let stack = path.split('__');
  while(stack.length > 1){
    obj = obj[stack.shift()];
  }
  return obj[stack.shift()]
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
    if (Array.isArray(obj[key])) {
      obj[key] = obj[key].filter(el => el !== undefined)
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      cleanObj(obj[key])
    } else if (obj[key] === undefined) {
      delete obj[key]
    }
  })
}