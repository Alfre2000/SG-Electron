import { fireEvent, render, screen } from "@testing-library/react";
import { Router, useNavigate } from "react-router-dom";
import { createMemoryHistory } from "history";
import SelezioneImpianto from "../SelezioneImpianto";
import useGetAPIData from "../../../../hooks/useGetAPIData/useGetAPIData";
import UserContext from "../../../../UserContext";
jest.mock("../../../../hooks/useGetAPIData/useGetAPIData", () => jest.fn());
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.useFakeTimers();
describe("SelezioneImpianto", () => {
  test("Render correttamente admin user", async () => {
    const navigateFunction = jest.fn();
    useNavigate.mockImplementation(() => navigateFunction);
    useGetAPIData.mockImplementation(() => [
      {
        impianti: [
          { id: 1, nome: "Impianto 1" },
          { id: 2, nome: "Impianto 2" },
          { id: 3, nome: "Impianto 3" },
        ],
      },
    ]);
    const history = createMemoryHistory();
    const userAdmin = {
      user: { user: { username: "test", is_staff: true } },
      setUser: jest.fn(),
    };
    render(
      <Router location={history.location} navigator={history}>
        <UserContext.Provider value={userAdmin}>
          <SelezioneImpianto />
        </UserContext.Provider>
      </Router>
    );
    expect(screen.getByText(/impianto 1/i)).toBeInTheDocument();
    expect(screen.getByText(/impianto 2/i)).toBeInTheDocument();
    expect(screen.getByText(/impianto 3/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/impianto 2/i));
    expect(userAdmin.setUser).toBeCalledWith({
      user: {
        username: "test",
        is_staff: true,
        impianto: { id: 2, nome: "Impianto 2" },
      },
    });
    expect(navigateFunction).toHaveBeenLastCalledWith(
      "/manutenzione/selezione-impianto/"
    );
    jest.advanceTimersByTime(200);
    expect(navigateFunction).toHaveBeenLastCalledWith(
      "/manutenzione/record-lavorazione/"
    );
  });
  test("Render correttamente no data", async () => {
    const navigateFunction = jest.fn();
    useNavigate.mockImplementation(() => navigateFunction);
    useGetAPIData.mockImplementation(() => [{}]);
    const history = createMemoryHistory();
    const userAdmin = {
      user: { user: { username: "test", is_staff: true } },
      setUser: jest.fn(),
    };
    render(
      <Router location={history.location} navigator={history}>
        <UserContext.Provider value={userAdmin}>
          <SelezioneImpianto />
        </UserContext.Provider>
      </Router>
    );
    expect(screen.getByText(/selezione impianto/i)).toBeInTheDocument();
  });
  test("Redirect se l'user ha già l'impianto", async () => {
    const navigateFunction = jest.fn();
    useNavigate.mockImplementation(() => navigateFunction);
    useGetAPIData.mockImplementation(() => [{}]);
    const history = createMemoryHistory();
    const userAdmin = {
      user: {
        user: {
          username: "test",
          is_staff: true,
          impianto: { id: 1, nome: "Impianto Test" },
        },
      },
      setUser: jest.fn(),
    };
    render(
      <Router location={history.location} navigator={history}>
        <UserContext.Provider value={userAdmin}>
          <SelezioneImpianto />
        </UserContext.Provider>
      </Router>
    );
    expect(navigateFunction).toHaveBeenLastCalledWith(
      "/manutenzione/record-lavorazione/"
    );
  });
});
