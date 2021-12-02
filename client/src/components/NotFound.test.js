import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { NotFound } from "./NotFound";

describe(NotFound, () => {
  test("it renders", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );
    expect(screen.getByText("Not Found")).toBeInTheDocument();
    const returnHomeLink = screen.getByText("Return Home");
    expect(returnHomeLink).toBeInTheDocument();
    expect(returnHomeLink.closest("a")).toHaveAttribute("href", "/");
  });
});
