/*
 * The book itself looks to have a pretty light weight error handler that lives in the scanner.
 * I'm separating it out for modularity.
 */
export class ScannerError {
  hasError = false;

  error(lineNumber: number, message: string) {
    this.report(lineNumber, "", message);
  }

  report(lineNumber: number, where: string, message: string) {
    console.error(`[line ${lineNumber.toString()}] Error ${where}: ${message}`);
    this.hasError = true;
  }
}
