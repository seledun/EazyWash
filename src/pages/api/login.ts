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

/**
 * pin can only be between 1-30 characters long
 * @author Sebastian Ledung
 */
function validatePinCode(pin: string) {
    return (pin.length > 0 && pin.length <= 30);
}

/**
 * id can only be length > 0 and length < 50
 * id can only be letters and numbers a-z, A-Z and 0-9
 * @param id id to validate
 * @author Sebastian Ledung 
 */
function validateUserName(id: string) {
    let lengthValid = (id.length > 0 && id.length <= 50);
    let charsValid = id.match(/^[A-Za-z0-9]*$/);
    return (lengthValid && charsValid);
}

export default async function login(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {

        const {id, pin} = req.body;
        let parsedPin = Number(pin);

        if (validateUserName(id) && validatePinCode(pin)) {
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