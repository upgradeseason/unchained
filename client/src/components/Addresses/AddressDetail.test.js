import { screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import API from "../../api";
import history from "../../history";
import { renderWithStore, ErrorResponse } from "../testHelpers";
import { AddressDetail } from "./AddressDetail";
import { Notification } from "../Notification";

describe("AddressDetail", () => {
  const address = {
    value: "1abc",
    testnet: false,
    lists: [
      {
        id: 123,
        name: "List 1",
      },
      {
        id: 77,
        name: "List 2",
      },
    ],
  };

  test("it renders the address", () => {
    renderWithStore(
      <MemoryRouter>
        <AddressDetail />
      </MemoryRouter>,
      { initialState: { address } }
    );
    expect(screen.getByText("1abc")).toBeInTheDocument();
    expect(screen.getByText("List 1")).toBeInTheDocument();
    expect(screen.getByText("List 2")).toBeInTheDocument();
    expect(screen.getByText("Delete Address")).toBeInTheDocument();
  });

  describe("clicking the 'Delete Address' button", () => {
    let deleteButton;
    const mockAPIDelete = jest.spyOn(API, "Delete");
    const mockHistoryPush = jest.spyOn(history, "push");

    beforeEach(() => {
      mockAPIDelete.mockReset();
      mockHistoryPush.mockReset();
      renderWithStore(
        <MemoryRouter>
          <Notification />
          <AddressDetail />
        </MemoryRouter>,
        { initialState: { address } }
      );
      deleteButton = screen.getByText("Delete Address").closest("button");
    });

    afterEach(() => {
      expect(mockAPIDelete).toHaveBeenCalledTimes(1);
      expect(mockAPIDelete.mock.calls[0][0]).toBe("/addresses/1abc");
    });

    test("on a successful delete request", async () => {
      expect(deleteButton).toBeEnabled();
      fireEvent.click(deleteButton);
      expect(deleteButton).toBeDisabled();
      await waitFor(() => expect(mockHistoryPush).toHaveBeenCalledTimes(1));
      expect(mockHistoryPush.mock.calls[0][0]).toEqual("/addresses");
    });

    test("on an unsuccessful delete request", async () => {
      const error = "foobar";
      jest.spyOn(console, "error").mockImplementation(() => {});
      mockAPIDelete.mockRejectedValue(new ErrorResponse(error, 400));
      expect(deleteButton).toBeEnabled();
      fireEvent.click(deleteButton);
      expect(deleteButton).toBeDisabled();
      await waitFor(() => expect(screen.getByText(error)));
      expect(deleteButton).toBeEnabled();
      expect(mockHistoryPush.mock.calls.length).toBe(0);
    });
  });
});
