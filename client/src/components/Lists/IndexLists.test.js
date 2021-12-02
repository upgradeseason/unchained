import { screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import API from "../../api";
import { renderWithStore, ErrorResponse } from "../testHelpers";
import { IndexLists } from "./IndexLists";
import { Notification } from "../Notification";

describe("IndexLists", () => {
  const mockAPIGet = jest.spyOn(API, "Get");

  const expectLoadingSpinner = () =>
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  const expectNoLoadingSpinner = () => expect(screen.queryByTestId("loading-spinner")).toBeNull();

  beforeEach(() => {
    mockAPIGet.mockReset();
  });

  afterEach(() => {
    expect(mockAPIGet).toHaveBeenCalledTimes(1);
    expect(mockAPIGet.mock.calls[0][0]).toEqual("/lists");
    expectNoLoadingSpinner();
  });

  test("rendering successful request", async () => {
    const lists = [
      {
        id: 123,
        name: "list1",
        address_count: 2,
      },
      {
        id: 321,
        name: "list2",
        address_count: 0,
      },
    ];
    mockAPIGet.mockResolvedValue({ data: { lists } });
    renderWithStore(
      <MemoryRouter>
        <Notification />
        <IndexLists />
      </MemoryRouter>
    );
    expectLoadingSpinner();
    await waitFor(() => expect(screen.getByText("list1")));
    expect(screen.getByText("2 addresses"));
    expect(screen.getByText("list2"));
    expect(screen.getByText("0 addresses"));
  });

  test("rendering request with error", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    const error = "foobar";
    mockAPIGet.mockRejectedValue(new ErrorResponse(error, 400));
    renderWithStore(
      <MemoryRouter>
        <Notification />
        <IndexLists />
      </MemoryRouter>
    );
    expectLoadingSpinner();
    await waitFor(() => expect(screen.getByText(error)));
  });
});
