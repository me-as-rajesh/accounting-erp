import app from '../../../app.js';
import { connectDb } from '../../../backend/config/db.js';

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
