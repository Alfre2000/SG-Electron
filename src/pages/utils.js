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
