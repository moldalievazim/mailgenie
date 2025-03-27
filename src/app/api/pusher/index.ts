import Pusher from "pusher";
import { NextApiRequest, NextApiResponse } from "next";

const pusher = new Pusher({
  appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
  secret: process.env.NEXT_PUBLIC_PUSHER_APP_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER!,
  useTLS: true,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { channel, event, ...data } = req.body;

  try {
    await pusher.trigger(channel, event, data);
    res.status(200).end();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
