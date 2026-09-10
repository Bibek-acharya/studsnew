/**
 * @jest-environment jsdom
 */
import { seriesToCSV, downloadCSV } from "../components/superadmin/client/analytics/csv";
import type { SeriesPoint } from "../services/superadminAnalyticsApi";

describe("analytics CSV", () => {
  test("seriesToCSV pivots buckets into a header + rows", () => {
    const series: SeriesPoint[] = [
      { bucket: "2026-09-08", values: { students: 3, providers: 1 } },
      { bucket: "2026-09-09", values: { students: 5 } },
    ];
    expect(seriesToCSV(series)).toBe(
      "bucket,providers,students\n2026-09-08,1,3\n2026-09-09,,5",
    );
  });

  test("downloadCSV triggers a blob download with the given filename", () => {
    const createObjectURL = jest.fn(() => "blob:fake");
    const revokeObjectURL = jest.fn();
    Object.defineProperty(URL, "createObjectURL", { configurable: true, value: createObjectURL });
    Object.defineProperty(URL, "revokeObjectURL", { configurable: true, value: revokeObjectURL });
    const click = jest.fn();
    const appendChild = jest.spyOn(document.body, "appendChild").mockImplementation((node) => node);
    const removeChild = jest.spyOn(document.body, "removeChild").mockImplementation((node) => node);
    jest.spyOn(document, "createElement").mockImplementation(((tag: string) => {
      if (tag === "a") return { click, set download(_v: string) {}, set href(_v: string) {} } as unknown as HTMLElement;
      return document.createElement(tag);
    }) as typeof document.createElement);
    try {
      downloadCSV("users-7d.csv", "bucket,students\n2026-09-09,5");
      expect(createObjectURL).toHaveBeenCalledTimes(1);
      expect(click).toHaveBeenCalledTimes(1);
      expect(revokeObjectURL).toHaveBeenCalledWith("blob:fake");
    } finally {
      jest.restoreAllMocks();
    }
  });
});
