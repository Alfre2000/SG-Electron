import { render, screen } from "@testing-library/react";
import MyToast from "./MyToast";

describe("MyToast", () => {
  test("Render corretto", async () => {
    render(<MyToast>ciao</MyToast>);
    expect(screen.getByText("ciao")).toBeInTheDocument();
  });
});
