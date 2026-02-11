import 'dotenv/config';

import app from './app.js';
import { connectDb } from './backend/config/db.js';

const port = process.env.PORT ? Number(process.env.PORT) : 5000;

(async () => {
  await connectDb();
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on http://localhost:${port}`);
  });
})().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
