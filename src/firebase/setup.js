import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAEtpIEm4MAImQ7IGBUEksMEV1OytuNr-s",
  authDomain: "students-9845e.firebaseapp.com",
  projectId: "students-9845e",
  storageBucket: "students-9845e.firebasestorage.app",
  messagingSenderId: "11426988393",
  appId: "1:11426988393:web:be148962ce69488108fdf8",
  //measurementId: "G-P1F0H0P4KB"
};

const app = initializeApp(firebaseConfig);
export default app;