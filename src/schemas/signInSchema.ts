import {z} from 'zod'


// identifier(email/username)
export const signInSchema = z.object({
    identifier: z.string(),
    password: z.string(),
})