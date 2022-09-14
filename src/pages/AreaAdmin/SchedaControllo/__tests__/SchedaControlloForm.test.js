import { render, screen } from "@testing-library/react";
import SchedaControlloForm from "../SchedaControlloForm";
import FormContext from "../../../../contexts/FormContext";

describe("SchedaControlloForm", () => {
  test("Render correttamente", async () => {
    const formContext = {
      view: false,
      errors: undefined,
      initialData: undefined,
    };
    render(
      <FormContext {...formContext}>
        <SchedaControlloForm />
      </FormContext>
    );
    expect(screen.getByLabelText(/nome scheda/i)).toBeInTheDocument();
    expect(screen.getByText(/nome sezione/i)).toBeInTheDocument();
    expect(screen.getByText(/frequenza/i)).toBeInTheDocument();
    expect(screen.getByText(/responsabilità/i)).toBeInTheDocument();
    expect(screen.getByText(/misurazioni/i)).toBeInTheDocument();
    expect(screen.getAllByText(/articoli/i).length).toBeGreaterThan(0);
  });
});
