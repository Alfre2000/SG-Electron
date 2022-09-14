import { render, screen } from "@testing-library/react";
import RecordSchedaImpiantoForm from "../RecordSchedaImpiantoForm";
import FormContext from "../../../../contexts/FormContext";

describe("RecordSchedaImpiantoForm", () => {
  test("Render correttamente", async () => {
    const formContext = {
      view: false,
      errors: undefined,
      initialData: undefined,
    };
    const data = {
      schede_impianto: {
        aggiunte: [
          { id: 1, materiale: "Aggiunta iniziale 1", iniziale: true },
          { id: 2, materiale: "Aggiunta non iniziale 1", iniziale: false },
        ],
        documenti_supporto: [
          { id: 1, titolo: "Documento 1", documento: "/test 1/" },
        ],
        id: 1,
        impianto: 1,
        verifiche_iniziali: [
          { id: 1, nome: "Verifica 1" },
          { id: 2, nome: "Verifica 2" },
          { id: 3, nome: "Verifica 3" },
        ],
      },
    };
    render(
      <FormContext {...formContext}>
        <RecordSchedaImpiantoForm data={data} />
      </FormContext>
    );
    expect(screen.getByLabelText(/data/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ora/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/operatore/i)).toBeInTheDocument();
    expect(screen.getByText(/verifiche iniziali/i)).toBeInTheDocument();
    expect(screen.getByText(/aggiunte iniziali/i)).toBeInTheDocument();
    expect(screen.getByText(/aggiunte successive/i)).toBeInTheDocument();
    expect(screen.getByText(/operazioni straordinarie/i)).toBeInTheDocument();
    expect(screen.getByText(/malfunzionamenti/i)).toBeInTheDocument();
    expect(screen.getByText(/verifica 1/i)).toBeInTheDocument();
    expect(screen.getByText(/verifica 2/i)).toBeInTheDocument();
    expect(screen.getByText(/verifica 3/i)).toBeInTheDocument();
    expect(screen.getByText(/aggiunta iniziale 1/i)).toBeInTheDocument();
    expect(screen.queryByText(/aggiunta non iniziale 1/i)).not.toBeInTheDocument();
    expect(screen.getByText(/documento 1/i)).toBeInTheDocument();
  });
});
