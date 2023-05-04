import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../utils/prisma';
import { parse } from 'cookie';

type TimeSlot = {
  startDate: string,
  endDate: string
};

/**
 * Formats the date to a PostgresQL allowed format 
 * @param date the date to format
 * @returns ISO-8601 formatted string (1995-11-01).
 * @author Sebastian Ledung
 */
function formatDateISO8601(date: Date) : string {
  const YEAR = date.getFullYear().toString();
  const MONTH = date.getMonth().toString().padStart(2, '0');
  const DAY = date.getDay().toString().padStart(2, '0');
  return YEAR + '-' + MONTH + '-' + DAY;
}

/**
 * Forces timeslots to set timespans, doesn't let the client
 * decide what times to book instead forces the user to book
 * a span.
 * @param DATE_SELECTED The supplied date to book a time.
 * @param timeSlot Client selected time-slot.
 * @returns Formatted strings for timeSlots
 * @author Sebastian Ledung
 */
function timeSlots(timeSlot: string) : TimeSlot | undefined {
  if (timeSlot === '1') {
    return ({
      startDate: '08:00', // 08:00 - 12:00
      endDate: '12:00'
    });
  }

  else if (timeSlot === '2') {
    return ({
      startDate: '12:00', // 12:00 - 16:00
      endDate: '16:00'
    });
  }

  else if (timeSlot === '3') {
    return ({
      startDate: '16:00', // 16:00 - 20:00
      endDate: '20:00'
    });
  }

  else if (timeSlot === '4') {
    return ({
      startDate: '20:00', // 20:00 - 24:00
      endDate: '24:00'
    });
  }

  return undefined; // If request is malformed.

}

/**
 * Booking API, needs a POST-object from the user containing 
 * day and timeslot to book.
 * @param req Request-object from the client.
 * @param res Response-object to for the client to get a response
 * @author Sebastian Ledung
 */
export default async function booking(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') { // Only need to handle POST-requests for the login.
    res.status(200).json({sucess: 'true'});
    
    const {day, timeSlot} = req.body;

    const DATES = timeSlots(timeSlot);

    const COOKIES = parse(req.headers.cookie || '');
    const USER_ID : number = parseInt(COOKIES['user-id']);

    if (DATES !== undefined && !Number.isNaN(COOKIES)) {
      const DATE_NOW_ISO_8601 = formatDateISO8601(new Date(day));
      const QUERY = "call add_booking('" 
        + DATES.startDate 
        + "', '" + DATES.endDate 
        + "', " + USER_ID 
        + ", '" + DATE_NOW_ISO_8601 
        + "');"; 

      prisma.$connect;

      console.log(QUERY);
      const RESULT = await prisma.$queryRawUnsafe(QUERY);
      console.log(RESULT);
    
      prisma.$disconnect;
    }

  } else {
    res.status(501); // GET-requests not implemented.
  }
}