import Pusher from "pusher";

const {
  PUSHER_APP_ID,
  NEXT_PUBLIC_PUSHER_APP_KEY,
  PUSHER_APP_SECRET,
  NEXT_PUBLIC_PUSHER_APP_CLUSTER,
} = process.env;

const pusher = new Pusher({
  appId: PUSHER_APP_ID!,
  key: NEXT_PUBLIC_PUSHER_APP_KEY!,
  secret: PUSHER_APP_SECRET!,
  cluster: NEXT_PUBLIC_PUSHER_APP_CLUSTER!,
});

export default pusher;
