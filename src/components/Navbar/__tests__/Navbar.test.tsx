import { render, screen } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import Navbar from "../Navbar";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { UserContext, UserContextType } from "../../../contexts/UserContext";

const menu = [
  {
    title: "test menu 1",
    icon: faUser,
    links: [
      { name: "test 1", link: "/test/" },
      { name: "test 2", link: "/test2/" },
    ],
  },
  {
    title: "test menu 2",
    icon: faUser,
    links: [{ name: "test 3", link: "/test/" }],
  },
];
const userMultipleProgrammi = {
  user: {
    user: {
      username: "test",
      is_staff: true,
      programmi: ["Programma 4", "Programma 5"],
    },
  },
  setUser: jest.fn(),
} as UserContextType;
const userSingoloProgramma = {
  user: {
    user: {
      username: "test username",
      is_staff: false,
      programmi: ["Programma 4"],
    },
  },
  setUser: jest.fn(),
} as UserContextType;

describe("Navbar", () => {
  test("Render corretto: singolo programma", async () => {
    const history = createMemoryHistory();
    const props = { menu: menu, navOpen: true };
    render(
      <Router location={history.location} navigator={history}>
        <UserContext.Provider value={userSingoloProgramma}>
          <Navbar {...props} />
        </UserContext.Provider>
      </Router>
    );
    expect(screen.queryByText(/HomePage/i)).not.toBeInTheDocument();
  });
  test("Render corretto: più programmi", async () => {
    const history = createMemoryHistory();
    const props = { menu: menu, navOpen: true };
    render(
      <Router location={history.location} navigator={history}>
        <UserContext.Provider value={userMultipleProgrammi}>
          <Navbar {...props} />
        </UserContext.Provider>
      </Router>
    );
    expect(screen.getByText(/test menu 1/i)).toBeInTheDocument();
    expect(screen.getByText(/test menu 2/i)).toBeInTheDocument();
    expect(screen.getByText(/test 1/i)).toBeInTheDocument();
    expect(screen.getByText(/test 2/i)).toBeInTheDocument();
    expect(screen.getByText(/test 3/i)).toBeInTheDocument();
    expect(screen.getByAltText(/icona superGalvanica/i)).toBeInTheDocument();
    expect(screen.getByText(/HomePage/i)).toBeInTheDocument();
  });
  test("Render corretto: navbar open", async () => {
    const history = createMemoryHistory();
    const props = { menu: menu, navOpen: true };
    render(
      <Router location={history.location} navigator={history}>
        <UserContext.Provider value={userSingoloProgramma}>
          <Navbar {...props} />
        </UserContext.Provider>
      </Router>
    );
    expect(screen.getByText("SUPERGALVANICA S.R.L.")).toBeInTheDocument();
    expect(screen.getByText(/test username/i)).toBeInTheDocument();
    expect(screen.getByText(/versione software/i)).toBeInTheDocument();
    expect(screen.getByText(/copyright/i)).toBeInTheDocument();
  });
  test("Render corretto: navbar closed", async () => {
    const history = createMemoryHistory();
    const props = { menu: menu, navOpen: false };
    render(
      <Router location={history.location} navigator={history}>
        <UserContext.Provider value={userSingoloProgramma}>
          <Navbar {...props} />
        </UserContext.Provider>
      </Router>
    );
    expect(screen.queryByText("SUPERGALVANICA S.R.L.")).not.toBeInTheDocument();
    expect(screen.queryByText(/test username/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/versione software/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/copyright/i)).not.toBeInTheDocument();
  });
});
