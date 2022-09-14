import { render, screen } from "@testing-library/react";
import SchedaImpiantoForm from "../SchedaImpiantoForm";
import FormContext from "../../../../contexts/FormContext";

describe("SchedaImpiantoForm", () => {
  test("Render correttamente", async () => {
    const formContext = {
      view: false,
      errors: undefined,
      initialData: undefined,
    };
    render(
      <FormContext {...formContext}>
        <SchedaImpiantoForm />
      </FormContext>
    );
    expect(screen.getByLabelText(/impianto/i)).toBeInTheDocument();
    expect(screen.getByText(/nome/i)).toBeInTheDocument();
    expect(screen.getAllByText(/materiale/i).length).toBeGreaterThan(1);
    expect(screen.getByText(/titolo/i)).toBeInTheDocument();
    expect(screen.getByText(/documento/i)).toBeInTheDocument();
    expect(screen.getByText(/verifiche iniziali/i)).toBeInTheDocument();
    expect(screen.getByText(/aggiunte iniziali/i)).toBeInTheDocument();
    expect(screen.getByText(/aggiunte successive/i)).toBeInTheDocument();
  });
});
