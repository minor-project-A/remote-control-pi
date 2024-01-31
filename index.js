


import { initializeApp } from "firebase/app";
import express from 'express';
import bodyParser from 'body-parser';
import { getDatabase, ref, set } from "firebase/database";

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
  express_app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  const database = getDatabase(app);
  await set(ref(database, 'containers/0'), {
    name: 'Aspirin',
    dosage: '1 pill',
    frequency: 'Daily',
    time: '8:00 AM',
    remaining: 10
  });
}

startServer();
