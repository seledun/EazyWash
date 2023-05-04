import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../utils/prisma';
import { addHours } from "date-fns";
import { cookies } from 'next/headers';

// todo

/**
 * Login API, needs a GET-object from the user containing 
 * username and a 4-number PIN.
 * 
 * @param req Request-object from the client.
 * @param res Response-object to for the client to get a response
 * @author Sebastian Ledung, an3944
 */

type TimeSlot = {
  startDate: Date,
  endDate: Date
};

function timeSlots(DATE_SELECTED: Date, timeSlot: string) : TimeSlot | undefined {
  
  if (timeSlot === '1') {
    return ({
      startDate: addHours(DATE_SELECTED, 8), // 08:00 - 12:00
      endDate: addHours(DATE_SELECTED, 12)
    });
  }

  else if (timeSlot === '2') {
    return ({
      startDate: addHours(DATE_SELECTED, 12), // 12:00 - 16:00
      endDate: addHours(DATE_SELECTED, 16)
    });
  }

  else if (timeSlot === '3') {
    return ({
      startDate: addHours(DATE_SELECTED, 16), // 16:00 - 20:00
      endDate: addHours(DATE_SELECTED, 20)
    });
  }

  else if (timeSlot === '4') {
    return ({
      startDate: addHours(DATE_SELECTED, 20), // 20:00 - 24:00
      endDate: addHours(DATE_SELECTED, 24)
    });
  }

  return undefined; // If request is malformed.

}


export default async function booking(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') { // Only need to handle POST-requests for the login.
    res.status(200).json({sucess: 'true'});
    
    const {day, timeSlot} = req.body;
    const DATE_SELECTED = new Date(day);

    const DATES = timeSlots(DATE_SELECTED, timeSlot);
    const COOKIES = cookies().get('user-id')?.value;

    if (DATES !== undefined && COOKIES !== undefined) {
      console.log(DATES);

      console.log("cookie: " + COOKIES);
      console.log("start date: " + DATES.startDate);
      console.log("end date: " + DATES.endDate);

      const RESULT = await prisma.$queryRaw`call add_booking(${DATES.startDate}, ${DATES.endDate}, ${COOKIES}, ${new Date()})`;
      console.log(RESULT);

    }

  } else {
    res.status(501); // GET-requests not implemented.
  }
}