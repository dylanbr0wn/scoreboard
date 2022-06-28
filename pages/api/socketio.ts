import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "../../utils/types";
import { Server as ServerIO } from "socket.io";
import { Server as NetServer } from "http";
import { isPlainObject } from "react-query/types/core/utils";
import { emit } from "process";

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async (req: NextApiRequest, res: NextApiResponseServerIO) => {
    if (!res.socket.server.io) {
        console.log("New Socket.io server...");
        // adapt Next's net Server to http Server
        const httpServer: NetServer = res.socket.server as any;
        const io = new ServerIO(httpServer, {
            path: "/api/socketio",
        });

        io.on("connection", (socket) => {
            console.log("New Socket.io connection...");

            //a client joins the room, either control or board
            socket.join(socket.handshake.query.boardId!);
            // should prolly add a room for just boards and one for client, so we can track?


            // for now lets assume 1 control per board

            socket.on("get-board", () => {
                socket.to(socket.handshake.query.boardId!).emit("get-board")
            })

            socket.on("board", (board) => {
                socket.to(socket.handshake.query.boardId!).emit("board", board)
            })


            socket.on("disconnect", () => {
                console.log("Socket.io connection closed...");
            });
            socket.on("update-board", (partialBoard) => {
                socket.to(socket.handshake.query.boardId!).emit("update-board", partialBoard);
            })
        });





        // append SocketIO server to Next.js socket server response
        res.socket.server.io = io;
    }
    res.end();
};
