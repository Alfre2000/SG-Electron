import { apiDelete } from "../../api/utils";
import { URLS } from "../../urls";

export const deleteRecord = (recordID, data, setData) => {
  const baseUrl = URLS[`RECORD_${data.tipologia.toUpperCase()}`];
  apiDelete(`${baseUrl}${recordID}/`)
    .then((res) => {
      setData({
        ...data,
        records: data.records.filter((el) => el.id !== recordID),
      });
    })
    .catch((err) => console.log(err));
};