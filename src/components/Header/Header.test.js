import { fireEvent, render, screen } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import Header from "./Header";
import UserContext from "../../UserContext";
import { logout } from "../../api/users";
jest.mock("../../api/users", () => ({ logout: jest.fn() }));

describe("Header", () => {
  test("Render correttamente admin user", async () => {
    const history = createMemoryHistory();
    const userAdmin = {
      user: { user: { username: "test", is_staff: true } },
      setUser: jest.fn(),
    };
    render(
      <Router location={history.location} navigator={history}>
        <UserContext.Provider value={userAdmin}>
          <Header title="Test Title" />
        </UserContext.Provider>
      </Router>
    );
    expect(screen.getByText(/test title/i)).toBeInTheDocument();
    expect(screen.queryByText(/logout/i)).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId("dropdown"));
    expect(screen.getByText(/area admin/i)).toBeInTheDocument();
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
  });
  test("Render correttamente non admin user", async () => {
    const history = createMemoryHistory();
    const userNormal = {
      user: { user: { username: "test2", is_staff: false } },
      setUser: jest.fn(),
    };
    render(
      <Router location={history.location} navigator={history}>
        <UserContext.Provider value={userNormal}>
          <Header title="Test Title" />
        </UserContext.Provider>
      </Router>
    );
    expect(screen.getByText(/test title/i)).toBeInTheDocument();
    expect(screen.queryByText(/logout/i)).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId("dropdown"));
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
  });
  test("Navbar toggled quando viene cliccata", async () => {
    const history = createMemoryHistory();
    const userNormal = {
      user: { user: { username: "test2", is_staff: false } },
      setUser: jest.fn(),
    };
    const toggleNavbar = jest.fn();
    render(
      <Router location={history.location} navigator={history}>
        <UserContext.Provider value={userNormal}>
          <Header title="Test Title" toggleNavbar={toggleNavbar} />
        </UserContext.Provider>
      </Router>
    );
    fireEvent.click(screen.getByTestId("toggle-nav"));
    expect(toggleNavbar).toHaveBeenCalledTimes(1);
  });
  test("Quando avviene il logout il context utente viene pulito", async () => {
    logout.mockImplementation(() => Promise.resolve(true));
    const history = createMemoryHistory();
    const userNormal = {
      user: { user: { username: "test2", is_staff: false } },
      setUser: jest.fn(),
    };
    render(
      <Router location={history.location} navigator={history}>
        <UserContext.Provider value={userNormal}>
          <Header title="Test Title" />
        </UserContext.Provider>
      </Router>
    );
    fireEvent.click(screen.getByTestId("dropdown"));
    fireEvent.click(screen.getByText(/logout/i));
    expect(logout).toHaveBeenCalledTimes(1);
    setTimeout(() => expect(userNormal.setUser).toHaveBeenCalledWith({}), 10);
  });
});
