import express from "express";
import cors from "cors";

const server = express();
server.use(cors());
server.use(express.json());
const PORT = 4000;

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
