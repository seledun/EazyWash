import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../utils/prisma';

/**
 * Function that handles the endpoint /api/countBookings.ts
 * gets all bookings information for a given org_id.
 * @param req Request-object handling information sent by the user.
 * @param res Response-object handling our response to the requesting user.
 */
export default async function getAllBookingsByOrg(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { orgId, year, month } = req.query;

    const result = await prisma.$queryRaw`select * from count_bookings(${year}, ${month}, ${orgId})`;

    res.status(200).json({ success: true, data: result });
  } else {
    res.status(501);
  }
}
