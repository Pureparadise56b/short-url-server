import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import { connectDb } from "./db";
import { app } from "./app";
import http from "http";

const port = process.env.PORT || 3000;

const server = http.createServer(app);

connectDb()
  .then(() => {
    server.listen(port, () =>
      console.log(`\nServer started at port ${port}...🍀`)
    );
  })
  .catch((error) => console.error(error));
