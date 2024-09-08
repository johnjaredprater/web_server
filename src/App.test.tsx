import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("Renders Login Page", () => {
  render(<App />);
  const linkElement = screen.getByText(/GymTrack/i);
  expect(linkElement).toBeInTheDocument();

  const singInButton = screen.getByText(/Sign In with Google/i);
  expect(singInButton).toBeInTheDocument();
});
