import { render, screen, fireEvent } from "@testing-library/react";
import ModifyModal from "./ModifyModal";

describe("Modify Modal", () => {
  const props = {
    show: true,
    handleClose: jest.fn(),
  };
  test("Render correttamente con show true", async () => {
    render(<ModifyModal {...props}>ciao</ModifyModal>);
    expect(screen.getByText(/chiudi/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/chiudi/i));
    expect(props.handleClose).toHaveBeenLastCalledWith(false);
    expect(props.handleClose).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/ciao/i)).toBeInTheDocument();
  });
});
