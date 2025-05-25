import { config } from "dotenv";

config({path: `.env.${process.env.NODE_ENV || 'development'}.local`})

export const { PORT, NODE_ENV, DB_URI, JWT_SECRET, JWT_ACCESS_EXPIRY, JWT_REFRESH_EXPIRY, FRONTEND_URI } = process.env;