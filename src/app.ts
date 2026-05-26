import express, {
  type Application,
  type Request,
  type Response
} from "express";

import { issueRoute } from "./modules/issues/issue.route";
import { authRoute } from "./modules/auth/auth.route";
import { metricsRoute } from "./modules/metric/metric.routes";

const app: Application = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Dev api is running"
  });
});

app.use('/api/auth', authRoute);
app.use('/api/issues', issueRoute);
app.use('/api/metrics', metricsRoute);

export default app;