import { fireEvent, render, screen } from "@testing-library/react";
import MinusIcon from "./MinusIcon";

describe("Minus Icon", () => {
  test("Render correttamente", async () => {
    const props = { disabled: false, onClick: jest.fn() }
    render(<MinusIcon {...props} />);
    fireEvent.click(screen.getByTestId(/icon-minus/i))
    expect(props.onClick).toHaveBeenCalledTimes(1)
  });
  test("Render correttamente icona disabilitata", async () => {
    const props = { disabled: true, onClick: jest.fn() }
    render(<MinusIcon {...props} />);
    fireEvent.click(screen.getByTestId(/icon-minus/i))
    expect(props.onClick).toHaveBeenCalledTimes(0)
  });
});
