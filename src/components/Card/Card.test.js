import { render, screen } from "@testing-library/react";
import Card from "./Card";
import WorkInProgress from "./../../images/work-in-progress.png";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";

describe("Card", () => {
  test("Render correttamente", async () => {
    const history = createMemoryHistory();
    render(
      <Router location={history.location} navigator={history}>
        <Card icon={WorkInProgress} link="/manutenzione/" title="Test Card" />
      </Router>
    );
    expect(screen.getByText(/Test Card/i)).toBeInTheDocument()
  });
});
