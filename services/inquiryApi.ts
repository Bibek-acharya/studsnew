export interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  created_at: string;
}

export async function fetchInquiries(): Promise<{ inquiries: Inquiry[] }> {
  try {
    const res = await fetch("/api/v1/contact", {
      method: "GET",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch inquiries");
    }

    const result = await res.json();
    if (result?.data) {
      return result.data;
    }

    return { inquiries: [] };
  } catch {
    return { inquiries: [] };
  }
}

export async function submitInquiry(data: {
  name: string;
  email: string;
  phone: string;
  message: string;
}): Promise<Inquiry> {
  try {
    const res = await fetch("/api/v1/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Failed to submit inquiry");
    }

    const result = await res.json();
    if (result?.data) {
      return result.data;
    }

    throw new Error("Failed to submit inquiry");
  } catch (error) {
    throw new Error("Failed to submit inquiry");
  }
}