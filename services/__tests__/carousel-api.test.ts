import { apiRequest } from "../api";
import { carouselApi, extractCarouselSlides } from "../carousel.api";
import type { CarouselsResponse } from "../api.types";

jest.mock("../api", () => ({
  apiRequest: jest.fn(),
}));

const mockedApiRequest = apiRequest as jest.Mock;

afterEach(() => {
  mockedApiRequest.mockReset();
});

describe("carouselApi.getCarousels", () => {
  test("requests the Study Resources page with only active slides", async () => {
    mockedApiRequest.mockResolvedValue({ data: [] });

    await carouselApi.getCarousels("study-resources", {
      active: true,
      revalidate: 300,
    });

    expect(mockedApiRequest).toHaveBeenCalledWith(
      "/api/v1/system/carousels?page=study-resources&active=true",
      { next: { revalidate: 300 } },
    );
  });

  test("keeps the existing landing call shape when no options are passed", async () => {
    mockedApiRequest.mockResolvedValue({ data: [] });

    await carouselApi.getCarousels("landing");

    expect(mockedApiRequest).toHaveBeenCalledWith(
      "/api/v1/system/carousels?page=landing",
    );
  });
});

describe("extractCarouselSlides", () => {
  test("normalizes both public response envelope shapes", () => {
    const slide = {
      id: 1,
      title: "Slide",
      image_url: "/uploads/banners/slide.png",
      order: 1,
      active: true,
    };

    const arrayEnvelope: CarouselsResponse = { data: [slide] };
    const objectEnvelope: CarouselsResponse = {
      data: { carousels: [slide] },
    };

    expect(extractCarouselSlides(arrayEnvelope)).toEqual([slide]);
    expect(extractCarouselSlides(objectEnvelope)).toEqual([slide]);
    expect(extractCarouselSlides(null)).toEqual([]);
  });
});
