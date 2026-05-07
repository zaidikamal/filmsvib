/**
 * Central Logger for Filmsvib Production
 * Can be integrated later with Sentry, Axiom, or LogRocket
 */
export function logError(location: string, error: unknown) {
  const timestamp = new Date().toISOString();
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : 'No stack trace';

  // In development, we show the full error
  // In production, we log it to terminal/service logs
  console.error(`
[Filmsvib Error] ── ${timestamp}
Location: ${location}
Message: ${errorMessage}
Stack: ${errorStack}
───────────────────────────
  `);
}

export function logInfo(location: string, message: string) {
  console.log(`[Filmsvib Info] [${location}]: ${message}`);
}
