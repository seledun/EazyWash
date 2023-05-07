import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../utils/prisma';

/**
 * Function that handles the endpoint /api/bookingsForSpecificDay.ts
 * gets all bookings information for org_id for the specific day given.
 * @param req Request-object handling information sent by the user.
 * @param res Response-object handling our response to the requesting user.
 * @author Petter Carlsson
 */
export default async function getBookingsForSelectedDay(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { orgId, date } = req.query;

    const result = await prisma.$queryRaw`select * from get_booked_times_for_specific_day(${orgId}, ${date})`;

    res.status(200).json({ success: true, data: result });
  } else {
    res.status(501);
  }
}
