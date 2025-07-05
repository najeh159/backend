const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const router = express.Router();

const mongoURI = process.env.MONGO_URI;
const client = new MongoClient(mongoURI);
let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db('stats'); // your database name
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error);
  }
}

connectDB();

// GET all stats (should be a single document in your case)
router.get('/stats', async (req, res) => {
  try {
    const stats = await db.collection('stats').find({}).toArray();
    res.json(stats);
  } catch (error) {
    console.error('❌ Error fetching stats:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST to update stats (increment values)
router.post('/stats', async (req, res) => {
  try {
    const newStat = req.body; // { sessions, timeWatched, donations }

    const existing = await db.collection('stats').findOne({ _id: new ObjectId("686828d7d5a9b79b84a796a8") });

    if (existing) {
      await db.collection('stats').updateOne(
        { _id: existing._id },
        {
          $inc: {
            sessions: newStat.sessions || 0,
            timeWatched: newStat.timeWatched || 0,
            donations: parseFloat(newStat.donations) || 0
          }
        }
      );
    } else {
      await db.collection('stats').insertOne({
        sessions: newStat.sessions || 0,
        timeWatched: newStat.timeWatched || 0,
        donations: parseFloat(newStat.donations) || 0
      });
    }

    res.status(200).json({ message: 'Stats updated successfully' });
  } catch (error) {
    console.error('❌ Error adding stat:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
