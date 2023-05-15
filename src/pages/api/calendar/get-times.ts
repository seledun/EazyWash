import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../../utils/prisma';
import { parse } from 'cookie';

/**
 * Function that handles the endpoint /api/bookingsForSpecificDay.ts
 * gets all bookings information for org_id for the specific day given.
 * @param req Request-object handling information sent by the user.
 * @param res Response-object handling our response to the requesting user.
 * @author Petter Carlsson
 * @author Sebastian Ledung
 */
export default async function GetTimes (
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {

    const DATE = req.query.date;
    const COOKIES = parse(req.headers.cookie || '');
    const SESSION : string | undefined = COOKIES['session-id'];

    if (SESSION != undefined && DATE !== undefined) {

      type sessionData = {
        username: string,
        per_id: number,
        org_id: number
      };

      prisma.$connect;

      const QUERY = `select per.username, per.per_id, per.org_id from Authentication auth
      join person per on auth.person = per.per_id
      where auth.token = '${SESSION}';`
      const SESSION_DATA : sessionData[] = await prisma.$queryRawUnsafe(QUERY);
      
      const DATE_QUERY = `select * from get_booked_times_for_specific_day(${SESSION_DATA[0].org_id}, '${DATE}')`;
      const RESULT = await prisma.$queryRawUnsafe(DATE_QUERY);

      res.status(200).json({ success: true, data: RESULT });

      prisma.$disconnect;

    } else {
      res.status(501).json({success: false}); // malformed request.
    }
  }
} 