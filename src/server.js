import express from "express";
import cors from "cors";

import router from "./routes/routes.js";

const server = express();
server.use(cors());
server.use(express.json());
const PORT = 4000;

server.use(router);

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
