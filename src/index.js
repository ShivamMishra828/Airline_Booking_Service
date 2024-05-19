const express = require("express");
const morgan = require("morgan");
const { ServerConfig, LoggerConfig, Queue } = require("./config");
const apiRoutes = require("./routes");
const CRON = require("./utils/common/cron-jobs");

const PORT = ServerConfig.PORT;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    morgan("myFormat", {
        stream: LoggerConfig.accessLogStream,
    })
);
app.use("/api", apiRoutes);

app.listen(PORT, async () => {
    console.log(`Server is Up and Running on PORT:- ${PORT}`);
    CRON();
    await Queue.connectToQueue();
    console.log("Queue Connected");
});
