import { createEnv } from "@t3-oss/env-nextjs";
import { getRandomValues } from "crypto";
import z from "zod";
import { ZodObject } from "zod/v4";

export const env = createEnv({
    server: {
        DB_PASSWORD: z.string().min(1),
        DB_PORT: z.string().min(1),
        DB_USER: z.string().min(1),
        DB_HOST: z.string().min(1),
        DB_NAME: z.string().min(1),
        ARCJET_KEY: z.string().min(1),
        CLERK_SECRET_KEY: z.string().min(1)
    },
    createFinalSchema: env => {
        return z.object(env).transform(value => {
            const {DB_HOST, DB_USER, DB_PORT, DB_PASSWORD, DB_NAME, ...rest} = value;
            return {
                    ...rest, 
                    DATABASE_URL: `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}` 
            }
        })
    },
    emptyStringAsUndefined: true,
    experimental__runtimeEnv: process.env,
});
