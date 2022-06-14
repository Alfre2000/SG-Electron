import { apiDelete } from "../api/utils";

export const deleteRecord = (recordID, data, setData, baseURL) => {
  apiDelete(`${baseURL}${recordID}/`)
    .then((res) => {
      setData({
        ...data,
        records: {...data.records, results: data.records.results.filter(el => el.id !== recordID)},
      });
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