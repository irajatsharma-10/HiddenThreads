// refers to the configuration object used to setup and customize NextAuth.js
import { NextAuthOptions } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import {dbConnect} from "@/lib/dbConnect"
import UserModel from "@/model/User"
// interface CredentialsType{
//     Email: string;
//     password: string;
// }

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialProvider({
            id: "credentials", // identifier for the provider
            name: "Credentials", // Display name for the UI

            // defines input fields required during login(Email and Password here)

            // this block defines the input fields required by the Credentials Provider in NextAuth.js
            credentials: {
                // to access we have to do credentials.identifier.username ( acess via Key name not label name)
                email: { label: "Email", type: "text"},
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect()
                try {
                    const user = await UserModel.findOne({

                        // identifier is the id we assigned above and we get these details from above credential object 
                        // username is not included in the credentials object but the email is 
                        // we get the user from the email
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier},
                        ]
                    })
                    if (!user) {
                        throw new Error('No user found with this email')
                    }
                    if (!user.isVerified) {
                        throw new Error('Please verify your accound before login')
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
                    if (isPasswordCorrect) {
                        return user
                    } else {
                        throw new Error('Incorrect password')
                    }
                } catch (err: any) {
                    throw new Error(err);
                }

            }
        })
    ],


    /// used to customise and extend the default behaviour of authentication in nextAuth.js
    callbacks: {
        // credentialProvider:-> return user
        async jwt({ token, user }) {
            if (user) {
                // this will convert user's object id to string
                token._id = user._id?.toString();
                token.isVerified = user?.isVerified;
                token.username = user?.username;
                token.isAcceptingMessages = user?.isAcceptingMessages;
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id?.toString();
                session.user.isVerified = token?.isVerified;
                session.user.username = token?.username;
                session.user.isAcceptingMessages = token?.isAcceptingMessages;
            }
            return session
        }
    },
    pages: {
        signIn: '/sign-in',
        error: "/sign-in",
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,

}