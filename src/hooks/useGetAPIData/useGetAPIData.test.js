import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { apiGet } from "../../api/api";
import UserContext from "../../UserContext";
import useGetAPIData from "./useGetAPIData";
jest.mock("../../api/api", () => ({ apiGet: jest.fn() }));

const TestComponent = ({ requests, needsImpianto = false }) => {
  const [data] = useGetAPIData(requests, needsImpianto);
  return <div>{JSON.stringify(data)}</div>;
};

const promiseRecords = Promise.resolve({
  count: 1000,
  previous: null,
  next: "https://localhost:8000/test-url/?impianto=2&page=2",
  results: { length: 25 },
});
const promise = Promise.resolve([
  { nome: "test", count: 1 },
  { nome: "test", count: 2 },
  { nome: "test", count: 3 },
]);

describe("useGetAPIData", () => {
  test("Funzionamento normale corretto", async () => {
    const user = { user: { user: { username: "Test", impianto: { id: 2 } } } };
    apiGet.mockImplementation((url) =>
      url.toString().includes("records") ? promiseRecords : promise
    );
    render(
      <UserContext.Provider value={user}>
        <TestComponent
          requests={[
            { nome: "operatori", url: "http://test.test/base/operatori/" },
            { nome: "operazioni", url: "http://test.test/base/operazioni/" },
            { nome: "records", url: "http://test.test/base/records/" },
          ]}
        />
      </UserContext.Provider>
    );
    await act(() => promise);
    await act(() => promise);
    await act(() => promise);
    expect(apiGet).toHaveBeenCalledTimes(3);
    expect(apiGet).toHaveBeenCalledWith(
      "http://test.test/base/operatori/?impianto=2"
    );
    expect(apiGet).toHaveBeenCalledWith(
      "http://test.test/base/operazioni/?impianto=2"
    );
    expect(apiGet).toHaveBeenLastCalledWith(
      "http://test.test/base/records/?impianto=2&page=1"
    );
    expect(
      screen.getByText(
        JSON.stringify({
          operatori: await promise,
          operazioni: await promise,
          records: await promiseRecords,
        })
      )
    ).toBeInTheDocument();
  });
  test("Quando è richiesto l'impianto non chiamare le funzioni se manca", async () => {
    const user = { user: {} };
    apiGet.mockImplementation((url) =>
      url.toString().includes("records") ? promiseRecords : promise
    );
    render(
      <UserContext.Provider value={user}>
        <TestComponent
          requests={[
            { nome: "operatori", url: "http://test.test/base/operatori/" },
            { nome: "operazioni", url: "http://test.test/base/operazioni/" },
            { nome: "records", url: "http://test.test/base/records/" },
          ]}
          needsImpianto={true}
        />
      </UserContext.Provider>
    );
    expect(apiGet).toHaveBeenCalledTimes(0);
  });
  test("Funzione parser chiamata correttamente", async () => {
    const user = { user: {} };
    apiGet.mockImplementation((url) =>
      url.toString().includes("records") ? promiseRecords : promise
    );
    render(
      <UserContext.Provider value={user}>
        <TestComponent
          requests={[
            {
              nome: "operatori",
              url: "http://test.test/base/operatori/",
              parser: () => "test",
            },
            { nome: "operazioni", url: "http://test.test/base/operazioni/" },
            { nome: "records", url: "http://test.test/base/records/" },
          ]}
        />
      </UserContext.Provider>
    );
    await act(() => promise);
    await act(() => promise);
    await act(() => promise);
    expect(apiGet).toHaveBeenCalledTimes(3);
    expect(apiGet).toHaveBeenLastCalledWith(
      "http://test.test/base/records/?page=1"
    );
    expect(
      screen.getByText(
        JSON.stringify({
          operatori: "test",
          operazioni: await promise,
          records: await promiseRecords,
        })
      )
    ).toBeInTheDocument();
  });
});
