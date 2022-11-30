import { searchOptions } from "../../../utils";

export const moveUp = (array, itemIndex) => {
  let newArr = [...array];
  const [el] = newArr?.splice(itemIndex, 1);
  newArr.splice(itemIndex - 1, 0, el);
  return newArr;
};

export const moveDown = (array, itemIndex) => {
  let newArr = [...array];
  const [el] = newArr?.splice(itemIndex, 1);
  newArr.splice(itemIndex + 1, 0, el);
  return newArr;
};

export const removeItem = (array, itemIndex) => {
  let newArr = [...array];
  newArr?.splice(itemIndex, 1);
  return newArr;
};

export const opzioniControlli = (controlli, tests) => {
  return searchOptions(
    controlli.filter((controllo) => {
      const test = tests.find((t) => t.controllo === controllo.id);
      if (test === undefined) return true;
      return (
        tests.filter((t) => t.controllo === controllo.id).length <
        controllo.misurazioni.length
      );
    }),
    "nome"
  );
};

export const opzioniMisurazioni = (controllo, tests) => {
  return searchOptions(
    controllo?.misurazioni.filter(
      (misurazione) =>
        !tests
          .filter(
            (test) =>
              test.controllo === controllo.id &&
              test.lavorazione === misurazione.id
          )
          .map((t) => t.lavorazione)
          .includes(misurazione.id)
    ),
    "nome"
  );
};
