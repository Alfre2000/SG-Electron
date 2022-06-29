const utils = require("./utils");

test("Data trasformata correttamente", () => {
  expect(utils.dateToDatePicker(new Date("2021/1/1"))).toBe("2021-01-01");
});
test("Ora trasformata correttamente", () => {
  expect(utils.dateToTimePicker(new Date("2021/1/1 2:13"))).toBe("02:13");
});
test("Trova elemento nella lista correttamente", () => {
  const array = [
    { id: 1, nome: "ciao" },
    { id: 2, nome: "bau" },
    { id: 3, nome: "sau" },
  ];
  expect(utils.findElementFromID(2, array)).toEqual({ id: 2, nome: "bau" });
});
test("Elemento non presente nella lista", () => {
  const array = [{ id: 1, nome: "ciao" }];
  expect(utils.findElementFromID(4, array)).toEqual("");
});
test("Funzione capitalize funziona correttamente", () => {
  expect(utils.capitalize("ciao come va")).toBe("Ciao come va");
});
