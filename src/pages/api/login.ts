import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from '@prisma/client'

/**
 * Login API, needs a POST-object from the user containing 
 * username and a 4-number PIN.
 * 
 * @param req Request-object from the client.
 * @param res Response-object to for the client to get a response
 * @author Sebastian Ledung
 * @author Teo Gefors
 * @author Petter Carlsson
 */

export default async function login(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {

        const {id, pin} = req.body;
        let parsedPin = Number(pin);

        if (!isNaN(parsedPin) && id.length < 12) { // If pin-code is numeric && id length < 12 chars
            const prisma = new PrismaClient()
            res.status(200).json({success: 'true'});

            // const result = await prisma.$queryRaw`call add_person('test1231', '123', 2);`;

            const result = await prisma.person.findFirst(id);
            let password = result?.password;

            if (password === pin) {
                console.log("Nice! du är inne");
            }

            prisma.$disconnect;
        } 
        
        else {
            res.status(500).json({success: 'false'});
        }

    } else {
        res.status(501); // Only respond to POST-request type.
    }
}