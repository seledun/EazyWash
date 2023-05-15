import type { NextApiRequest, NextApiResponse } from "next";
import { parse } from 'cookie';

export default async function LogOut(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') { // Only need to handle POST-requests for the login.
    const COOKIES = parse(req.headers.cookie || '');
    const SESSION = COOKIES['session-id'];
  
    if (SESSION !== undefined) {  
      // Sets the client cookie with a session-id and the expiry time for the cookie.
      res.setHeader('set-cookie', [
        'user-id=""'
                    + '; SameSite=strict' 
                    + '; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
        'org-id=""'
                    + '; SameSite=strict' 
                    + '; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
        'session-id=""'
                    + '; SameSite=strict' 
                    + '; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
      ]);
      res.status(200).json({success: 'true'});
  
    } else {
      res.status(403).json({status: 'false'}); // not logged in.
    }
  
  } else {
    res.status(501); // POST-requests not implemented.
  }
}