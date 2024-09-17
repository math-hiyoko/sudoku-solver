import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import IndexPage from "../index";
import { act } from "react";

const mockFetch = jest.fn().mockResolvedValue({
  json: () => Promise.resolve({
    solution: [
      [8, 1, 2, 7, 5, 3, 6, 4, 9],
      [9, 4, 3, 6, 8, 2, 1, 7, 5],
      [6, 7, 5, 4, 9, 1, 2, 8, 3],
      [1, 5, 4, 2, 3, 7, 8, 9, 6],
      [3, 6, 9, 8, 4, 5, 7, 2, 1],
      [2, 8, 7, 1, 6, 9, 5, 3, 4],
      [5, 2, 1, 9, 7, 4, 3, 6, 8],
      [4, 3, 8, 5, 2, 6, 9, 1, 7],
      [7, 9, 6, 3, 1, 8, 4, 5, 2],
    ],
    num_solutions: 1,
    is_exact_num_solutions: true,
  }),
});

global.fetch = mockFetch;

jest.mock('gatsby', () => ({
  ...jest.requireActual('gatsby'),
  navigate: jest.fn(),
}));

describe("IndexPage", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  test("renders correctly", () => {
    render(<IndexPage />);
    expect(screen.getByText("Sudoku Solver")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Solve" })).toBeInTheDocument();
  });

  test('solve button triggers solving logic', async () => {
    const { getByTestId } = render(<IndexPage />);
    await act(async () => {
      fireEvent.click(getByTestId('solve-button'));
      await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1));
    });
  });
});
