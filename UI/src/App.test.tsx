import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders example component", () => {
  render(<App />);
  const linkElement = screen.getByText(/TitanStar Legends/i);
  expect(linkElement).toBeInTheDocument();
});
