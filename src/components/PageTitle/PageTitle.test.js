import { render, screen } from "@testing-library/react";
import PageTitle from "./PageTitle";

describe("PageTitle", () => {
  test("Render corretto", async () => {
    render(<PageTitle>ciao</PageTitle>);
    expect(screen.getByText("ciao")).toBeInTheDocument();
  });
});
