
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
  import {getDatabase, set,ref,get,update,remove} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-database.js"
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyC_zO5t0hxwGlVyf0Etsx1-HsE7y7FQs8Q",
    authDomain: "sarkaripass-4c4a9.firebaseapp.com",
    projectId: "sarkaripass-4c4a9",
    storageBucket: "sarkaripass-4c4a9.firebasestorage.app",
    messagingSenderId: "1058650319168",
    appId: "1:1058650319168:web:f4f479487dccdb1da7b2a5"
  };
  

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
    const db=getDatabase(app)
console.log(db)
const users = [
  { id: 1, firstname: "Kasees", lastname: "Gurung", age: 20, address: "Goldhunga" },
  { id: 2, firstname: "Krrish", lastname: "Gurung", age: 22, address: "Kathmandu" },
  { id: 3, firstname: "Sarita", lastname: "Gurung", age: 25, address: "Lalitpur" },
  { id: 4, firstname: "Aarav", lastname: "Thapa", age: 19, address: "Bhaktapur" },
  { id: 5, firstname: "Nisha", lastname: "Shrestha", age: 21, address: "Pokhara" },
  { id: 6, firstname: "Kiran", lastname: "Lama", age: 24, address: "Dharan" },
  { id: 7, firstname: "Prakash", lastname: "Adhikari", age: 23, address: "Butwal" },
  { id: 8, firstname: "Rita", lastname: "Maharjan", age: 20, address: "Chitwan" },
  { id: 9, firstname: "Sujan", lastname: "Bista", age: 26, address: "Hetauda" },
  { id: 10, firstname: "Anita", lastname: "Rai", age: 22, address: "Itahari" }
];

function writeUserData(userId, firstname, lastname, age, address) {
  set(ref(db, 'users/' + userId), {
    firstname,
    lastname,
    age,
    address,
  });
}

// Insert all 10 users
users.forEach(user => {
  writeUserData(user.id, user.firstname, user.lastname, user.age, user.address);
});

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
updateUserData(2, {firstname: "Abisha", lastname: "Dhakal", age:22, address:"Bhaktapur"});



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

deleteUserData(4);
