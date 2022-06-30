import { fireEvent, render, screen } from "@testing-library/react";
import PlusIcon from "./PlusIcon";

describe("Plus Icon", () => {
  test("Render correttamente", async () => {
    const props = { disabled: false, onClick: jest.fn() }
    render(<PlusIcon {...props} />);
    fireEvent.click(screen.getByTestId(/icon-plus/i))
    expect(props.onClick).toHaveBeenCalledTimes(1)
  });
  test("Render correttamente icona disabilitata", async () => {
    const props = { disabled: true, onClick: jest.fn() }
    render(<PlusIcon {...props} />);
    fireEvent.click(screen.getByTestId(/icon-plus/i))
    expect(props.onClick).toHaveBeenCalledTimes(0)
  });
});
