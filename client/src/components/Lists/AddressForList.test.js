import { screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Table, TableBody } from "@material-ui/core";
import API from "../../api";
import { renderWithStore, ErrorResponse } from "../testHelpers";
import { AddressForList } from "./AddressForList";
import { Notification } from "../Notification";

describe("AddressForList", () => {
  const mockAPIDelete = jest.spyOn(API, "Delete");

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

  const address = list.addresses[0];

  let viewButton;
  let deleteButton;

  const getViewButton = () => screen.getByRole("button", { name: "View" });
  const getDeleteButton = () => screen.getByRole("button", { name: "Delete" });

  beforeEach(() => {
    mockAPIDelete.mockReset();
  });

  test("it renders the address row", () => {
    renderWithStore(
      <MemoryRouter>
        <Table>
          <TableBody>
            <AddressForList address={address} />
          </TableBody>
        </Table>
      </MemoryRouter>,
      { initialState: { list } }
    );
    viewButton = getViewButton();
    deleteButton = getDeleteButton();
    expect(screen.getByText("Mainnet")).toBeInTheDocument();
    expect(screen.getByText(address.value)).toBeInTheDocument();
    expect(viewButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
    expect(viewButton).toBeInTheDocument();
    expect(viewButton).toHaveAttribute("href", "/addresses/addr1");
  });

  describe("clicking the 'Delete' button", () => {
    beforeEach(() => {
      renderWithStore(
        <MemoryRouter>
          <Notification />
          <Table>
            <TableBody>
              <AddressForList address={address} />
            </TableBody>
          </Table>
        </MemoryRouter>,
        { initialState: { list } }
      );
      deleteButton = getDeleteButton();
    });

    afterEach(() => {
      expect(mockAPIDelete).toHaveBeenCalledTimes(1);
      expect(mockAPIDelete.mock.calls[0][0]).toEqual("/lists/123/addresses/addr1");
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
