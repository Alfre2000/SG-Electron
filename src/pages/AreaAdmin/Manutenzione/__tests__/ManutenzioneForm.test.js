import { render, screen } from "@testing-library/react";
import ManutenzioneForm from "../ManutenzioneForm";
import FormContext from "../../../../contexts/FormContext";

describe("ManutenzioneForm", () => {
  test("Render correttamente", async () => {
    const formContext = { view: false, errors: null, initialData: null };
    render(
      <FormContext {...formContext}>
        <ManutenzioneForm />
      </FormContext>
    );
    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/impianto/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/intervallo pezzi/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/intervallo giorni/i)).toBeInTheDocument();
  });
});
