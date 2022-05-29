import { apiDelete } from "../../api/utils";
import { URLS } from "../../urls";
import { findElementFromID } from "../../utils";

export const deleteRecord = (recordID, data, setData) => {
  const record = findElementFromID(recordID, data.records);
  const tipologia = data.tipologia || record.tipologia;
  const baseUrl = URLS[`RECORD_${tipologia.toUpperCase()}`];
  apiDelete(`${baseUrl}${recordID}/`)
    .then((res) => {
      setData({
        ...data,
        records: data.records.filter(el => el.id !== recordID),
      });
    })
    .catch((err) => console.log(err));
};
