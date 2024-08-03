import { render, fireEvent } from "@testing-library/react";
import NumberInput from "../NumberInput";

describe("NumberInput Component", () => {
  test("renders numbers and delete button correctly", () => {
    const { getByText } = render(<NumberInput onSelect={() => {}} />);
    expect(getByText("1")).toBeInTheDocument();
    expect(getByText("削除")).toBeInTheDocument();
  });

  test("returns selected number on click", () => {
    const mockOnSelect = jest.fn();
    const { getByText } = render(<NumberInput onSelect={mockOnSelect} />);
    fireEvent.click(getByText("1"));
    expect(mockOnSelect).toHaveBeenCalledWith(1);
  });

  test("returns delete on delete button click", () => {
    const mockOnSelect = jest.fn();
    const { getByText } = render(<NumberInput onSelect={mockOnSelect} />);
    fireEvent.click(getByText("削除"));
    expect(mockOnSelect).toHaveBeenCalledWith("delete");
  });
});
