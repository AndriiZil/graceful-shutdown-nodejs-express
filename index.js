const express = require('express');
const app = express();
const port = 3000;

const gracefulShutdownTime = 15000;
let ONLINE = true;

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/health-check', (req, res) => {
    ONLINE ? res.send('OK') : res.status(503).send('Server shutting down');
});
app.get('/long-response', (req, res) =>
    setTimeout(() => res.send('Finally! OK'), gracefulShutdownTime),
);
const server = app.listen(port, function () {
    console.log(`🚀 Example app listening at http://localhost:${port}`);
});

const gracefulShutdownHandler = function gracefulShutdownHandler(signal) {
    console.log(`⚠️ Caught ${signal}, gracefully shutting down`);
    ONLINE = false;

    setTimeout(() => {
        console.log('🤞 Shutting down application');
        // stop the server from accepting new connections
        server.close(function () {
            console.log('👋 All requests stopped, shutting down');
            // once the server is not accepting connections, exit
            process.exit();
        });
    }, 0);
};

// The SIGINT signal is sent to a process by its controlling terminal when a user wishes to interrupt the process.
process.on('SIGINT', gracefulShutdownHandler);

// The SIGTERM signal is sent to a process to request its termination.
process.on('SIGTERM', gracefulShutdownHandler);
