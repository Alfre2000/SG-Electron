import { render, screen } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import useCheckImpianto from "./useCheckImpianto";
import { UserContext } from "../../contexts/UserContext";

jest.mock("react-router-dom", () => ({ useNavigate: jest.fn() }));

const TestComponent = () => {
  const pending = useCheckImpianto();
  return <div>{pending ? "pending" : "not pending"}</div>;
};

describe("useCheckImpianto", () => {
  test("Se non è presente l'impianto redirecta alla pagina di selezione", async () => {
    const navigateFunction = jest.fn();
    useNavigate.mockImplementation(() => navigateFunction);
    render(
      <UserContext.Provider value={{}}>
        <TestComponent />
      </UserContext.Provider>
    );
    expect(navigateFunction).toHaveBeenCalledTimes(1);
    expect(navigateFunction).toHaveBeenCalledWith(
      "/manutenzione/selezione-impianto/"
    );
    expect(screen.getByText("not pending")).toBeInTheDocument();
  });
  test("Se è presente l'impianto non redirectare", async () => {
    const navigateFunction = jest.fn();
    useNavigate.mockImplementation(() => navigateFunction);
    const user = { user: { user: { username: "Test", impianto: 1 } } };
    render(
      <UserContext.Provider value={user}>
        <TestComponent />
      </UserContext.Provider>
    );
    expect(navigateFunction).toHaveBeenCalledTimes(0);
    expect(screen.getByText("not pending")).toBeInTheDocument();
  });
});
