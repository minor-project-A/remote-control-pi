
import { initializeApp } from "firebase/app";
import express from 'express';
import bodyParser from 'body-parser';
import { getDatabase, ref, set, get } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC_t2uXQXKX2h5LkTieKGUhx5B_pqXKXpE",
  authDomain: "remote-control-pi-6c1c2.firebaseapp.com",
  projectId: "remote-control-pi-6c1c2",
  storageBucket: "remote-control-pi-6c1c2.appspot.com",
  messagingSenderId: "768247340002",
  appId: "1:768247340002:web:e0caa89eda6a814602b7bb",
  measurementId: "G-XWT10HCP32",
    databaseURL: "https://remote-control-pi-6c1c2-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);

async function startServer() {
  const express_app = express();
  const port = 3000;
  express_app.use(bodyParser.json());
  express_app.use(express.static('public'));

  // Function to initialize container data
  async function initializeContainerData(containerId, name, time, remaining) {
    const database = getDatabase(app);
    const containerRef = ref(database, `containers/${containerId}`);
    const containerData = await get(containerRef);

    if (!containerData.exists()) {
      // Container doesn't exist, initialize with default values
      await set(containerRef, {
        name: name,
        time: time,
        remaining: remaining,
      });
      console.log(`Container ${containerId} initialized with default values.`);
    }
  }

  // Initialize data for ConA and ConB if they don't exist yet
  await initializeContainerData('ConA', 'DefaultNameA', '08:00', 10);
  await initializeContainerData('ConB', 'DefaultNameB', '10:00', 15);

  express_app.post('/dispense', async (req, res) => {
    try {
      const { containerIndex } = req.body;
      const responseMessage = `Medicine dispensed for container ${containerIndex}`;
      res.json({ message: responseMessage });

      const database = getDatabase(app);
      await set(ref(database, `containers/${containerIndex}/dispensed`), true);
    } catch (error) {
      console.error('Error dispensing medicine:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  express_app.get('/getContainerData/:containerId', async (req, res) => {
    try {
      const containerId = req.params.containerId;
      const database = getDatabase(app);
      const containerData = await get(ref(database, `containers/${containerId}`));

      if (containerData.exists()) {
        res.json(containerData.val());
      } else {
        res.status(404).json({ message: 'Container not found' });
      }
    } catch (error) {
      console.error('Error getting container data:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  express_app.post('/updateContainerData/:containerId', async (req, res) => {
    try {
      const containerId = req.params.containerId;
      const { name, time, remaining } = req.body;
      const database = getDatabase(app);
      await set(ref(database, `containers/${containerId}`), {
        name: name,
        time: time,
        remaining: remaining,
      });
      res.json({ message: 'Container data updated successfully' });
    } catch (error) {
      console.error('Error updating container data:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  express_app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

startServer();
