
// In server.js

import express from 'express';
import dotenv from 'dotenv';
import { sql, initDB } from './config/db.js';
import transactionsRoute from './routes/transactionsRoute.js';

dotenv.config();

const app = express();

app.use(express.json());

app.use((req, _res, next) => {
  console.log("server line 11", `${req.method} ${req.url}`);
  next();
});

const PORT = process.env.PORT || 5001;

app.get('/', (_req, res) => {
  res.send('it is work');
});

// =========================================================
// === CORRECTED SECTION ===
// =========================================================

// 1. UNCOMMENT and FIX the path for your transaction routes.
// Your app is requesting '/transactions', not '/api/transactions'.
app.use("/transactions", transactionsRoute);

// 2. DELETE the incorrect summary route.
// It belongs inside your transactionsRoute.js file.
// DELETE THIS LINE: app.use("/summary/:userId", TransactionSummary);

// =========================================================

let server;

initDB().then(() => {
  server = app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
  });
});

// ... (rest of your file is fine)
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


// import express from 'express';
// import dotenv from 'dotenv';
// import { sql, initDB } from './config/db.js';
// // import rateLimiter from './middleware/rateLimiter.js';
// import transactionsRoute from './routes/transactionsRoute.js';

// dotenv.config();

// const app = express();

// // app.use(rateLimiter);
// app.use(express.json());

// app.use((req, _res, next) => {
//   console.log("server line 11", `${req.method} ${req.url}`);
//   next();
// });

// const PORT = process.env.PORT || 5001;

// app.get('/', (_req, res) => {
//   res.send('it is work');
// });


// app.use("/api/transactions", transactionsRoute);
// app.use("/summary/:userId", TransactionSummary);

// let server;

// initDB().then(() => {
//   server = app.listen(PORT, () => {
//     console.log('Server is running on port', PORT);
//   });
// });

// process.once('SIGUSR2', () => {
//   server?.close(() => {
//     process.kill(process.pid, 'SIGUSR2');
//   });
// });

// process.on('SIGINT', () => {
//   server?.close(() => {
//     process.exit(0);
//   });
// });
