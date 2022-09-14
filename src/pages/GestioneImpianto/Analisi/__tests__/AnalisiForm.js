import { render, screen } from "@testing-library/react";
import AnalisiForm from "../AnalisiForm";
import FormContext from "../../../../contexts/FormContext";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";

describe("AnalisiForm", () => {
  test("Render correttamente", async () => {
    const history = createMemoryHistory();
    const formContext = {
      view: false,
      errors: undefined,
      initialData: undefined,
    };
    render(
      <Router location={history.location} navigator={history}>
        <FormContext {...formContext}>
          <AnalisiForm />
        </FormContext>
      </Router>
    );
    expect(screen.getByLabelText(/data/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ora/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/operatore/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Analisi:")).toBeInTheDocument();
    expect(screen.getByLabelText(/note/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/controanalisi/i)).toBeInTheDocument();
  });
});
