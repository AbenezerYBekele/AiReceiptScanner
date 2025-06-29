import express from 'express';
import dotenv from 'dotenv';
import { sql, initDB } from './config/db.js';
import rateLimiter from './middleware/rateLimiter.js';
import transactionsRoute from './routes/transactionsRoute.js';

dotenv.config();

const app = express();

app.use(rateLimiter);
app.use(express.json());

app.use((req, _res, next) => {
  console.log("server line 11", `${req.method} ${req.url}`);
  next();
});

const PORT = process.env.PORT || 5001;

app.get('/', (_req, res) => {
  res.send('it is work');
});


app.use("/api/transactions", transactionsRoute);

let server;

initDB().then(() => {
  server = app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
  });
});

process.once('SIGUSR2', () => {
  server?.close(() => {
    process.kill(process.pid, 'SIGUSR2');
  });
});

process.on('SIGINT', () => {
  server?.close(() => {
    process.exit(0);
  });
});
