import { NextApiRequest, NextApiResponse } from "next";
import pusher from "../../../../utils/pusher";


export default async (req: NextApiRequest, res: NextApiResponse) => {

    const { id } = req.query

    if (typeof id !== "string") return res.status(400).send("id must be a string")

    await pusher.trigger(id, "read", {});
    /**
     * do some db stuff?
     */

    res.status(200).send("ok")
}