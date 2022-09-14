import { render, screen } from "@testing-library/react";
import RecordLavorazioneOssidoForm from "../RecordLavorazioneOssidoForm";
import FormContext from "../../../../contexts/FormContext";
import UserContext from "../../../../UserContext";

describe("RecordLavorazioneOssidoForm", () => {
  test("Render correttamente", async () => {
    const formContext = {
      view: false,
      errors: undefined,
      initialData: undefined,
    };
    const userNormal = {
      user: { user: { username: "test2", is_staff: false, impianto: 1 } },
      setUser: jest.fn(),
    };
    render(
      <UserContext.Provider value={userNormal}>
        <FormContext {...formContext}>
          <RecordLavorazioneOssidoForm />
        </FormContext>
      </UserContext.Provider>
    );
    expect(screen.getByLabelText(/data/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ora/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/operatore/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/modello/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/lotto/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/idoneità/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/dichiarate/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/conformi/i)).toBeInTheDocument();
    expect(screen.getByText(/scarto/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/difetti del materiale/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/difetti da sporco/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/difetti meccanici/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/difetti del trattamento/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/difetti altri/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/verifiche preliminari/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/pulizia/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/filetto m6/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/accantonato campione/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/master/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/spessore ossido/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/spessore minimo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/spessore massimo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/spessore deviazione/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/temperatura soda/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/temperatura ossido/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/temperatura colore/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/temperatura fissaggio/i)).toBeInTheDocument();
  });
});
