/**
 * Safe Fetch with Timeout and Abort Signal
 * Prevents hanging requests from crashing server components
 */
export async function safeFetch(url: string, options?: RequestInit, timeoutMs = 8000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Fetch failed with status: ${response.status}`);
    }

    return response;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timed out after ${timeoutMs}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
