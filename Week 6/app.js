// Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
  getDatabase,
  ref,
  set,
  get,
  push
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-database.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCBDVfLB0SN_YKxPX13zia-WbOjNO5KB5Q",
  authDomain: "myapp-53c37.firebaseapp.com",
  projectId: "myapp-53c37",
  storageBucket: "myapp-53c37.firebasestorage.app",
  messagingSenderId: "1081223259247",
  appId: "1:1081223259247:web:bedab672c21849755c199a",
  measurementId: "G-CC6THX5BDK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

console.log("Firebase Connected");

// ======================
// SAVE MESSAGE FUNCTION
// ======================

function saveMessage() {

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !message) {
    alert("Please fill all fields");
    return;
  }

  const contactsRef = ref(db, "contacts");
  const newContactRef = push(contactsRef);

  set(newContactRef, {
    name: name,
    email: email,
    message: message,
    createdAt: new Date().toLocaleString()
  })
  .then(() => {
    alert("Message submitted successfully!");

    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("message").value = "";

    displayMessages();
  })
  .catch((error) => {
    console.error("Error saving message:", error);
  });
}

window.saveMessage = saveMessage;

// ======================
// DISPLAY DATA FUNCTION
// ======================

function displayMessages() {

  const contactsRef = ref(db, "contacts");

  get(contactsRef)
    .then((snapshot) => {

      const messagesDiv = document.getElementById("messages");
      messagesDiv.innerHTML = "";

      // Check if data exists
      if (!snapshot.exists()) {
        console.log("No data found in Firebase");
        messagesDiv.innerHTML = "<p>No messages found.</p>";
        return;
      }

      console.log("===== ALL CONTACT MESSAGES =====");

      // Loop through all records
      snapshot.forEach((childSnapshot) => {

        const key = childSnapshot.key;
        const data = childSnapshot.val();

        // 🔥 PRINT IN CONSOLE (IMPORTANT FOR ASSIGNMENT)
        console.log("ID:", key);
        console.log("Name:", data.name);
        console.log("Email:", data.email);
        console.log("Message:", data.message);
        console.log("Created At:", data.createdAt);
        console.log("--------------------------------");

        // SHOW ON WEBPAGE
        messagesDiv.innerHTML += `
          <div style="
            border:1px solid #ddd;
            padding:12px;
            margin-bottom:10px;
            border-radius:8px;
            background:#fff;
          ">
            <h4>${data.name}</h4>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Message:</strong> ${data.message}</p>
            <small>${data.createdAt}</small>
          </div>
        `;
      });
    })
    .catch((error) => {
      console.error("Error reading messages:", error);
    });
}

window.displayMessages = displayMessages;

// ======================
// LOAD DATA ON PAGE LOAD
// ======================

displayMessages();