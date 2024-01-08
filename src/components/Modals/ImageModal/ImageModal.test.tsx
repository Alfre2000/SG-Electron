import { render, screen, fireEvent } from "@testing-library/react";
import ImageModal from "./ImageModal";

describe("Image Modal", () => {
  const props = {
    setShow: jest.fn(),
    url: "https://via.placeholder.com/150",
    titolo: "Sample Title",
  };

  test("renders correctly with given props", () => {
    render(<ImageModal {...props} />);
    expect(screen.getByRole('img')).toHaveAttribute('src', props.url);
    expect(screen.getByText(props.titolo)).toBeInTheDocument();
  });

  test("closes on backdrop click", () => {
    render(<ImageModal {...props} />);
    fireEvent.click(screen.getByTestId('image-modal'));
    expect(props.setShow).toHaveBeenCalledWith(false);
  });

  test("does not close on image click", () => {
    render(<ImageModal {...props} />);
    fireEvent.click(screen.getByRole('img'));
    expect(props.setShow).not.toHaveBeenCalled();
  });

  test("displays the title correctly", () => {
    render(<ImageModal {...props} />);
    expect(screen.getByText(props.titolo)).toBeInTheDocument();
  });
});
