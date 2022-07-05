import axios from "axios";
import { adminLogin, login, logout } from "./users";

jest.mock("axios");

describe("Users api functions", () => {
  jest.spyOn(Object.getPrototypeOf(window.localStorage), "setItem");
  jest.spyOn(Object.getPrototypeOf(window.localStorage), "removeItem");
  Object.setPrototypeOf(window.localStorage.setItem, jest.fn());
  Object.setPrototypeOf(window.localStorage.removeItem, jest.fn());

  test("Login corretto", async () => {
    axios.post.mockImplementationOnce(() =>
      Promise.resolve({ data: { key: "testkey", user: {} } })
    );
    expect(await login("test", "pswd")).toEqual({ key: "testkey", user: {} });
    expect(window.localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      "user",
      JSON.stringify({ key: "testkey", user: {} })
    );
  });
  test("Login errato", async () => {
    axios.post.mockImplementationOnce(() =>
      Promise.reject({ message: "Credenziali errate" })
    );
    let res;
    try {
      res = await login("test", "pswd");
    } catch (err) {
      res = err;
    }
    expect(res).toEqual("Credenziali errate");
    expect(window.localStorage.setItem).toHaveBeenCalledTimes(0);
  });
  test("Admin login corretto", async () => {
    axios.post.mockImplementationOnce(() =>
      Promise.resolve({ data: { key: "testkey", user: {} } })
    );
    expect(await adminLogin("pswd")).toEqual("testkey");
    expect(window.localStorage.setItem).toHaveBeenCalledTimes(0);
  });
  test("Admin login errato", async () => {
    axios.post.mockImplementationOnce(() =>
      Promise.reject({ message: "Credenziali errate" })
    );
    let res;
    try {
      res = await adminLogin("pswd");
    } catch (err) {
      res = err;
    }
    expect(res).toEqual("Credenziali errate");
    expect(window.localStorage.setItem).toHaveBeenCalledTimes(0);
  });
  test("Logout corretto", async () => {
    axios.post.mockImplementationOnce(() => Promise.resolve({ data: {} }));
    expect(await logout()).toEqual({});
    expect(window.localStorage.removeItem).toHaveBeenCalledTimes(1);
    expect(window.localStorage.removeItem).toHaveBeenCalledWith("user");
  });
  test("Logout errato", async () => {
    axios.post.mockImplementationOnce(() =>
      Promise.reject({ message: "errore" })
    );
    let res;
    try {
      res = await logout();
    } catch (err) {
      res = err;
    }
    expect(res).toEqual("errore");
    expect(window.localStorage.removeItem).toHaveBeenCalledTimes(0);
  });
});
