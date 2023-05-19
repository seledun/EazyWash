import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../../utils/prisma';
import { parse } from 'cookie';

/**
 * Checks if user is signed in, returns the associated username for the session-token
 * if valid. If not valid or user is not signed in return 4xx-status codes.
 * @param req Request object containing the cookie-data for this endpoint.
 * @param res Response object where we set the response data for the client.
 * @author Sebastian Ledung
 */
export default async function checkAuthentication (
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') { // Only need to handle POST-requests for the login.
    const COOKIES = parse(req.headers.cookie || '');
    const SESSION = COOKIES['session-id'];

    if (SESSION !== undefined) {
      type sessionData = {
        username?: string
      };

      prisma.$connect;

      const QUERY = `select per.username from Authentication auth
      join person per on auth.person = per.per_id
      where auth.token = '${SESSION}'
      and auth.expires > now() at time zone 'UTC';`

      const SESSION_DATA : sessionData[] = await prisma.$queryRawUnsafe(QUERY);

      if (SESSION_DATA[0].username !== undefined) {
        res.status(200).json({username: SESSION_DATA[0].username}) // valid session.
      } else {
        res.status(409).json({status: 'false'}); // expired session.
      }

    } else {
      res.status(403).json({status: 'false'}); // not logged in.
    }

  } else {
    res.status(501); // POST-requests not implemented.
  }
}