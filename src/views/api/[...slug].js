import app from '../../../app';
import { connectDb } from '../../../backend/config/db';

const handler = async (req, res) => {
  await connectDb();
  return app(req, res);
};

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default handler;
