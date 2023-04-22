import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../utils/prisma';

/**
 * @param req Request-object from the client.
 * @param res Response-object to for the client to get a response
 * @author Sebastian Ledung
 * @author Teo Gefors
 * @author Petter Carlsson
 */

/**
 * Validation of the supplied password / pin code\
 * check: pin can only be between 1-30 characters long
 * @author Sebastian Ledung
 */
function validatePinCode(pin: string) : boolean {
  if (pin !== undefined) {
    return (pin.length > 0 && pin.length <= 30);
  }
  
  return false;
}

/**
 * check: id.length > 0 and id.length < 50.\
 * check: id needs to be a letter (case-insensitive) or a number.
 * @param id id to validate
 * @return true if id passes the checks above.
 * @author Sebastian Ledung 
 */
function validateUsername(id: string) : boolean {
  if (id !== undefined) {
    const LENGHTVALID = (id.length > 0 && id.length <= 50);
    const CHARSVALID = id.match(/^[A-Za-z0-9]*$/);
    return (LENGHTVALID && (CHARSVALID !== null));
  }

  return false;
}

/**
 * Defines the response-type for the login request.
 * @author Sebastian Ledung
 */
type LoginRequest = {
  status: boolean;
};

/**
 * Function that handles the endpoint /api/login.ts\
 * validates form-data and tries to authenticate the user.
 * @param req Request-object handling information sent by the user.
 * @param res Response-object handling our response to the requesting user.
 * @author Sebastian Ledung
 * @author Teo Gefors
 * @author Petter Carlsson
 */
export default async function login(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Only for testing, remove later

  if (req.method === 'POST') {

    const {id, pin} = req.body;
     
    if (validateUsername(id) && validatePinCode(pin)) {
      const RESULT:LoginRequest[] = await prisma.$queryRaw`select log_in(${id}, ${pin}) as status`;

      if (RESULT[0].status === true) {
        console.log("Nice! du är inne");
        res.status(200).json({success: 'true'}); // Authentication success.

      } else {
        res.status(401).json({success: 'false'}); // Wrong username or password.
      }

      prisma.$disconnect;
    } 
        
    else {
      res.status(500).json({success: 'false'}); // If any validation fails.
    }

  } else {
    res.status(501); // Only respond to POST-request type.
  }
}