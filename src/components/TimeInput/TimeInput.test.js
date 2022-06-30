import { render, screen } from "@testing-library/react";
import TimeInput from "./TimeInput";

jest.useFakeTimers().setSystemTime(new Date('2020-01-01 12:00'));

describe("TimeInput", () => {
  test("Render corretto: initial data presente", async () => {
    const props = { initialData: { data: "2021-01-01 12:12:00" } };
    render(<TimeInput {...props} />);
    expect(screen.getByPlaceholderText(/ora/i)).toHaveValue("12:12")
  });
  test("Render corretto: initial data assente", async () => {
    const props = { initialData: {} };
    render(<TimeInput {...props} />);
    expect(screen.getByPlaceholderText(/ora/i)).toHaveValue("12:00")
  });
});
