import { render, screen, fireEvent } from "@testing-library/react";
import ViewModal from "./ViewModal";

describe("Confirm Modal", () => {
  test("Render correttamente con show true", async () => {
    const props = {
      show: true,
      handleClose: jest.fn(),
    };
    render(<ViewModal {...props}>ciao</ViewModal>);
    expect(screen.getByText(/chiudi/i)).toBeInTheDocument();
    expect(screen.getByText(/ciao/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/chiudi/i));
    expect(props.handleClose).toHaveBeenLastCalledWith(false);
    expect(props.handleClose).toHaveBeenCalledTimes(1);
  });
});
