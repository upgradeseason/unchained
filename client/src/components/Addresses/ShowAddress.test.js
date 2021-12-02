import { screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import API from "../../api";
import { renderWithStore, ErrorResponse } from "../testHelpers";
import { ShowAddress } from "./ShowAddress";
import { Notification } from "../Notification";

describe("ShowAddress", () => {
  const match = { params: { value: "1abc" } };
  const mockAPIGet = jest.spyOn(API, "Get");

  const expectLoadingSpinner = () =>
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  const expectNoLoadingSpinner = () => expect(screen.queryByTestId("loading-spinner")).toBeNull();

  beforeEach(() => {
    mockAPIGet.mockReset();
  });

  afterEach(() => {
    expect(mockAPIGet).toHaveBeenCalledTimes(1);
    expect(mockAPIGet.mock.calls[0][0]).toBe("/addresses/1abc");
    expectNoLoadingSpinner();
  });

  test("rendering successful request", async () => {
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
    mockAPIGet.mockResolvedValue({ data: { address } });
    renderWithStore(
      <MemoryRouter>
        <Notification />
        <ShowAddress match={match} />
      </MemoryRouter>
    );
    expectLoadingSpinner();
    await waitFor(() => expect(screen.getByText("1abc")));
    expect(screen.getByText("List 1"));
    expect(screen.getByText("List 2"));
  });

  test("rendering request with error", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    const error = "foobar";
    mockAPIGet.mockRejectedValue(new ErrorResponse(error, 400));
    renderWithStore(
      <MemoryRouter>
        <Notification />
        <ShowAddress match={match} />
      </MemoryRouter>
    );
    expectLoadingSpinner();
    await waitFor(() => expect(screen.getByText(error)));
  });
});
