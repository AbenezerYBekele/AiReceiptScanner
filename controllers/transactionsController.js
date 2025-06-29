import { sql} from '../config/db.js';



export async function getTransactionsbyUserId (req, res) {
    try {
      const { userId } = req.params;
      console.log("(server#24) Fetching transactions for user:", userId);
      const transactions = await sql`
  SELECT * FROM transactions WHERE user_id = ${userId}
`;
      if (transactions.length === 0) {
        return res.status(404).json({ error: 'No transactions found for this user' });
      }
      return res.status(200).json(transactions);
    } catch (error) {
      console.error("Error in GET /api/transactions/:userId:", error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  
}


export async function createTransaction (req, res) {
  try {
    const { title, amount, category, type, user_id } = req.body;

    if (!title || !amount || !category || !type || !user_id) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const transaction = await sql`
      INSERT INTO transactions (user_id, title, amount, type, category)
      VALUES (${user_id}, ${title}, ${amount}, ${type}, ${category})
      RETURNING *
    `;

    res.status(201).json(transaction[0]);
    console.log("Transaction created:", transaction[0]);
  } catch (error) {
    console.error("Error in POST /api/transactions:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function getTransactionSummary(req, res) {
  try {
   
    const { userId } = req.params;

    const balanceResult = await sql`
      Select COALESCE(SUM(amount), 0) as balance from transactions where user_id = ${userId}
    `;

    const incomeResult = await sql`
      SELECT COALESCE(SUM(amount), 0) as income FROM transactions WHERE user_id = ${userId} AND amount > 0
    `;
    const expenseResult = await sql`
      SELECT COALESCE(SUM(amount), 0) as expense FROM transactions WHERE user_id = ${userId} AND amount < 0
    `;

    res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expense: expenseResult[0].expense
    });
  } catch (error) {
    console.error("Error in GET /api/transactions:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


export async function searchTransactions(req, res) {
  try {
    const { search } = req.query; // e.g. ?search=rent

    if (!search) {
      return res.status(400).json({ error: "Please provide a search term" });
    }

    const transactions = await sql`
      SELECT date, user_id, title, amount, category, type
      FROM transactions
      WHERE
        title ILIKE ${'%' + search + '%'} OR
        type ILIKE ${'%' + search + '%'} OR
        category ILIKE ${'%' + search + '%'} OR
        CAST(amount AS TEXT) ILIKE ${'%' + search + '%'} OR
        CAST(date AS TEXT) ILIKE ${'%' + search + '%'}
    `;

    if (transactions.length === 0) {
      return res.status(404).json({ error: "No matching transactions found" });
    }

    return res.status(200).json(transactions);
  } catch (error) {
    console.error("Error in GET /api/transactions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function deleteTransaction(req, res){
    try {
        const { id } = req.params;
       
        if (isNaN(parseInt(id))) {
            return res.status(400).json({ error: 'Invalid transaction ID' });
        }

        const result = await sql`
            DELETE FROM transactions WHERE id = ${id} RETURNING *
        `;

        if (result.length === 0) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        res.status(200).json({ message: 'Transaction deleted successfully', transaction: result[0] });
    } catch (error) {
        console.log("error deleting the transaction", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}