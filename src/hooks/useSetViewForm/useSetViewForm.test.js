import { render, screen } from "@testing-library/react";
import useSetViewForm from "./useSetViewForm";

const TestComponent = (disabled) => {
  useSetViewForm(disabled);
  return (
    <form>
      <input type="checkbox" />
      <input type="text" />
    </form>
  );
};

describe("useSetViewForm", () => {
  test("Se disabled è false gli input devono essere visibili", async () => {
    render(<TestComponent disabled={false}/>);
    expect(screen.getByRole("textbox")).not.toBeDisabled();
    expect(screen.getByRole("checkbox")).not.toBeDisabled();
  });
});
