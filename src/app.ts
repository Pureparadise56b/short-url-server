import express, { Request, Response, NextFunction } from "express";
import userRouter from "./routes/user.route";
import urlRouter from "./routes/url.route";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);

// Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/url", urlRouter);

// message for user

app.route("/").get((req: Request, res: Response) => {
  res.status(200).json({
    statusCode: 200,
    message:
      "Welcome to url shortner, if you see this message means you are successfully connected to the backend.",
    developer: "Toufique",
    dev_id: 2645,
    createdAt: "21-03-2024",
  });
});

// Error handle
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(`${err.name} :: ${err.message}`);
  res.status(err.statusCode).send(`${err.name} :: ${err.message}`);
});

export { app };
