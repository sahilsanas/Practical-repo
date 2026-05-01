import 'dotenv/config';
import { createApp } from './app.js';
import { connectToDatabase } from './db.js';

const app = createApp();

const port = process.env.PORT ? Number(process.env.PORT) : 8084;

await connectToDatabase();

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend listening on http://localhost:${port}`);
});
