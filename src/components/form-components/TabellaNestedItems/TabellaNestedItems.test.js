import { fireEvent, render, screen } from "@testing-library/react";
import TabellaNestedItems from "./TabellaNestedItems";

describe("TabellaNestedItems", () => {
  test("Render corretto", async () => {
    const props = {
      name: "test",
      view: false,
      colonne: [{ name: "nome" }, { name: "tipo_colore", type: "number" }],
    };
    render(<TabellaNestedItems {...props} />);
    expect(screen.getByText("Nome")).toBeInTheDocument();
    expect(screen.getByText("Tipo colore")).toBeInTheDocument();
    expect(screen.getAllByRole("columnheader").length).toBe(3);

    const firstInput = screen.getByRole("textbox");
    const secondInput = screen.getByRole("spinbutton");
    const plusIcon =
      screen.getAllByTestId("icon-plus")[
        screen.getAllByTestId("icon-plus").length - 1
      ];

    fireEvent.change(firstInput, { target: { value: "test input" } });
    fireEvent.change(secondInput, { target: { value: 2 } });

    expect(firstInput).toHaveValue("test input");
    expect(secondInput).toHaveValue(2);

    fireEvent.click(plusIcon); // Aggiungo una nuova riga

    expect(screen.getAllByRole("row").length).toBe(4);

    fireEvent.click(plusIcon); // Aggiungo una nuova riga
    expect(screen.getAllByRole("row").length).toBe(5);

    let minusIcon =
      screen.getAllByTestId("icon-minus")[
        screen.getAllByTestId("icon-minus").length - 2
      ];
    fireEvent.click(minusIcon); // Elimino la riga in mezzo

    expect(screen.getAllByRole("row").length).toBe(4);
    expect(firstInput).toHaveValue("test input");
    expect(secondInput).toHaveValue(2);

    minusIcon =
      screen.getAllByTestId("icon-minus")[
        screen.getAllByTestId("icon-minus").length - 2
      ];
    fireEvent.click(minusIcon); // Elimino la prima riga

    expect(screen.getAllByRole("row").length).toBe(3);
    expect(firstInput).toHaveValue("");
    expect(secondInput).toHaveValue(null);
  });
  test("Initial data inserito correttamente", async () => {
    const props = {
      name: "test",
      initialData: {
        test: [
          { nome: "alfredo", tipo_colore: 2, id: "1234", finito: true },
          { nome: "carlo", tipo_colore: 3, id: "1235", finito: true },
        ],
      },
      view: false,
      colonne: [
        { name: "nome" },
        { name: "tipo_colore", type: "number" },
        { name: "finito", type: "hidden", value: true },
      ],
    };
    render(<TabellaNestedItems {...props} />);
    expect(screen.getAllByRole("row").length).toBe(4);
    expect(screen.getAllByTestId("hidden-id")[0]).toHaveValue("1234");
    expect(screen.getAllByTestId("hidden-id")[1]).toHaveValue("1235");

    fireEvent.click(screen.getAllByTestId("icon-minus")[0]); // Elimino la prima riga

    expect(screen.getByRole("textbox")).toHaveValue("carlo");
    expect(screen.getByRole("spinbutton")).toHaveValue(3);
    expect(screen.getByTestId("hidden-input")).toHaveValue("true");
  });
});
