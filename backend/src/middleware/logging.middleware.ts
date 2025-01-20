import path = require("node:path");
import * as fs from "node:fs";

export const loggingService = {
    log() {
        return function (req, res, next) {
            const user = res.locals.oauth?.token?.user;
            if (!user) {
                return next();
            }

            const userEmail = user.email;
            const logFilePath = path.join(__dirname, 'logs', `${userEmail}.log`);
            const startTime = Date.now();

            try {
                fs.mkdirSync(path.dirname(logFilePath), {recursive: true});
            } catch (err) {
                return next(err);
            }

            const requestData = {
                method: req.method,
                url: req.originalUrl,
                headers: req.headers,
                body: req.body,
                timestamp: new Date().toISOString(),
            };

            try {
                fs.appendFileSync(logFilePath, `\n[REQUEST]\n${JSON.stringify(requestData, null, 2)}\n`);
            } catch (err) {
                return next(err);
            }

            const originalSend = res.send;
            let isResponseSent = false;

            res.send = function (body) {
                if (isResponseSent) {
                    return;
                }
                isResponseSent = true;
                const responseTime = Date.now() - startTime;

                const responseData = {
                    status: res.statusCode,
                    headers: res.getHeaders(),
                    body,
                    responseTime: `${responseTime}ms`,
                    timestamp: new Date().toISOString(),
                };

                try {
                    fs.appendFileSync(logFilePath, `\n[RESPONSE]\n${JSON.stringify(responseData, null, 2)}\n`);
                } catch (err) {
                    return next(err);
                }
                return originalSend.call(this, body); // Send the response just once
            };
            next();
        };
    },
};
