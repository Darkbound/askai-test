import type { NextApiRequest, NextApiResponse } from "next";
import { rateLimit } from "./rateLimit";

export const askAiRateLimits: AskAiRateLimits = {
  askQuestion: {
    requestsPerInterval: 10,
    intervalInSec: 60
  },
  getAuthToken: {
    requestsPerInterval: 10,
    intervalInSec: 60
  },
  getChunks: {
    requestsPerInterval: 150,
    intervalInSec: 60
  }
};

export type AskAiRoutes = "getAuthToken" | "askQuestion" | "getChunks";

type AskAiRateLimits = Record<AskAiRoutes, { intervalInSec: number; requestsPerInterval: number }>;

const limiters: Record<AskAiRoutes, ReturnType<typeof rateLimit>> | {} = {};

for (let limit in askAiRateLimits) {
  limiters[limit] = rateLimit({
    interval: askAiRateLimits[limit].intervalInSec * 1000,
    uniqueTokenPerInterval: 500
  });
}

export { limiters };

export default (req: NextApiRequest, res: NextApiResponse) => {
  res.redirect("/404");
};
