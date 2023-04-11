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
    if (req.method === 'POST') {

        const {id, pin} = req.body;
        let parsedPin = Number(pin);

        if (!isNaN(parsedPin) && id.length < 12) { // If pin-code is numeric && id length < 12 chars
            res.status(200).json({success: 'true'});
        } 
        
        else {
            res.status(500).json({success: 'false'});
        }

    } else {
        res.status(501); // Only respond to POST-request type.
    }
}