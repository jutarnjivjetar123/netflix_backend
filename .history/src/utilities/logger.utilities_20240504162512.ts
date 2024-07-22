import fs from "fs";

enum LogLevel {
  INFO = "INFO",
  WARNING = "WARNING",
  ERROR = "ERROR",
  MISCELLANEOUS = "MISCELLANEOUS",
}

class Logger {
  private logFilePath: string;

  constructor(pathForLogginInfo: string) {
    this.logFilePath = logFilePath;
  }
}
