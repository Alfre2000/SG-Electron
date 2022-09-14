import { render, screen } from "@testing-library/react";
import FissaggioForm from "../FissaggioForm";
import FormContext from "../../../../contexts/FormContext";

describe("FissaggioForm", () => {
  test("Render correttamente", async () => {
    const formContext = {
      view: false,
      errors: undefined,
      initialData: undefined,
    };
    render(
      <FormContext {...formContext}>
        <FissaggioForm />
      </FormContext>
    );
    expect(screen.getByLabelText(/data/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ora/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/operatore/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ph/i)).toBeInTheDocument();
  });
});
