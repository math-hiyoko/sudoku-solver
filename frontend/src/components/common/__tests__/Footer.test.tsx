import { render } from "@testing-library/react";
import Footer from "../Footer";

test("Footer renders correctly", () => {
  const { getByText } = render(<Footer />);
  const footerElement = getByText(
    /© 2024 KOKI Watanabe. All rights reserved./i,
  );
  expect(footerElement).toBeInTheDocument();
});
