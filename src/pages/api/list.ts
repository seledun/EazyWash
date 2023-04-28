import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../utils/prisma';

/**
 * Function that handles the endpoint /api/list.ts\
 * gets all bookings information for a given org_id.
 * @param req Request-object handling information sent by the user.
 * @param res Response-object handling our response to the requesting user.
 * @author Petter Carlsson
 */
export default async function getAllBookingsByOrg(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') { 

    const { orgId } = req.query;

    const result = await prisma.$queryRaw`select * from get_booking_info_by_org_id(${orgId})`;

    res.status(200).json({success: true, data: result});
        
  } else {
    res.status(501); 
  }
}
