import { screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Table, TableBody } from "@material-ui/core";
import API from "../../api";
import { renderWithStore, ErrorResponse } from "../testHelpers";
import { ListForAddress } from "./ListForAddress";
import { Notification } from "../Notification";

describe("ListForAddress", () => {
  const mockAPIDelete = jest.spyOn(API, "Delete");

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

  const list = address.lists[0];

  let viewButton;
  let deleteButton;

  const getViewButton = () => screen.getByRole("button", { name: "View" });
  const getDeleteButton = () => screen.getByRole("button", { name: "Delete" });

  beforeEach(() => {
    mockAPIDelete.mockReset();
  });

  test("it renders the list row", () => {
    renderWithStore(
      <MemoryRouter>
        <Table>
          <TableBody>
            <ListForAddress list={list} />
          </TableBody>
        </Table>
      </MemoryRouter>,
      { initialState: { address } }
    );
    viewButton = getViewButton();
    deleteButton = getDeleteButton();
    expect(screen.getByText("List 1")).toBeInTheDocument();
    expect(viewButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
    expect(viewButton).toBeInTheDocument();
    expect(viewButton).toHaveAttribute("href", "/lists/123");
  });

  describe("clicking the 'Delete' button", () => {
    beforeEach(() => {
      renderWithStore(
        <MemoryRouter>
          <Notification />
          <Table>
            <TableBody>
              <ListForAddress list={list} />
            </TableBody>
          </Table>
        </MemoryRouter>,
        { initialState: { address } }
      );
      deleteButton = getDeleteButton();
    });

    afterEach(() => {
      expect(mockAPIDelete).toHaveBeenCalledTimes(1);
      expect(mockAPIDelete.mock.calls[0][0]).toEqual("/lists/123/addresses/1abc");
    });

    test("on a successful delete request", async () => {
      mockAPIDelete.mockResolvedValue({ data: {} });
      expect(deleteButton).toBeEnabled();
      fireEvent.click(deleteButton);
      await waitFor(() => {
        expect(deleteButton).toBeDisabled();
      });
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
    });
  });
});
