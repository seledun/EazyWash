import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../../utils/prisma';
import { parse } from 'cookie';

export default async function DeleteBooking(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') { // Only need to handle POST-requests for the login.
    const { bookingId } = req.body;
    const BOOKING_ID = parseInt(bookingId);

    const COOKIES = parse(req.headers.cookie || '');
    const SESSION_ID = COOKIES['session-id'];
  
    if (SESSION_ID !== undefined && !isNaN(BOOKING_ID)) {
        
      type sessionData = {
        per_id?: number;
      };

      const QUERY = `select per.per_id from Authentication auth
      join person per on auth.person = per.per_id
      where auth.token = '${SESSION_ID}'
      and auth.expires > now() at time zone 'UTC';`

      prisma.$connect;

      const SESSION_DATA : sessionData[] = await prisma.$queryRawUnsafe(QUERY);
      const PER_ID = SESSION_DATA[0].per_id;

      if (PER_ID !== undefined) {
        const ROWS_AFFECTED : number = await prisma.$executeRaw`DELETE FROM BookingSchema
                                                                WHERE bok_id = ${BOOKING_ID}
                                                                AND per_id = ${PER_ID};`;
        if (ROWS_AFFECTED > 0) {
          res.status(200).json({status: 'success'}); // Delete successful.
        } else {
          res.status(304).json({status: 'failed'}); // Could not delete booking.
        }
      } else {
        res.status(500).json({status: 'failed'}); // Should not get here (session not tied to person).
      }
    } else {
      res.status(406).json({status: 'failed'}); // Malformed request.  
    }
  }
  else {
    res.status(500).json({status: 'failed'}); // Not implemented.
  }
}