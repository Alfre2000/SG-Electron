import { render, screen } from "@testing-library/react";
import Analisi from "../Analisi";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import UserContext from "../../../../UserContext";
import useGetAPIData from "../../../../hooks/useGetAPIData/useGetAPIData";
jest.mock("../../../../hooks/useGetAPIData/useGetAPIData", () => jest.fn());

describe("Analisi", () => {
  test("Render correttamente", async () => {
    const history = createMemoryHistory();
    const user = { user: { user: { username: "Test" } } };
    useGetAPIData.mockImplementation(() => [
      {
        operatori: [{ id: 3, nome: "Test Operatore" }],
        operazioni: [
          { id: "b58c138a-282a-45d1-bdd1-c430fcc945a9", nome: "Test Analisi" },
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
      },
    ]);
    render(
      <Router location={history.location} navigator={history}>
        <UserContext.Provider value={user}>
          <Analisi />
        </UserContext.Provider>
      </Router>
    );
    expect(screen.getByLabelText(/controanalisi/i)).toBeInTheDocument();
    expect(screen.getByText(/test operatore/i)).toBeInTheDocument();
    expect(screen.getByText(/test analisi/i)).toBeInTheDocument();
    expect(screen.getByText("12/7/2022")).toBeInTheDocument();
    expect(screen.getByText("17:46")).toBeInTheDocument();
    expect(screen.getByText(/salva/i)).toBeInTheDocument();
  });
});
