import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Login API, needs a POST-object from the user containing 
 * username and a 4-number PIN.
 * 
 * @param req Request-object from the client.
 * @param res Response-object to for the client to get a response
 * @author Sebastian Ledung, an3944
 */

export default function login(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') { // Only need to handle POST-requests for the login.
        res.status(200).json({sucess: 'true'});
        

    } else {

        res.status(501); // GET-requests not implemented.
    }
}