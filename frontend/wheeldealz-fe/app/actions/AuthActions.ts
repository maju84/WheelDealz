import { getServerSession } from "next-auth";
import { cookies, headers } from "next/headers";
import { NextApiRequest } from "next";
import { getToken } from "next-auth/jwt";
import { authOptions } from "../api/auth/[...nextauth]/nextauthoptions";
import { DynamicServerError } from "next/dist/client/components/hooks-server-context";

export function getSession() {
    return getServerSession(authOptions);
}

export async function getCurrentUser() {
    try {
      const session = await getSession();
      if(!session) return null;
      return session.user;
    } catch(e) {        
    // https://stackoverflow.com/questions/78010331/dynamic-server-usage-page-couldnt-be-rendered-statically-because-it-used-next/78010468#78010468
      if(e instanceof DynamicServerError) throw e;
      console.log(e);
      return null;
    }
  }



/**
 * This method provides a workaround to retrieve the JWT token on the server-side
 * in Next.js when the standard getToken() method, 
 * see https://next-auth.js.org/tutorials/securing-pages-and-api-routes#using-gettoken
 * , cannot access the request object.
 *
 * It constructs a mock NextApiRequest object with headers and cookies extracted
 * using next/headers and next/cookies utilities. The mock request object is then
 * used to call getToken() to obtain the JWT token, if available, from the request's
 * cookies. This is useful in server-side contexts outside of standard API routes,
 * such as in getServerSideProps or getStaticProps during SSR or SSG.
 */
export async function getTokenWorkaround() {
    // Use next/headers and next/cookies to manually construct the headers and cookies
    // of a NextApiRequest object, as you would receive in a standard API route.
    const req = {
        headers: Object.fromEntries(headers() as Headers),
        cookies: Object.fromEntries(
            cookies()
                .getAll()
                .map((cookie) => [cookie.name, cookie.value])
        )
    } as NextApiRequest;

    // Now that we have a mock request object with the necessary headers and cookies,
    // we can call getToken() which expects a request object and will return the JWT token
    // if it's present in the request's cookies.
    return await getToken({ req });
}
