import { NextAuthOptions } from "next-auth";
import DuendeIdentityServer6 from "next-auth/providers/duende-identity-server6";

export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt'     // default value but added for clarity
    },
    providers: [
        DuendeIdentityServer6({
            id: 'id-server',
            clientId: 'next-app', // todo - extract to env
            clientSecret: process.env.IDENTITY_SERVER_CLIENT_SECRET!,
            issuer: process.env.IDENTITY_SERVER_URL,
            authorization: {
                params: {
                    scope: 'openid profile auction-app'
                }
            },
            idToken: true,
        })
    ],
    callbacks: {
        async jwt({ token, profile, account }) {
            if (profile) {
                token.username = profile.username;
            }
            if (account) {
                token.access_token = account.access_token;
            }
            return token;            
        },
        async session({ session, token }) {
            if (token) {
                session.user.username = token.username;
            }
            return session;
        }
    }
};