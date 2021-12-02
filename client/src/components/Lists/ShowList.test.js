import { screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import API from "../../api";
import { renderWithStore, ErrorResponse } from "../testHelpers";
import { ShowList } from "./ShowList";
import { Notification } from "../Notification";

describe("ShowList", () => {
  const match = { params: { list_id: "123" } };
  const mockAPIGet = jest.spyOn(API, "Get");

  const expectLoadingSpinner = () =>
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  const expectNoLoadingSpinner = () => expect(screen.queryByTestId("loading-spinner")).toBeNull();

  beforeEach(() => {
    mockAPIGet.mockReset();
  });

  afterEach(() => {
    expect(mockAPIGet).toHaveBeenCalledTimes(1);
    expect(mockAPIGet.mock.calls[0][0]).toBe("/lists/123");
    expectNoLoadingSpinner();
  });

  test("rendering successful request", async () => {
    const list = {
      id: 123,
      name: "list1",
      addresses: [
        {
          value: "foobar",
          testnet: false,
        },
      ],
    };
    mockAPIGet.mockResolvedValue({ data: { list } });
    renderWithStore(
      <MemoryRouter>
        <Notification />
        <ShowList match={match} />
      </MemoryRouter>
    );
    expectLoadingSpinner();
    await waitFor(() => expect(screen.getByText("list1")));
  });

  test("rendering request with error", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    const error = "foobar";
    mockAPIGet.mockRejectedValue(new ErrorResponse(error, 400));
    renderWithStore(
      <MemoryRouter>
        <Notification />
        <ShowList match={match} />
      </MemoryRouter>
    );
    expectLoadingSpinner();
    await waitFor(() => expect(screen.getByText(error)));
  });
});
