import { render, screen } from "@testing-library/react";
import FormContext from "../../../contexts/FormContext";
import DateInput from "./DateInput";

jest.useFakeTimers().setSystemTime(new Date("2020-01-01 12:00"));

describe("DateInput", () => {
  test("Render corretto", async () => {
    const formContext = {};
    render(
      <FormContext {...formContext}>
        <DateInput />
      </FormContext>
    );
    expect(screen.getByLabelText(/data/i)).toHaveValue("2020-01-01");
  });
  test("Render corretto: initial data presente", async () => {
    const formContext = { initialData: { data: "2021-01-01 12:12:00" } };
    render(
      <FormContext {...formContext}>
        <DateInput />
      </FormContext>
    );
    expect(screen.getByLabelText(/data/i)).toHaveValue("2021-01-01");
  });
  test("Render corretto: view => true", async () => {
    const formContext = { view: true };
    render(
      <FormContext {...formContext}>
        <DateInput />
      </FormContext>
    );
    expect(screen.getByLabelText(/data/i)).toHaveAttribute("disabled");
  });
  test("Render corretto: errori presenti", async () => {
    const formContext = { errors: { data: ["formato sbagliato"] } };
    render(
      <FormContext {...formContext}>
        <DateInput />
      </FormContext>
    );
    expect(screen.getByLabelText(/data/i)).toHaveClass("is-invalid");
  });
});
