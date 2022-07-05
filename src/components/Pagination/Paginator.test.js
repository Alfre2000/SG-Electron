import { fireEvent, render, screen } from "@testing-library/react";
import Paginator from "./Paginator";
import { apiGet } from "../../api/api";
import { act } from "react-dom/test-utils";
jest.mock("../../api/api", () => ({ apiGet: jest.fn() }));

const data = {
  count: 1000,
  previous: null,
  next: "https://localhost:8000/test-url/?impianto=2&page=2",
  results: { length: 25 },
};

describe("Paginator", () => {
  test("Render corretto prima pagina", async () => {
    const props = { data: data, setData: jest.fn() };
    const promise = Promise.resolve({
      ...data,
      previous: "https://localhost:8000/test-url/?impianto=2&page=1",
      next: "https://localhost:8000/test-url/?impianto=2&page=3",
    });
    apiGet.mockImplementation(() => promise);
    render(<Paginator {...props} />);
    expect(screen.getByText(/Pagina 1 di 40/i)).toBeInTheDocument();
    expect(screen.queryByText(/Precedente/i)).not.toBeInTheDocument();
    expect(screen.getByText(/successiva/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/successiva/i));
    await act(() => promise);
    expect(apiGet).toBeCalledWith(
      "https://localhost:8000/test-url/?impianto=2&page=2"
    );

    fireEvent.click(screen.getByText(/»/i));
    await act(() => promise);
    expect(apiGet).toHaveBeenLastCalledWith(
      "https://localhost:8000/test-url/?impianto=2&page=last"
    );
    expect(props.setData).toHaveBeenCalledTimes(2);
  });
  test("Render corretto pagina in mezzo e senza impianto", async () => {
    const props = {
      data: {
        ...data,
        previous: "https://localhost:8000/test-url/?page=5",
        next: "https://localhost:8000/test-url/?page=7",
      },
      setData: jest.fn(),
    };
    const promise = Promise.resolve(data);
    apiGet.mockImplementation(() => promise);
    render(<Paginator {...props} />);
    expect(screen.getByText(/Pagina 6 di 40/i)).toBeInTheDocument();
    expect(screen.getByText(/Precedente/i)).toBeInTheDocument();
    expect(screen.getByText(/successiva/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/«/i));
    await act(() => promise);
    expect(apiGet).toHaveBeenLastCalledWith(
      "https://localhost:8000/test-url/?page=1"
    );
    fireEvent.click(screen.getByText(/precedente/i));
    await act(() => promise);
    expect(apiGet).toHaveBeenLastCalledWith(
      "https://localhost:8000/test-url/?page=5"
    );
    fireEvent.click(screen.getByText(/successiva/i));
    await act(() => promise);
    expect(apiGet).toHaveBeenLastCalledWith(
      "https://localhost:8000/test-url/?page=7"
    );
    fireEvent.click(screen.getByText(/»/i));
    await act(() => promise);
    expect(apiGet).toHaveBeenLastCalledWith(
      "https://localhost:8000/test-url/?page=last"
    );

    expect(props.setData).toHaveBeenCalledTimes(4);
  });
});
