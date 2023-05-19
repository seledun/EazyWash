import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../utils/prisma';
import { parse } from 'cookie';

/**
 * Function that handles the endpoint /api/list.ts\
 * gets all bookings information for a given org_id.
 * @param req Request-object handling information sent by the user.
 * @param res Response-object handling our response to the requesting user.
 * @author Petter Carlsson
 * @author Sebastian Ledung
 */
export default async function getAllBookingsByOrg(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') { 
    const COOKIES = parse(req.headers.cookie || '');
    const ORG_ID : number = parseInt(COOKIES['org-id']);

    const { SPAN, DATE } = req.query;

    if (SPAN === 'day' && !isNaN(ORG_ID)) {
      
      type resp = {
        record: string[];
      };
      
      const RESULT : resp = await prisma.$queryRaw`select get_booked_times_for_specific_day(${ORG_ID}, ${DATE})`;

      res.status(200).json({success: true, data: JSON.stringify(RESULT)});
    
    } else {
      res.status(401).json({success: false});
    }

  } else {
    res.status(501); 
  }
}