import { fireEvent, render, screen } from "@testing-library/react";
import FormContext from "../../../contexts/FormContext";
import MinusIcon from "./MinusIcon";

describe("Minus Icon", () => {
  test("Render correttamente", async () => {
    const props = { onClick: jest.fn() };
    render(
      <FormContext view={false}>
        <MinusIcon {...props} />
      </FormContext>
    );
    fireEvent.click(screen.getByTestId(/icon-minus/i));
    expect(props.onClick).toHaveBeenCalledTimes(1);
  });
  test("Render correttamente icona disabilitata", async () => {
    const props = { onClick: jest.fn() };
    render(
      <FormContext view={true}>
        <MinusIcon {...props} />
      </FormContext>
    );
    fireEvent.click(screen.getByTestId(/icon-minus/i));
    expect(props.onClick).toHaveBeenCalledTimes(0);
  });
});
