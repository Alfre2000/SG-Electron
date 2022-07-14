import { fireEvent, render, screen } from "@testing-library/react";
import FormContext from "../../../contexts/FormContext";
import PlusIcon from "./PlusIcon";

describe("Plus Icon", () => {
  test("Render correttamente", async () => {
    const props = { onClick: jest.fn() };
    render(
      <FormContext view={false}>
        <PlusIcon {...props} />
      </FormContext>
    );
    fireEvent.click(screen.getByTestId(/icon-plus/i));
    expect(props.onClick).toHaveBeenCalledTimes(1);
  });
  test("Render correttamente icona disabilitata", async () => {
    const props = { onClick: jest.fn() };
    render(
      <FormContext view={true}>
        <PlusIcon {...props} />
      </FormContext>
    );
    fireEvent.click(screen.getByTestId(/icon-plus/i));
    expect(props.onClick).toHaveBeenCalledTimes(0);
  });
});
