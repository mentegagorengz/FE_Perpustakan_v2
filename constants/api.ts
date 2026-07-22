export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

export async function handleApiResponse<T = any>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");

  if (!isJson) {
    const text = await response.text();
    throw new Error(
      `Respon dari server bukan JSON (${response.status}). ${
        text.startsWith("<!DOCTYPE") ? "Endpoint tidak ditemukan / Server error." : text
      }`
    );
  }

  const result = await response.json();

  if (!response.ok) {
    const errorMessage = Array.isArray(result.message)
      ? result.message.join(", ")
      : result.message || "Terjadi kesalahan pada server.";
    throw new Error(errorMessage);
  }

  return result;
}
