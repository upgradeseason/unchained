import { screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import API from "../../api";
import history from "../../history";
import { renderWithStore, ErrorResponse } from "../testHelpers";
import { ListDetail } from "./ListDetail";
import { Notification } from "../Notification";

describe("ListDetail", () => {
  const list = {
    id: 123,
    name: "list1",
    addresses: [
      {
        value: "addr1",
        testnet: false,
      },
      {
        value: "addr2",
        testnet: false,
      },
    ],
  };

  test("it renders the list", () => {
    renderWithStore(
      <MemoryRouter>
        <ListDetail />
      </MemoryRouter>,
      { initialState: { list } }
    );
    expect(screen.getByText("list1")).toBeInTheDocument();
    expect(screen.getByText("addr1")).toBeInTheDocument();
    expect(screen.getByText("addr2")).toBeInTheDocument();
    expect(screen.getByText("Delete List")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
  });

  describe("clicking the 'Delete List' button", () => {
    let deleteButton;
    const mockAPIDelete = jest.spyOn(API, "Delete");
    const mockHistoryPush = jest.spyOn(history, "push");

    beforeEach(() => {
      mockAPIDelete.mockReset();
      mockHistoryPush.mockReset();
      renderWithStore(
        <MemoryRouter>
          <Notification />
          <ListDetail />
        </MemoryRouter>,
        { initialState: { list } }
      );
      deleteButton = screen.getByText("Delete List").closest("button");
    });

    afterEach(() => {
      expect(mockAPIDelete).toHaveBeenCalledTimes(1);
      expect(mockAPIDelete.mock.calls[0][0]).toBe("/lists/123");
    });

    test("on a successful delete request", async () => {
      expect(deleteButton).toBeEnabled();
      fireEvent.click(deleteButton);
      expect(deleteButton).toBeDisabled();
      await waitFor(() => expect(mockHistoryPush).toHaveBeenCalledTimes(1));
      expect(mockHistoryPush.mock.calls[0][0]).toEqual("/");
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
