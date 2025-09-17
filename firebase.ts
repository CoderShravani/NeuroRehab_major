// FIX: Switched to Firebase v8 compat imports to resolve module export errors.
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAfj6O5Z9w-rvUQkrkznbS-kzirm7p2Eks",
  authDomain: "healxperience-fb66e.firebaseapp.com",
  projectId: "healxperience-fb66e",
  storageBucket: "healxperience-fb66e.appspot.com",
  messagingSenderId: "15158803212",
  appId: "1:15158803212:web:4cfb7fad57415d46aaa729"
};

// Initialize Firebase
// FIX: Use firebase.initializeApp (v8 compat) and ensure it only runs once.
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Services
// FIX: Use firebase.auth() and firebase.firestore() (v8 compat).
const auth = firebase.auth();
const db = firebase.firestore();

// FIX: Export the firebase object itself for access to things like auth providers and FieldValue.
export { auth, db, firebase };
