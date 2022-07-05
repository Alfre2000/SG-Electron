import { getErrors, getHeaders } from "./utils";

describe("Test funzioni utils per l'api", () => {
  test("Funzione getHeaders senza necessità di autenticazione", () => {
    expect(getHeaders(false)).toEqual({});
  });
  test("Funzione getHeaders con necessità di autenticazione", () => {
    localStorage.setItem(
      "user",
      JSON.stringify({ key: "testkey", username: "test" })
    );
    expect(getHeaders(true)).toEqual({ Authorization: "Token testkey" });
  });
  test("Funzione getErrors", () => {
    let errObj = { message: "test" };
    expect(getErrors(errObj)).toEqual("test");
    errObj = { response: { data: "test" } };
    expect(getErrors(errObj)).toEqual("test");
    errObj = { prova: "test" };
    expect(getErrors(errObj)).toBe(undefined);
  });
});
