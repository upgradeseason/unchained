import { screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import API from "../../api";
import { renderWithStore, ErrorResponse } from "../testHelpers";
import { IndexAddresses } from "./IndexAddresses";
import { Notification } from "../Notification";

describe("IndexAddresses", () => {
  const mockAPIGet = jest.spyOn(API, "Get");

  const expectLoadingSpinner = () =>
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  const expectNoLoadingSpinner = () => expect(screen.queryByTestId("loading-spinner")).toBeNull();

  beforeEach(() => {
    mockAPIGet.mockReset();
  });

  afterEach(() => {
    expect(mockAPIGet).toHaveBeenCalledTimes(1);
    expect(mockAPIGet.mock.calls[0][0]).toEqual("/addresses");
    expectNoLoadingSpinner();
  });

  test("rendering successful request", async () => {
    const addresses = [
      {
        value: "1abc",
        testnet: false,
        list_count: 2,
      },
      {
        value: "3def",
        testnet: false,
        list_count: 3,
      },
    ];
    mockAPIGet.mockResolvedValue({ data: { addresses } });
    renderWithStore(
      <MemoryRouter>
        <Notification />
        <IndexAddresses />
      </MemoryRouter>
    );
    expectLoadingSpinner();
    await waitFor(() => expect(screen.getByText("1abc")));
    expect(screen.getByText("2 lists"));
    expect(screen.getByText("3def"));
    expect(screen.getByText("3 lists"));
  });

  test("rendering request with error", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    const error = "foobar";
    mockAPIGet.mockRejectedValue(new ErrorResponse(error, 400));
    renderWithStore(
      <MemoryRouter>
        <Notification />
        <IndexAddresses />
      </MemoryRouter>
    );
    expectLoadingSpinner();
    await waitFor(() => expect(screen.getByText(error)));
  });
});
