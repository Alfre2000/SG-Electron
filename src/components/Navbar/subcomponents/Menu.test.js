import { render, screen, fireEvent } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import Menu from "./Menu";
import { faUser } from "@fortawesome/free-solid-svg-icons";

describe("Menu", () => {
  test("Render corretto: più link", async () => {
    const props = {
      title: "test title",
      icon: faUser,
      links: [
        { name: "test 1", link: "/test/" },
        { name: "test 2", link: "/test2/" },
      ],
    };
    const history = createMemoryHistory();
    render(
      <Router location={history.location} navigator={history}>
        <Menu {...props} />
      </Router>
    );
    expect(screen.getByText(/test title/i)).toBeInTheDocument();
    expect(screen.getByTestId("caret-icon")).toBeInTheDocument();
    expect(screen.getByTestId("caret-icon")).not.toHaveClass("up");
    expect(screen.getByText(/test 1/i)).toHaveAttribute("href", "/test/");
    expect(screen.getByText(/test 2/i)).toHaveAttribute("href", "/test2/");
    expect(screen.getByTestId("container")).not.toHaveClass("open");

    fireEvent.click(screen.getByTestId("container"));
    
    expect(screen.getByTestId("container")).toHaveClass("open");
    expect(screen.getByTestId("caret-icon")).toHaveClass("up");
  });
  test("Render corretto: un unico link", async () => {
    const props = {
      title: "test title",
      icon: faUser,
      links: [{ name: "test 1", link: "/test/" }],
    };
    const history = createMemoryHistory();
    render(
      <Router location={history.location} navigator={history}>
        <Menu {...props} />
      </Router>
    );
    expect(screen.queryByTestId("caret-icon")).not.toBeInTheDocument();
    expect(screen.getByText(/test 1/i)).toHaveAttribute("href", "/test/");
    expect(screen.getByTestId("container")).not.toHaveClass("open");
    fireEvent.click(screen.getByTestId("container"));
    expect(screen.getByTestId("container")).not.toHaveClass("open");
  });
});
