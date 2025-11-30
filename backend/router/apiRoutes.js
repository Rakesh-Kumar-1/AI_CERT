import express from 'express';
import pool from '../config/database.js';
const router = express.Router();

router.get('/', (req, res) => {
  return res.status(200).json({ message: "API is working fine" });
});
router.post('/userVerify', async (req, res) => {  
  const { email, password } = req.body;
  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
    if (user.rowCount !== 1) {
      return res.status(400).json({ message: "user not register" });
    }
    return res.status(201).json({message: "login Successfully",info: user.rows[0]});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Login error' });
  }
});

router.post('/newhistory', async (req, res) => {
  const { oldWord, newWord, userId } = req.body;
  if (!newWord || !userId) {
    return res.status(400).json({ error: "newWord and userId are required" });
  }
  const addedWords = newWord.trim().split(" ");
  const removedWords = oldWord ? oldWord.trim().split(" ") : [];
  try {
    const oldchat = await pool.query('SELECT text FROM chat WHERE "userid" = $1 ORDER BY created_at DESC LIMIT 1',[userId]);
    if (oldchat.rowCount === 0) {
      const newLength = newWord.trim().length;
      await pool.query(`INSERT INTO chat("userid", "addedwords", "removedwords", "oldlength", "newlength", "text") VALUES ($1, $2, $3, $4, $5, $6)
      `, [userId, addedWords, removedWords, 0, newLength, newWord]);
      return res.status(201).json({ message: "Message inserted" });
    }

    // Case 2: Update existing message
    const oldSentence = oldchat.rows[0].text;
    const newSentence = oldSentence.replace(oldWord, newWord);

    const oldLength = oldSentence.trim().length;
    const newLength = newSentence.trim().length;

    await pool.query(`
      INSERT INTO chat("userid", "addedwords", "removedwords", "oldlength", "newlength", "text")
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [userId, addedWords, removedWords, oldLength, newLength, newSentence]);

    return res.status(201).json({ message: "Message inserted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Database error while inserting chat' });
  }
});

router.post('/addUser', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const check = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (check.rowCount !== 0) {
      return res.status(409).json({ message: "user already register" });
    }
    const newUser = await pool.query(`INSERT INTO users(name, email, password) VALUES ($1, $2, $3) RETURNING id, name`,[name, email, password]);
    return res.status(201).json({message: "User Register successfully",info: newUser.rows[0]});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Registration error' });
  }
});
router.get('/oldhistory/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const history = await pool.query('SELECT * FROM chat WHERE "userid" = $1 ORDER BY created_at DESC',[id]);
    res.status(200).json({ message: "History fetched successfully",info: history.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching history" });
  }
});

export { router };
