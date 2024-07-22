import fs from "fs";

enum LogLevel {
  INFO = "INFO",
  WARNING = "WARNING",
  ERROR = "ERROR",
  MISCELLANEOUS = "MISCELLANEOUS",
}

class Logger {
  private static logFilePath: string;

  static initialize(logFilePath: string) {
    Logger.logFilePath = logFilePath;
  }

  private static getCurrentTimestamp(): string {
    return new Date().toISOString();
  }
    
    private static log(message: string, level: LogLevel) {
      const timestamp = this.getCurrentTimestamp();
      fs.appendFileSync(
        this.logFilePath,
        JSON.stringify({
          timestamp,
          level,
          message
        }) + "\n"
      );
    }
}
