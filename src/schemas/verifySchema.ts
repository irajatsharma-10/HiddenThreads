import {z} from 'zod'

export const verifySchema = z.object({
    code: z.string().length(6, 'Verification code must be of 6 digits')
})

// {
//     "username":"Devil King",
//     "code": {
//         "code": "445876"
//     }
// } 
// // i have to sent the query like this


// export const verifySchema = z.string().length(6, 'Verification code must be of 6 digits') // this is the best schema
