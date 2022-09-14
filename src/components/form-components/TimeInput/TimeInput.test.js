import { render, screen } from "@testing-library/react";
import FormContext from "../../../contexts/FormContext";
import TimeInput from "./TimeInput";

jest.useFakeTimers().setSystemTime(new Date("2020-01-01 12:00"));

describe("TimeInput", () => {
  test("Render corretto", async () => {
    const formContext = {};
    render(
      <FormContext {...formContext}>
        <TimeInput />
      </FormContext>
    );
    expect(screen.getByPlaceholderText(/ora/i)).toHaveValue("12:00");
  });
  test("Render corretto: initial data presente", async () => {
    const formContext = { initialData: { data: "2021-01-01 12:12:00" } };
    render(
      <FormContext {...formContext}>
        <TimeInput />
      </FormContext>
    );
    expect(screen.getByPlaceholderText(/ora/i)).toHaveValue("12:12");
  });
  test("Render corretto: view => true", async () => {
    const formContext = { view: true };
    render(
      <FormContext {...formContext}>
        <TimeInput />
      </FormContext>
    );
    expect(screen.getByPlaceholderText(/ora/i)).toHaveAttribute("disabled");
  });
  test("Render corretto: errori presenti", async () => {
    const formContext = { errors: { ora: ["formato sbagliato"] } };
    render(
      <FormContext {...formContext}>
        <TimeInput />
      </FormContext>
    );
    expect(screen.getByPlaceholderText(/ora/i)).toHaveClass("is-invalid");
  });
});
