import 'next-auth'


// User, Session, Account, or Profile are the interface of the next-auth library

declare module 'next-auth' {
    interface User {
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string;
    }

    // DefaultSession represents the default structure for a session object in next-auth.

    
    // DefaultSession['user']: This refers to the user object in the default Session type from next-auth. By using DefaultSession['user'], you're saying that you want to keep the properties from the default user object (e.g., name, email, image), and then add your custom properties to that type.
    interface Session {
        user: {
            _id?: string;
            isVerified?: boolean;
            isAcceptingMessages?: boolean;
            username?: string;
        } & DefaultSession['user']
    }
}


declare module 'next-auth/jwt'{
    interface JWT{
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string;
    }
}
