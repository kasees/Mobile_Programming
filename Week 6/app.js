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

function writeUserData(userId, firstname, lastname, age, address) {
  set(ref(db, 'users/' + userId), {
    firstname,
    lastname,
    age,
    address,
  })
  .then(() => {
    console.log("User added successfully with ID:", userId);
  })
  .catch((error) => {
    console.error("Error addding user:", error);
  });
}
window.writeUserData = writeUserData;



function readUser(){
    const userRef = ref(db,'users')
    get(userRef).then((snapshot)=>{
        snapshot.forEach((childsnapshot)=>{
            console.log(childsnapshot.val());
        })
    })
}
//readUser()
window.readUser = readUser;

// Read a single user by ID and show the result on the page.
function readUserById(userId) {
  const userRef = ref(db, 'users/' + userId);
  get(userRef).then((snapshot) => {
    const user = snapshot.val();
    console.log("User found:", user);
    document.getElementById('read-result').textContent =
    `First Name: ${user.firstname}
    Last Name: ${user.lastname}
    Age: ${user.age}
    Address: ${user.address}`;
  });
}
window.readUserById = readUserById;

// Fetch an existing user by ID and load their data into the update input fields,
// so the values can be edited and then saved with updateUserData().
function fetchUserForUpdate(userId) {
  const userRef = ref(db, 'users/' + userId);
  get(userRef).then((snapshot) => {
    const user = snapshot.val();
    document.getElementById('update-firstname').value = user.firstname;
    document.getElementById('update-lastname').value = user.lastname;
    document.getElementById('update-age').value = user.age;
    document.getElementById('update-address').value = user.address;
    console.log("Loaded user into form:", user);
  });
}
window.fetchUserForUpdate = fetchUserForUpdate;

function updateUserData(userId, updatedData) {
  const userRef = ref(db, 'users/' + userId);
  update(userRef, updatedData)
    .then(() => {
      console.log("User updated successfully");
    })
    .catch((error) => {
      console.error("Error updating user:", error);
    });
}

// Example usage:
//updateUserData();
window.updateUserData = updateUserData;


function deleteUserData(userId) {
  const userRef = ref(db, 'users/' + userId);
  remove(userRef)
    .then(() => {
      console.log("User deleted successfully");
    })
    .catch((error) => {
      console.error("Error deleting user:", error);
    });
}

// Example usage:
//deleteUserData(2);
window.deleteUserData = deleteUserData;