import { render, screen, fireEvent } from "@testing-library/react";
import IndexPage from "../index";

describe("IndexPage", () => {
  test("renders correctly", () => {
    render(<IndexPage />);
    expect(screen.getByText("Sudoku Solver")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Solve" })).toBeInTheDocument();
  });

  test("solve button triggers solving logic", () => {
    const { getByTestId } = render(<IndexPage />);
    fireEvent.click(getByTestId("solve-button"));
  });
});
