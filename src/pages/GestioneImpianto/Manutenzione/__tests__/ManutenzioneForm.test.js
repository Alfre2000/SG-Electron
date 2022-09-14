import { render, screen } from "@testing-library/react";
import ManutenzioneForm from "../ManutenzioneForm";
import FormContext from "../../../../contexts/FormContext";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";

describe("ManutenzioneForm", () => {
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
          <ManutenzioneForm />
        </FormContext>
      </Router>
    );
    expect(screen.getByLabelText(/data/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ora/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/operatore/i)).toBeInTheDocument();
    expect(screen.getByText(/manutenzione effettuata/i)).toBeInTheDocument();
  });
});
