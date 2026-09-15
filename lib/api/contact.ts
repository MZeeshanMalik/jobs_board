// lib/api/contact.ts
const API_URL =
  typeof window === "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000")
    : "";

export interface ContactInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message?: string;
  errors?: Record<string, string>;
}

export async function submitContactForm(
  input: ContactInput,
): Promise<ContactResponse> {
  const res = await fetch(`${API_URL}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const json = (await res.json().catch(() => ({}))) as ContactResponse;

  if (!res.ok) {
    return {
      success: false,
      message: json.message ?? "Something went wrong. Please try again.",
      errors: json.errors,
    };
  }

  return json;
}
