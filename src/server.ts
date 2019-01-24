require("dotenv").config();

import * as express from "express";
import * as http from "http";

import * as compression from "compression"
import * as cors from "cors";
import * as favicon from "serve-favicon";

import * as analyzer from "./analyzer";
import * as socketManager from "./socketManager";

/* Start express webserver and initialize websocket */
const { PORT = 3000 } = process.env;

const app: express.Application = express();
const server = http.createServer(app);
const router = express.Router();

app.use(cors());
app.use(compression());

app.set("view engine", "pug");
app.use(express.static("./public"));

router.get("/", serveHomePage);
app.use("/", router);

server.listen(PORT, () => console.log(`> server listening on port ${PORT}`));

socketManager.initialize(server);

function serveHomePage(req: express.Request, res: express.Response) {
    analyzer.getStats(stats => {
        res.render("index", stats);
    });
}