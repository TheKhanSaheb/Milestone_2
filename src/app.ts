import express, {
  type Application,
  type Request,
  type Response
} from "express";

import { issueRoute } from "./modules/issues/issue.route";

const app: Application = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Dev api is running"
  });
});

app.use("/api/issues", issueRoute);

export default app;