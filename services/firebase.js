import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import 'firebase/compat/storage';




const firebaseConfig = {

  databaseURL: "https://pracamaquinaintegrada-default-rtdb.firebaseio.com",
  apiKey: "AIzaSyCJsL9KY9JWlQAVb3URYXTu1UkAxJIGo_k",
  authDomain: "pracamaquinaintegrada.firebaseapp.com",
  projectId: "pracamaquinaintegrada",
  storageBucket: "pracamaquinaintegrada.appspot.com",
  messagingSenderId: "200719582716",
  appId: "1:200719582716:web:3494b385a7ae78f5fa9e79"
};

try {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
} catch (err) {
  console.error('Erro ao inicializar o Firebase', err);
}
const storage = firebase.storage();






const database = firebase.database()

export { database, storage, firebase }