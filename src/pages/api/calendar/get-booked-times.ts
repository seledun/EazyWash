import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../../utils/prisma';
import { parse } from 'cookie';

/**
 * API-endpoint to get a list of booked times for the logged in client.
 * @param req Request-object containing login information about the client.
 * @param res Response-object for the result-set.
 * @author Sebastian Ledung
 */
export default async function GetBookedTimes (
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
  
    const COOKIES = parse(req.headers.cookie || '');
    const SESSION : string | undefined = COOKIES['session-id'];
  
    if (SESSION != undefined) {
  
        type sessionData = {
          per_id: number
        };
  
        prisma.$connect;
  
        const QUERY = `select per.per_id from Authentication auth
        join person per on auth.person = per.per_id
        where auth.token = '${SESSION}';`;

        const SESSION_DATA : sessionData[] = await prisma.$queryRawUnsafe(QUERY);
        
        const BOOKINGS_QUERY = `select bok_id, start_time, end_time, booking_date from BookingSchema 
                                where per_id=${SESSION_DATA[0].per_id} 
                                and booking_date >= CURRENT_DATE;`;

        const RESULT = await prisma.$queryRawUnsafe(BOOKINGS_QUERY);
  
        res.status(200).json({ success: true, data: RESULT });
  
        prisma.$disconnect;
  
    } else {
      res.status(501).json({success: false}); // malformed request.
    }
  }
}