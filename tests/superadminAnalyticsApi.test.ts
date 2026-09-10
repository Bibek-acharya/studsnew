/**
 * @jest-environment jsdom
 */
import { apiRequest } from "../services/api";
import { superadminAnalyticsApi } from "../services/superadminAnalyticsApi";

jest.mock("../services/api", () => ({
  apiRequest: jest.fn(),
}));

const mockedApiRequest = apiRequest as jest.Mock;

beforeEach(() => {
  mockedApiRequest.mockReset();
  mockedApiRequest.mockResolvedValue({ data: {} });
});

describe("superadminAnalyticsApi", () => {
  test("users endpoint hits the analytics path with range params", async () => {
    await superadminAnalyticsApi.getUsers("2026-08-11", "2026-09-10");
    expect(mockedApiRequest).toHaveBeenCalledWith(
      "/api/v1/superadmin/analytics/users?from=2026-08-11&to=2026-09-10&granularity=day",
      expect.objectContaining({ suppressAuthExpired: true }),
    );
  });

  test("health endpoint hits the health path with the superadmin token", async () => {
    localStorage.setItem("superadmin_token", "tok-123");
    try {
      await superadminAnalyticsApi.getHealth();
      expect(mockedApiRequest).toHaveBeenCalledWith(
        "/api/v1/superadmin/analytics/health",
        expect.objectContaining({
          authToken: "tok-123",
          suppressAuthExpired: true,
        }),
      );
    } finally {
      localStorage.removeItem("superadmin_token");
    }
  });
});
