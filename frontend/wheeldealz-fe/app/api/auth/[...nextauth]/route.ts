import NextAuth, { NextAuthOptions } from "next-auth";
import DuendeIdentityServer6 from "next-auth/providers/duende-identity-server6";

export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt'     // default value but added for clarity
    },
    providers: [
        DuendeIdentityServer6({
            id: 'id-server',
            clientId: 'next-app', // todo - extract to env
            clientSecret: 'secret', // fixme
            issuer: 'http://localhost:5000',
            authorization: {
                params: {
                    scope: 'openid profile auction-app'
                }
            },
            idToken: true,
        })
    ],
    callbacks: {
        async jwt({ token, profile }) {
            if (profile) {
                token.username = profile.username;
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

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };