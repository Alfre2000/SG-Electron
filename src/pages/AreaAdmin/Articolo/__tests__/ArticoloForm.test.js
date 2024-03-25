import { render, screen } from "@testing-library/react";
import ArticoloForm from "../OldArticoloForm";
import FormContext from "../../../../contexts/FormContext";

describe("ArticoloForm", () => {
  test("Render correttamente", async () => {
    const formContext = {
      view: false,
      errors: undefined,
      initialData: undefined,
    };
    render(
      <FormContext {...formContext}>
        <ArticoloForm />
      </FormContext>
    );
    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/codice/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cliente/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/scheda controllo/i)).toBeInTheDocument();
    expect(screen.getByText(/peso/i)).toBeInTheDocument();
    expect(screen.getByText(/superficie/i)).toBeInTheDocument();
    expect(screen.getByText(/lavorazione/i)).toBeInTheDocument();
    expect(screen.getByText(/spessore minimo/i)).toBeInTheDocument();
    expect(screen.getByText(/spessore massimo/i)).toBeInTheDocument();
    expect(screen.getAllByText(/titolo/i).length).toEqual(2);
    expect(screen.getByText(/immagine/i)).toBeInTheDocument();
    expect(screen.getByText(/documento/i)).toBeInTheDocument();
  });
});
