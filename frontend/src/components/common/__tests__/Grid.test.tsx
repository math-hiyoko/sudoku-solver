import { render, fireEvent, screen } from "@testing-library/react";
import Grid from "../Grid";

describe("Grid Component", () => {
  const mockBoard = [
    8, 1, 2, 7, 5, 3, 6, 4, 9, 9, 4, 3, 6, 8, 2, 1, 7, 5, 6, 7, 5, 4, 9, 1, 2,
    8, 3, 1, 5, 4, 2, 3, 7, 8, 9, 6, 3, 6, 9, 8, 4, 5, 7, 2, 1, 2, 8, 7, 1, 6,
    9, 5, 3, 4, 5, 2, 1, 9, 7, 4, 3, 6, 8, 4, 3, 8, 5, 2, 6, 9, 1, 7, 7, 9, 6,
    3, 1, 8, 4, 5, 2,
  ];
  const mockErrorDetails = [1, 3];

  test("renders grid with correct values", () => {
    const { getAllByRole } = render(
      <Grid board={mockBoard} errorDetails={[]} cellColors={[]} />,
    );
    expect(getAllByRole("textbox").length).toBe(81);
  });

  test("handles click events correctly", () => {
    const mockOnClick = jest.fn();
    const { getByTestId } = render(
      <Grid
        board={mockBoard}
        onCellClick={mockOnClick}
        errorDetails={[]}
        cellColors={[]}
      />,
    );
    const cells = screen.getAllByRole("textbox");
    fireEvent.click(cells[0]);
    expect(mockOnClick).toHaveBeenCalledWith(0);
  });

  test("applies error styling correctly", () => {
    const { getByTestId } = render(
      <Grid
        board={mockBoard}
        errorDetails={mockErrorDetails}
        cellColors={[]}
      />,
    );
    const cells = screen.getAllByRole("textbox");
    expect(cells[1]).toHaveStyle("background-color: lightcoral");
    expect(cells[3]).toHaveStyle("background-color: lightcoral");
  });
});
