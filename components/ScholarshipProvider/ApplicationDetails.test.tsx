import { render, screen } from "@testing-library/react";
import ApplicationDetails from "./ApplicationDetails";

jest.mock("@/services/scholarshipProviderApi", () => ({
  scholarshipProviderApi: {
    getApplicationById: jest.fn(),
    updateApplicationStatus: jest.fn(),
  },
}));

describe("ApplicationDetails", () => {
  it("displays documents section with document links", async () => {
    const { scholarshipProviderApi } = require("@/services/scholarshipProviderApi");
    (scholarshipProviderApi.getApplicationById as jest.Mock).mockResolvedValue({
      id: 1,
      first_name: "John",
      last_name: "Doe",
      email: "john@example.com",
      status: "pending",
      documents: [
        { name: "Transcript", url: "https://example.com/transcript.pdf" },
        { name: "ID Card", url: "https://example.com/id.pdf" },
      ],
      personal_statement: "My personal statement",
      created_at: new Date().toISOString(),
    });

    render(<ApplicationDetails applicationId="1" onBack={jest.fn()} />);

    expect(screen.getByText("Transcript")).toBeInTheDocument();
    expect(screen.getByText("ID Card")).toBeInTheDocument();
  });

  it("displays personal statement", async () => {
    const { scholarshipProviderApi } = require("@/services/scholarshipProviderApi");
    (scholarshipProviderApi.getApplicationById as jest.Mock).mockResolvedValue({
      id: 1,
      first_name: "Jane",
      last_name: "Smith",
      email: "jane@example.com",
      status: "pending",
      documents: [],
      personal_statement: "My statement",
      created_at: new Date().toISOString(),
    });

    render(<ApplicationDetails applicationId="1" onBack={jest.fn()} />);

    expect(screen.getByText("My statement")).toBeInTheDocument();
  });
});