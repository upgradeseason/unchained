import { screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Table, TableBody } from "@material-ui/core";
import API from "../../api";
import { renderWithStore, ErrorResponse } from "../testHelpers";
import { NewAddressForList } from "./NewAddressForList";
import { Notification } from "../Notification";

describe("NewAddressForList", () => {
  const mockAPIPost = jest.spyOn(API, "Post");
  const validMainnet = "3P14159f73E4gFr7JterCCQh9QjiTjiZrG";
  const validTestnet = "mohjSavDdQYHRYXcS3uS6ttaHP8amyvX78";
  const id = "123";
  beforeEach(() => {
    mockAPIPost.mockReset();
  });

  let addressInput;
  let submitButton;
  let networkSwitch;

  const getAddressInput = () => screen.getByLabelText(/Address/);
  const getSubmitButton = () => screen.getByRole("button", { name: "Add" });
  const getSwitch = (name = "Mainnet") => screen.getByRole("checkbox", { name });
  const updateAddress = address =>
    fireEvent.change(getAddressInput(), { target: { value: address } });
  const flipSwitch = () => fireEvent.click(getSwitch());

  const renderComponent = () =>
    renderWithStore(
      <MemoryRouter>
        <Notification />
        <Table>
          <TableBody>
            <NewAddressForList id={id} />
          </TableBody>
        </Table>
      </MemoryRouter>
    );

  describe("the new form", () => {
    beforeEach(() => {
      renderComponent();
      addressInput = getAddressInput();
      submitButton = getSubmitButton();
      networkSwitch = getSwitch();
    });

    it("renders a network switch, address field, and an add button", () => {
      expect(addressInput).toBeInTheDocument();
      expect(networkSwitch).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });
  });

  describe("a form without an address value", () => {
    beforeEach(() => {
      renderComponent();
      addressInput = getAddressInput();
      fireEvent.change(addressInput, { target: { value: "foo" } });
      fireEvent.change(addressInput, { target: { value: "" } });
      submitButton = getSubmitButton();
    });

    it("renders an error message and disables submission of the form", () => {
      expect(addressInput).toHaveValue("");
      expect(submitButton).toBeDisabled();
      expect(screen.getByText(/Address cannot be blank/));
    });
  });

  describe("a form with invalid address inputs", () => {
    beforeEach(() => {
      renderComponent();
    });

    it("renders an error message for addresses that are too short", async () => {
      updateAddress("3foobar");
      await waitFor(() => {
        expect(screen.getByText(/Address is invalid/i));
      });
    });

    it("renders an error message for addresses that are too long", async () => {
      const address = `${validMainnet}foobar`;
      updateAddress(address);
      await waitFor(() => {
        expect(screen.getByText(/Address is invalid/i));
      });
    });

    it("renders an error message for incorrect mainnet addresses", async () => {
      updateAddress(validTestnet);
      await waitFor(() => {
        expect(screen.getByText(/Address must start with/i));
      });
    });

    it("renders an error message for incorrect testnet addresses", async () => {
      flipSwitch();
      updateAddress(validMainnet);
      await waitFor(() => {
        expect(screen.getByText(/Address must start with/i));
      });
    });
  });

  describe("a valid but unsubmitted form", () => {
    beforeEach(() => {
      renderComponent();
      addressInput = getAddressInput();
      submitButton = getSubmitButton();
      updateAddress(validMainnet);
    });

    it("enables form submission", () => {
      expect(addressInput).toHaveValue(validMainnet);
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
        expect(addressInput).toHaveValue(validMainnet);
        expect(submitButton).toBeEnabled();
      });
    });

    describe("submitting the form successfully", () => {
      beforeEach(() => {
        mockAPIPost.mockResolvedValue({ data: { testnet: false } });
        fireEvent.click(submitButton);
      });

      it("submits the new address", async () => {
        await waitFor(() => expect(mockAPIPost).toHaveBeenCalledTimes(1));
        expect(mockAPIPost.mock.calls[0][0]).toEqual(`/lists/${id}/addresses/${validMainnet}`);
      });
    });
  });
});
