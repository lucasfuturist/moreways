/**
 * Executes a function with exponential backoff.
 * Usage: await withRetry(() => apiCall(), 3, 1000, "Context");
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  retries = 3,
  delayMs = 1000,
  context = 'Operation'
): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    if (retries <= 0) {
      console.error(`❌ [${context}] Final Failure:`, error.message);
      throw error;
    }

    // Identify retryable errors (Rate Limits, Server Errors, Timeouts)
    const status = error.status || error.statusCode || 500;
    const isRetryable = status === 429 || status >= 500 || error.code === 'ECONNRESET';

    if (!isRetryable) {
      throw error;
    }

    console.warn(`⚠️ [${context}] Failed (${status}). Retrying in ${delayMs}ms... (${retries} retries left)`);
    
    // Wait
    await new Promise(r => setTimeout(r, delayMs));

    // Recursive Retry with exponential backoff (1s -> 2s -> 4s)
    return withRetry(operation, retries - 1, delayMs * 2, context);
  }
}