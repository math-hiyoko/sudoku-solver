export default async function fetchWithHandling<T>(
  url: string,
  options: RequestInit,
): Promise<T> {
  const response: Response = await fetch(url, options);
  if (!response.ok) {
    const errorData = await response.json();
    const allowedErrorTypes: string[] = ["OutOfRangeError", "ConstraintViolation"];
    throw new Error(
      (allowedErrorTypes.includes(errorData.error?.type)
        ? errorData.error?.message
        : "Unexpected error") || "Unexpected error",
    );
  }
  return response.json();
}
