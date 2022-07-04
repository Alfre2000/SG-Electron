import { render, screen } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import useCheckAuth from "./useCheckAuth";

jest.mock("react-router-dom", () => ({ useNavigate: jest.fn() }));

const TestComponent = () => {
  const pending = useCheckAuth();
  return <div>{pending ? "pending" : "not pending"}</div>;
};

describe("useCheckAuth", () => {
  test("Se non è presente lo user nel local storage redirect al login", async () => {
    const navigateFunction = jest.fn();
    useNavigate.mockImplementation(() => navigateFunction);
    render(<TestComponent />);
    expect(navigateFunction).toHaveBeenCalledTimes(1);
    expect(navigateFunction).toHaveBeenCalledWith("/login");
    expect(screen.getByText('not pending')).toBeInTheDocument()
  });
  test("Se è presente lo user nel local storage rimani nella pagina", async () => {
    const navigateFunction = jest.fn();
    useNavigate.mockImplementation(() => navigateFunction);
    localStorage.setItem(
      "user",
      JSON.stringify({ user: { username: "test" } })
    );
    render(<TestComponent />);
    expect(navigateFunction).toHaveBeenCalledTimes(0);
    expect(screen.getByText('not pending')).toBeInTheDocument()
  });
});
