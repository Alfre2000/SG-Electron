import { render, screen } from "@testing-library/react";
import Hidden from "./Hidden";

describe("Hidden", () => {
  test("Render corretto", async () => {
    const props = {
      name: "bella",
      defaultValue: "ciao"
    };
    render(<Hidden {...props} />);
    expect(screen.getByTestId("input-hidden")).toHaveAttribute("name", "bella")
    expect(screen.getByTestId("input-hidden")).toHaveValue("ciao")
  });
})