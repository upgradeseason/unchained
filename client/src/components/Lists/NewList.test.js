import { screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import history from "../../history";
import API from "../../api";
import { renderWithStore, ErrorResponse } from "../testHelpers";
import { NewList } from "./NewList";
import { Notification } from "../Notification";

describe("NewList", () => {
  const mockAPIPost = jest.spyOn(API, "Post");
  const mockHistoryPush = jest.spyOn(history, "push");

  beforeEach(() => {
    mockAPIPost.mockReset();
    mockHistoryPush.mockReset();
  });

  let nameInput;
  let submitButton;

  const getNameInput = () => screen.getByLabelText(/Name/);
  const getSubmitButton = () => screen.getByRole("button", { name: "Create" });

  describe("the new form", () => {
    beforeEach(() => {
      renderWithStore(<NewList />);
      nameInput = getNameInput();
      submitButton = getSubmitButton();
    });

    it("renders a title, empty name input and disabled submit button", () => {
      expect(screen.getByText("Create List")).toBeInTheDocument();
      expect(nameInput).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });
  });

  describe("a form without a name value", () => {
    beforeEach(() => {
      renderWithStore(<NewList />);
      nameInput = getNameInput();
      fireEvent.change(nameInput, { target: { value: "foo" } });
      fireEvent.change(nameInput, { target: { value: "" } });
      submitButton = getSubmitButton();
    });

    it("renders an error message and disables submission of the form", () => {
      expect(nameInput).toHaveValue("");
      expect(submitButton).toBeDisabled();
      expect(screen.getByText(/Name is required/));
    });
  });

  describe("a form with a name value that is too long", () => {
    const badName = "a".repeat(51);

    beforeEach(() => {
      renderWithStore(<NewList />);
      nameInput = getNameInput();
      fireEvent.change(nameInput, { target: { value: badName } });
      submitButton = getSubmitButton();
    });

    it("renders an error message and disables submission of the form", () => {
      expect(nameInput).toHaveValue(badName);
      expect(submitButton).toBeDisabled();
      expect(screen.getByText(/Name cannot be longer than 50 characters/));
    });
  });

  describe("a valid but unsubmitted form", () => {
    const name = "foobar";

    beforeEach(() => {
      renderWithStore(
        <MemoryRouter>
          <Notification />
          <NewList />
        </MemoryRouter>
      );
      nameInput = getNameInput();
      fireEvent.change(nameInput, { target: { value: name } });
      submitButton = getSubmitButton();
    });

    it("enables form submission", () => {
      expect(nameInput).toHaveValue(name);
      expect(submitButton).toBeEnabled();
    });

    describe("submitting the form and getting an error", () => {
      const error = "Some server error";

      beforeEach(() => {
        jest.spyOn(console, "error").mockImplementation(() => {});
        mockAPIPost.mockRejectedValue(new ErrorResponse(error, 400));
        fireEvent.click(submitButton);
      });

      it("displays the error message", async () => {
        await waitFor(() => expect(screen.getByText(error)));
        expect(nameInput).toHaveValue(name);
        expect(submitButton).toBeEnabled();
        expect(mockHistoryPush).toHaveBeenCalledTimes(0);
      });
    });

    describe("submitting the form successfully", () => {
      const id = 123;

      beforeEach(() => {
        mockAPIPost.mockResolvedValue({ data: { id } });
        fireEvent.click(submitButton);
      });

      it("redirects to the show list page of the newly created list", async () => {
        await waitFor(() => expect(mockHistoryPush).toHaveBeenCalledTimes(1));
        expect(mockHistoryPush.mock.calls[0][0]).toEqual(`/lists/${id}`);
      });
    });
  });
});
