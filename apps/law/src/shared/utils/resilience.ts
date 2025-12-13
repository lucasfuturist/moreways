/**
 * Executes a function with exponential backoff retries.
 * Stops if the total time exceeds maxDurationMs.
 */
export async function withRetry<T>(
    operation: () => Promise<T>,
    options: { 
        maxRetries?: number; 
        maxDurationMs?: number; 
        initialDelayMs?: number;
        backoffFactor?: number;
    } = {}
): Promise<T> {
    const {
        maxRetries = 5,
        maxDurationMs = 30000, // 30 seconds max
        initialDelayMs = 1000,
        backoffFactor = 2
    } = options;

    const startTime = Date.now();
    let lastError: any;
    let attempt = 0;
    let delay = initialDelayMs;

    while (attempt <= maxRetries) {
        try {
            // Check global timeout
            if (Date.now() - startTime > maxDurationMs) {
                throw new Error(`Timeout: Operation exceeded ${maxDurationMs}ms`);
            }

            return await operation();

        } catch (error: any) {
            lastError = error;
            attempt++;

            // If we hit the limit, stop
            if (attempt > maxRetries || (Date.now() - startTime + delay > maxDurationMs)) {
                break;
            }

            // Only log if it's a retryable error (optional: filter by error type)
            console.warn(`[Resilience] Attempt ${attempt} failed. Retrying in ${delay}ms... (Error: ${error.message})`);
            
            // Wait
            await new Promise(resolve => setTimeout(resolve, delay));
            
            // Increase delay (Exponential Backoff)
            delay *= backoffFactor;
        }
    }

    throw lastError;
}