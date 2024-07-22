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

  static log(message: string, level: LogLevel) {
    const timestamp = Logger.getCurrentTimestamp();
    const logLine = `${timestamp} [${level}] - ${message}\n`;

    console.log(logLine);

    fs.appendFile(Logger.logFilePath, logLine, (error) => {
      if (error) {
        console.log(`Error writing to log file: ${error}`);
      }
    });
  }

  static logInfo(message: string) {
    Logger.log(message, LogLevel.INFO);
  }

  static logWarning(message: string) {
    Logger.log(message, LogLevel.WARNING);
  }
    
    static logError(message: string) { 
        Logger.log(message, LOG)
    }
}
