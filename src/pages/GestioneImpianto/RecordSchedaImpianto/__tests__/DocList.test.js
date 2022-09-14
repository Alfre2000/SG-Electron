import { render, screen } from "@testing-library/react";
import DocList from "../DocList";

jest.useFakeTimers().setSystemTime(new Date("2020-01-01 12:00"));

describe("DocList", () => {
  test("Render correttamente", async () => {
    const props = {
      documenti: [
        { id: 1, documento: "/test 1/", titolo: "Documento 1" },
        { id: 2, documento: "/test 2/", titolo: "Documento 2" },
        { id: 3, documento: "/test 3/", titolo: "Documento 3" },
      ],
    };
    render(<DocList {...props} />);
    expect(screen.getByText(/documenti di supporto/i)).toBeInTheDocument();
    expect(screen.getByText(/documento 1/i)).toBeInTheDocument();
    expect(screen.getByText(/documento 2/i)).toBeInTheDocument();
    expect(screen.getByText(/documento 3/i)).toBeInTheDocument();
  });
});
