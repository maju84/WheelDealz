import { getServerSession } from "next-auth";
import { cookies, headers } from "next/headers";
import { NextApiRequest } from "next";
import { getToken } from "next-auth/jwt";
import { authOptions } from "../api/auth/[...nextauth]/nextauthoptions";

export async function getSession() {
    return await getServerSession(authOptions);
}

export async function getCurrentUser() {

    /*  FIXME
        putting this call into try/catch gave me 21x (identical) error prints when running 'npm run build':

Failed to get current user: n [Error]: Dynamic server usage: Page couldn't be rendered statically because it used `headers`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error
    at l (/home/max/repo/dotnet/WheelDealz/frontend/wheeldealz-fe/.next/server/chunks/208.js:30:28881)
    at u (/home/max/repo/dotnet/WheelDealz/frontend/wheeldealz-fe/.next/server/chunks/208.js:30:25969)
    at s (/home/max/repo/dotnet/WheelDealz/frontend/wheeldealz-fe/.next/server/chunks/208.js:30:20315)
    at o (/home/max/repo/dotnet/WheelDealz/frontend/wheeldealz-fe/.next/server/chunks/246.js:1:7398)
    at l (/home/max/repo/dotnet/WheelDealz/frontend/wheeldealz-fe/.next/server/chunks/246.js:1:7439)
    at y (/home/max/repo/dotnet/WheelDealz/frontend/wheeldealz-fe/.next/server/chunks/246.js:1:8977)
    at em (/home/max/repo/dotnet/WheelDealz/frontend/wheeldealz-fe/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:131226)
    at /home/max/repo/dotnet/WheelDealz/frontend/wheeldealz-fe/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:142926
    at Array.toJSON (/home/max/repo/dotnet/WheelDealz/frontend/wheeldealz-fe/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:146504)
    at stringify (<anonymous>) {
  description: "Page couldn't be rendered statically because it used `headers`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error",
  digest: 'DYNAMIC_SERVER_USAGE'
}
        found good answer on StackOverflow: 
        https://stackoverflow.com/questions/78010331/dynamic-server-usage-page-couldnt-be-rendered-statically-because-it-used-next/78010468#78010468

    */

    // try {
        const session = await getSession();
        
        if (!session) {
            console.info("Failed to get session. User is not logged in.");
            return null;
        }

        return session.user;
    

    //     }
//     catch (error) {
//         console.error("Failed to get current user:", error);
//         return null;
//     }
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
