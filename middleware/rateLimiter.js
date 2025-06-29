import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === "development") {
      return next();
    }

    const { success } = await ratelimit.limit("my_rate_limit");

    if (!success) {
      return res.status(429).json({
        error: "Rate limit exceeded. Please try again later.",
      });
    }

    next();
  } catch (error) {
    console.error("Error in rate limiter:", error);
    next();
  }
};

export default rateLimiter;