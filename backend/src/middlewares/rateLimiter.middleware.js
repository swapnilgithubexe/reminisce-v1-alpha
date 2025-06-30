import rateLimit from "express-rate-limit";

//! Global API rate limiter
export const globalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, //! 15 mins
  max: 100,
  message: "Too many requests, please try again after some time",
  standardHeaders: true, //! ratelimit meta data
  legacyHeaders: false
});

//!Login
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many login attempts, Try again later",
  standardHeaders: true,
  legacyHeaders: false
});

//!Register
export const registerLimiter = rateLimit({
  windowMs: 20 * 60 * 1000, //! 20 mins
  max: 3, //! limiting to 3 new ccounts from an IP
  message: "Too many accounts has been created from this IP, please try again later",
  standardHeaders: true,
  legacyHeaders: false
})