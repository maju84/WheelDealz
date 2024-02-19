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
    ]
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };