import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../../utils/prisma';
import { parse } from 'cookie';

/**
 * Type definitions for the TimeSlot object,
 * used to force types to avoid issues.
 * @author Sebastian Ledung
 */
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
  const YEAR = date.getFullYear();
  const MONTH = (date.getMonth() +1).toString().padStart(2, '0'); // months 0 - 11 (needs +1).
  const DAY = date.getDate().toString().padStart(2, '0');
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
  if (timeSlot === '0') {
    return ({
      startDate: '08:00', // 08:00 - 12:00
      endDate: '12:00'
    });
  }

  else if (timeSlot === '1') {
    return ({
      startDate: '12:00', // 12:00 - 16:00
      endDate: '16:00'
    });
  }

  else if (timeSlot === '2') {
    return ({
      startDate: '16:00', // 16:00 - 20:00
      endDate: '20:00'
    });
  }

  else if (timeSlot === '3') {
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
export default async function BookTime(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') { // Only need to handle POST-requests for the login.
    
    const {day, timeSlot} = req.body;

    const DATES = timeSlots(timeSlot);

    const COOKIES = parse(req.headers.cookie || '');
    const USER_ID : number = parseInt(COOKIES['user-id']);

    if (DATES !== undefined && !Number.isNaN(USER_ID)) {
      
      const DATE_NOW_ISO_8601 = formatDateISO8601(new Date(day));
      const QUERY = "select book_time('" 
        + DATES.startDate 
        + "', '" + DATES.endDate 
        + "', " + USER_ID 
        + ", '" + DATE_NOW_ISO_8601 
        + "');"; 

      prisma.$connect;

      type response = { // Type response from DBMS.
        book_time: boolean;
      }
      
      const RESULT: response[] = await prisma.$queryRawUnsafe(QUERY);

      if (RESULT[0].book_time === false) {
        res.status(409).json({success: 'false'});

      } else {
        res.status(200).json({sucess: 'true'});
      }

      prisma.$disconnect;
    }

    else if (Number.isNaN(USER_ID)) { // User not authorized.
      res.status(401).json({success: 'false'});
    }

    else if (DATES === undefined) { // Bad request, bad data supplied.
      res.status(400).json({success: 'false'});
    }

    else { // If something happens that we don't handle.
      res.status(500).json({success: 'false'});
    }

  } else {
    res.status(501); // GET-requests not implemented.
  }
}