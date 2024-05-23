import { z } from "zod";

export const authCredentialsValidator = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(7, { message: "password must be atleast 8 characters long" }),
});
export type AuthCredentials = z.infer<typeof authCredentialsValidator>;
