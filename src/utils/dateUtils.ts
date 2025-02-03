// This function takes a date string as input and returns a formatted date string
export function formatDate(dateString: string): string {
  // Create a new Date object from the input string
  const date = new Date(dateString);
  
  // Use toLocaleDateString to format the date
  // 'en-US' specifies the locale (American English)
  // The options object customizes the output format
  return date.toLocaleDateString('en-US', {
    year: 'numeric',    // Full year (e.g., 2025)
    month: 'long',      // Full month name (e.g., February)
    day: 'numeric',     // Day of the month (e.g., 3)
    hour: '2-digit',    // Hour in 2-digit format (e.g., 04)
    minute: '2-digit'   // Minute in 2-digit format (e.g., 00)
  });
}
