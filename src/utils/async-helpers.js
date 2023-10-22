/**
 * Create a delay of a specific millisecond duration
 * 
 * @param ms - Milliseconds
 * 
 * Example
 * ```jsx
 * const doSomething = async () => {
 *  console.log('Hello');
 *  await delay(5000); // Wait for 5 seconds
 *  console.log('Hello number two');
 * }
 * ```
 */
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
