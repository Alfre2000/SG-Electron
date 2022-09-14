import { render, screen } from "@testing-library/react";
import AnalisiForm from "../AnalisiForm";
import FormContext from "../../../../contexts/FormContext";

describe("AnalisiForm", () => {
  test("Render correttamente", async () => {
    const formContext = {
      view: false,
      errors: undefined,
      initialData: undefined,
    };
    render(
      <FormContext {...formContext}>
        <AnalisiForm />
      </FormContext>
    );
    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/impianto/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/intervallo pezzi/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/intervallo giorni/i)).toBeInTheDocument();
    expect(screen.getByText(/parametri/i)).toBeInTheDocument();
    expect(screen.getByText(/minimo/i)).toBeInTheDocument();
    expect(screen.getByText(/ottimo/i)).toBeInTheDocument();
    expect(screen.getByText(/massimo/i)).toBeInTheDocument();
  });
});
