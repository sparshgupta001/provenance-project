const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const crypto = require('crypto');

const app = express();
const port = 5000;
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'provenance_db';
const collectionName = 'product_chain';

app.use(cors());
app.use(express.json());

let db;

// Connect to MongoDB
async function connectToDb() {
    try {
        const client = await MongoClient.connect(mongoUrl);
        db = client.db(dbName);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1);
    }
}

// Helper function to create SHA256 hash
function createHash(data) {
    return crypto
        .createHash('sha256')
        .update(JSON.stringify(data))
        .digest('hex');
}

// POST endpoint to add a new entry
app.post('/api/entry', async (req, res) => {
    try {
        const { batch_id, role, data } = req.body;

        if (!batch_id || !role || !data) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const collection = db.collection(collectionName);

        // Find the most recent entry for this batch_id
        const lastEntry = await collection
            .find({ batch_id })
            .sort({ timestamp: -1 })
            .limit(1)
            .toArray();

        const timestamp = new Date();
        const previous_hash = lastEntry.length > 0 ? lastEntry[0].current_hash : '000000';
        
        // Create new entry
        const newEntry = {
            batch_id,
            role,
            data,
            timestamp,
            previous_hash,
            current_hash: createHash({ batch_id, role, data, timestamp, previous_hash })
        };

        await collection.insertOne(newEntry);
        res.status(201).json(newEntry);
    } catch (err) {
        console.error('Error creating entry:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET endpoint to retrieve chain for a batch_id
app.get('/api/chain/:batch_id', async (req, res) => {
    try {
        const { batch_id } = req.params;
        const collection = db.collection(collectionName);

        const chain = await collection
            .find({ batch_id })
            .sort({ timestamp: 1 })
            .toArray();

        res.json(chain);
    } catch (err) {
        console.error('Error retrieving chain:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start server after connecting to MongoDB
connectToDb().then(() => {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
});
