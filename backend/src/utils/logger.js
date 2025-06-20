import winston from "winston";

const { combine, json, timestamp } = winston.format;
//! Custom level checker function
const levelFilter = (level) => {
  return winston.format((info) => info.level === level ? info : false)();
};

const logger = winston.createLogger({
  level: "info",
  format: combine(
    timestamp(),
    json()
  ),

  //! Transfer the logs
  transports: [
    //! For console logging
    new winston.transports.Console(),

    //! Only for errors
    new winston.transports.File({
      filename: "logs/error.log", level: "error",
      format: combine(
        levelFilter("error"),
        timestamp(),
        json()
      )
    }),

    //! Only for info/warnings
    new winston.transports.File({
      filename: "logs/info.log",
      level: "info",
      format: combine(
        levelFilter("info"),
        timestamp(),
        json()
      )
    }),
  ],
});

export default logger;
