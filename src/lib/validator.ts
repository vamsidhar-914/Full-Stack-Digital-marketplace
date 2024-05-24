import { z } from "zod";

export const authCredentialsValidator = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(7, { message: "password must be atleast 8 characters long" }),
});
export const queryValidtor = z.object({
  category: z.string().optional(),
  sort: z.enum(["asc", "desc"]).optional(),
  limit: z.number().optional(),
});

export type TqueryValidator = z.infer<typeof queryValidtor>;
export type AuthCredentials = z.infer<typeof authCredentialsValidator>;
