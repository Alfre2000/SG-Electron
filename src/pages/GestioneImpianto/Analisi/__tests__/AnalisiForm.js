import { render, screen, fireEvent } from "@testing-library/react";
import AnalisiForm from "../AnalisiForm";
import FormContext from "../../../../contexts/FormContext";
import { Router, useSearchParams } from "react-router-dom";
import { createMemoryHistory } from "history";
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useSearchParams: jest.fn(),
}));


describe("AnalisiForm", () => {
  test("Render correttamente", async () => {
    useSearchParams.mockImplementation(() => [new URLSearchParams("")]);
    const history = createMemoryHistory();
    const formContext = {
      view: false,
      errors: undefined,
      initialData: undefined,
    };
    const data = {
      operatori: [{ id: 3, nome: "Test Operatore" }],
      operazioni: [
        {
          id: "b58c138a-282a-45d1-bdd1-c430fcc945a9",
          nome: "Test Analisi",
          parametri: [
            {
              id: "480a5a56-aae7-4c51-a6d9-4056c17e58ce",
              massimo: 15,
              minimo: 5,
              nome: "Acido ossalico g/l",
              ottimo: 12,
            },
            {
              id: "fbafe382-6401-4e48-9946-c39d34dddacc",
              massimo: 12,
              minimo: 3,
              nome: "Al",
              ottimo: 4,
            },
          ],
        },
      ],
      records: {
        results: [
          {
            data: "2022-07-12T17:46:00+02:00",
            id: "85da9ea2-4a83-4316-9c21-65d9bb41526a",
            operatore: 3,
            operazione: "b58c138a-282a-45d1-bdd1-c430fcc945a9",
          },
        ],
      },
    };

    render(
      <Router location={history.location} navigator={history}>
        <FormContext {...formContext}>
          <AnalisiForm data={data} />
        </FormContext>
      </Router>
    );
    expect(screen.getByLabelText(/data/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ora/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/operatore/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Analisi:")).toBeInTheDocument();
    expect(screen.getByLabelText(/note/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/controanalisi/i)).toBeInTheDocument();

    expect(screen.queryByText(/acido ossalico/i)).not.toBeInTheDocument();

    // Testo che le analisi possibili vengano visualizzati
    fireEvent.keyDown(screen.getByLabelText("Analisi:"), { key: "ArrowDown" });
    const optionOperazione = await screen.findByText(/test analisi/i);
    expect(optionOperazione).toBeInTheDocument();

    fireEvent.click(screen.getByText(/test analisi/i));

    // Testo che i parametri vengano visualizzati
    const parametro = await screen.findByText(/acido ossalico/i);
    expect(parametro).toBeInTheDocument();
    expect(screen.getByText(/acido ossalico/i)).toBeInTheDocument();
    expect(screen.getByText("Al")).toBeInTheDocument();
    expect(screen.getByText(15)).toBeInTheDocument();
    expect(screen.getByText(5)).toBeInTheDocument();

    // Testo che se il valore inserito è maggiore del massimo, venga visualizzato un alert
    const input = screen.getAllByRole('input')[0]
    fireEvent.change(input, { target: { value: 20 } })
    expect(input.value).toBe("20")
    fireEvent.focusOut(input)

    let alert = await screen.findByText(/valore oltre il massimo/i)
    expect(alert).toBeInTheDocument();

    // Testo che se il valore inserito è minore del minimo, venga visualizzato un alert
    fireEvent.change(input, { target: { value: 2 } })
    expect(input.value).toBe("2")
    fireEvent.focusOut(input)
  
    alert = await screen.findByText(/valore sotto il minimo/i)
    expect(alert).toBeInTheDocument();

    // Testo che se il valore inserito è compreso tra il minimo e il massimo, non venga visualizzato un alert
    fireEvent.change(input, { target: { value: 10 } })
    expect(input.value).toBe("10")
    fireEvent.focusOut(input)
    
    alert = screen.queryByText(/valore sotto il minimo/i)
    expect(alert).not.toBeInTheDocument();

  });
  test("Funziona correttamente quando è presente un search parameter", async () => {
    const history = createMemoryHistory();
    const formContext = {
      view: false,
      errors: undefined,
      initialData: undefined,
    };
    const data = {
      operatori: [{ id: 3, nome: "Test Operatore" }],
      operazioni: [
        {
          id: "b58c138a-282a-45d1-bdd1-c430fcc945a9",
          nome: "Test Analisi",
          parametri: [
            {
              id: "480a5a56-aae7-4c51-a6d9-4056c17e58ce",
              massimo: 15,
              minimo: 5,
              nome: "Acido ossalico g/l",
              ottimo: 12,
            },
            {
              id: "fbafe382-6401-4e48-9946-c39d34dddacc",
              massimo: 12,
              minimo: 3,
              nome: "Al",
              ottimo: 4,
            },
          ],
        },
      ],
      records: {
        results: [
          {
            data: "2022-07-12T17:46:00+02:00",
            id: "85da9ea2-4a83-4316-9c21-65d9bb41526a",
            operatore: 3,
            operazione: "b58c138a-282a-45d1-bdd1-c430fcc945a9",
          },
        ],
      },
    };
    useSearchParams.mockImplementation(() => [new URLSearchParams({ analisi: data.operazioni[0].id })]);
    render(
      <Router location={history.location} navigator={history}>
        <FormContext {...formContext}>
          <AnalisiForm data={data} />
        </FormContext>
      </Router>
    );

    // Testo che i parametri vengano visualizzati
    const parametro = await screen.findByText(/acido ossalico/i);
    expect(parametro).toBeInTheDocument();
    expect(screen.getByText(/acido ossalico/i)).toBeInTheDocument();
    expect(screen.getByText("Al")).toBeInTheDocument();
    expect(screen.getByText(15)).toBeInTheDocument();
    expect(screen.getByText(5)).toBeInTheDocument();
  });
});