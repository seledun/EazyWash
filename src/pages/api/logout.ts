import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../utils/prisma';

/**
 * @param req Request-object from the client.
 * @param res Response-object to for the client to get a response
 * @author Sebastian Ledung
 */
export default async function logout(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("stubb");
}