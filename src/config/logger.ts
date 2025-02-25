import pino from "pino";
import { GlobalConfig } from "./environment";

const LOGGER = pino({
  level: GlobalConfig.ENVIRONMENT === "DEVELOPMENT" ? "info" : "error",
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export default LOGGER;
