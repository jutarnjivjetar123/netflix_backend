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

  private static getCurrentTimes
}
