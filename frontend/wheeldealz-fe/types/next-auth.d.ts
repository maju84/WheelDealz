import { DefaultSession } from "next-auth";


// see https://next-auth.js.org/getting-started/typescript#main-module
// Extend the built-in session and profile types from next-auth
// to include the additional username property. This makes TypeScript
// aware of the new property and allows for type-safe usage throughout the application.
declare module 'next-auth' {
    interface Session {
        // Add a username property to the user object of the Session interface
        user: {
            username: string;
        } & DefaultSession['user']; // Include all existing properties from the default user object
    }

    // Extend the Profile interface from next-auth
    interface Profile {
        username: string; // Add a username property to the profile object
    }
}

// Extend the built-in types for JWT from next-auth to include custom user properties
declare module 'next-auth/jwt' {
    // Extend the existing JWT interface with a username property
    interface JWT {
        user: {
            username: string; // Add a username property to the user object in the JWT
        };
    }
}

// ----

// Import the default session type from next-auth to extend it
import { DefaultSession } from "next-auth";


declare module 'next-auth' {
    // Extend the existing Session interface with a username property
    interface Session {
        // Add a username property to the user object of the Session interface
        user: {
            username: string;
        } & DefaultSession['user']; // Include all existing properties from the default user object
    }

    // Extend the Profile interface from next-auth
    interface Profile {
        username: string; // Add a username property to the profile object
    }
}

// Extend the built-in types for JWT from next-auth to include custom user properties
declare module 'next-auth/jwt' {
    // Extend the existing JWT interface with a username property
    interface JWT {        
        username: string; // Add a username property to the user object in the JWT
        access_token?: string;
    }
}
