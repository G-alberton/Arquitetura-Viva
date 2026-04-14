import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA2AO_X8njBPB13LASISQQesjgt5k9UmMo",
  authDomain: "loja-3d-8fa67.firebaseapp.com",
  projectId: "loja-3d-8fa67",
  storageBucket: "loja-3d-8fa67.firebasestorage.app",
  messagingSenderId: "929715263847",
  appId: "1:929715263847:web:2c9990c18a8c43c99f37c2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };