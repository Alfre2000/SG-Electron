import { render, screen, fireEvent } from "@testing-library/react";
import ConfirmModal from "./ConfirmModal";

describe("Confirm Modal", () => {
  test("Render correttamente con show true", async () => {
    const props = {
      show: true,
      handleClose: jest.fn(),
    };
    render(<ConfirmModal {...props} />);
    expect(screen.getByText(/chiudi/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/chiudi/i));
    expect(props.handleClose).toHaveBeenLastCalledWith(false);
    fireEvent.click(screen.getByText("Elimina"));
    expect(props.handleClose).toHaveBeenLastCalledWith(true);
    expect(props.handleClose).toHaveBeenCalledTimes(2);
  });
});
