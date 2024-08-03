import { render, screen } from "@testing-library/react";
import NotFoundPage from "../404";

describe("NotFoundPage", () => {
  test("renders not found message", () => {
    render(<NotFoundPage />);
    expect(screen.getByText("Page Not Found")).toBeInTheDocument();
  });

  test("home link works correctly", () => {
    render(<NotFoundPage />);
    expect(screen.getByRole("link", { name: "Go to Home" })).toHaveAttribute(
      "href",
      "/",
    );
  });
});
