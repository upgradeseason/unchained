import { screen, fireEvent } from "@testing-library/react";
import { renderWithStore } from "./testHelpers";
import { Notification } from "./Notification";

describe("Notification", () => {
  test("it does not display if it is not open", () => {
    renderWithStore(<Notification />, {
      notification: { message: "hello", isOpen: false },
    });
    expect(screen.queryByText("hello")).toBeNull();
  });

  describe("when open", () => {
    beforeEach(() => {
      renderWithStore(
        <div>
          <Notification />
          <p>something else</p>
        </div>,
        { initialState: { notification: { message: "hello", isOpen: true } } }
      );
    });

    test("it renders", () => {
      expect(screen.getByText("hello")).toBeInTheDocument();
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    test("clicking the close button closes it", () => {
      expect(screen.getByText("hello")).toBeInTheDocument();
      const closeButton = screen.getByRole("button");
      fireEvent.click(closeButton);
      expect(screen.queryByText("hello")).toBeNull();
    });
  });
});
