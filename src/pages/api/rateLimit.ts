import type { NextApiRequest, NextApiResponse } from "next";
import type { NextHandler } from "next-connect";
import LRU from "lru-cache";
import { askAiRateLimits, AskAiRoutes } from "./limiters";
import { limiters } from "./limiters";
import { setTimeout } from "timers/promises";

type Options = {
  uniqueTokenPerInterval?: number;
  interval?: number;
};

export function rateLimit({ interval, uniqueTokenPerInterval }: Options) {
  const tokenCache = new LRU({
    max: uniqueTokenPerInterval || 500,
    ttl: interval || 60000
  });

  return {
    check: (res: NextApiResponse, limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = (tokenCache.get(token) as number[]) || [0];

        if (tokenCount[0] === 0) {
          tokenCache.set(token, tokenCount);
        }

        tokenCount[0] += 1;

        const currentUsage = tokenCount[0];

        const isRateLimited = currentUsage > limit;
        res.setHeader("X-RateLimit-Limit", limit);
        res.setHeader("X-RateLimit-Remaining", isRateLimited ? 0 : limit - currentUsage);
        res.setHeader("X-RateLimit-Seconds-Remaining", (tokenCache.getRemainingTTL(token) / 1000).toFixed(0));

        return isRateLimited ? reject() : resolve();
      })
  };
}

export const withRateLimit = (routeId: AskAiRoutes) => async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
  try {
    await limiters[routeId].check(res, askAiRateLimits[routeId].requestsPerInterval, routeId);
    next();
  } catch (err: any) {
    const secondsRemaining = +(res.getHeader("X-RateLimit-Seconds-Remaining") as string);

    await setTimeout(secondsRemaining * 1000);
    next();

    // return res.status(429).json({ success: false, message: "Rate limit exceeded" });
  }
};

export default (req: NextApiRequest, res: NextApiResponse) => {
  res.redirect("/404");
};
