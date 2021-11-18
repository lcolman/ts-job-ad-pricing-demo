import winston from "winston";

const options: winston.LoggerOptions = {
    transports: [
        new winston.transports.Console({
            level: process.env.NODE_ENV === "production" ? "error" : "debug"
        }),
    ]
};

export default { logger: winston.createLogger(options) };