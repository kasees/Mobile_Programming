import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {
  getDatabase,
  ref,
  set,
  get,
  update,
  push,
  onValue
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCkqUPRlevT1J7OudbeALZ6eaGhHY1uyyw",
  authDomain: "sarkaripass-f977a.firebaseapp.com",
  databaseURL:
    "https://sarkaripass-f977a-default-rtdb.firebaseio.com",
  projectId: "sarkaripass-f977a",
  storageBucket: "sarkaripass-f977a.firebasestorage.app",
  messagingSenderId: "303500143355",
  appId: "1:303500143355:web:9a979baf9f599a78df1e5e"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export {
  db,
  ref,
  set,
  get,
  update,
  push,
  onValue
};