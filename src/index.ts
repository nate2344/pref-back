import cors from "cors";
import router from "./routes/Router";
import express from "express";
import bodyParser from "body-parser";

import { config } from "dotenv";
import { connectToDatabase } from "./config/database";

const main = async () => {
  config();

  const app = express();

  const port = Number(process.env.PORT);

  const routes = router;

  connectToDatabase();

  app.use(bodyParser.json({ limit: "10mb" }));
  app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
  app.use(express.json());
  app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    })
  );
  app.use("/api", routes);
  app.listen(port, "10.148.9.5", () => {
    console.log(`Servidor online!`);
  });
};

main();
