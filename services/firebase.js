import firebase from 'firebase/compat/app';
import 'firebase/compat/database';


const firebaseConfig = {
    apiKey: "AIzaSyDSTC_8iyUq4lkmUYJHCzRuE4CpTL0HdC4",
    authDomain: "temperature-iot-c6340.firebaseapp.com",
    databaseURL: "https://temperature-iot-c6340-default-rtdb.firebaseio.com",
    projectId: "temperature-iot-c6340",
    storageBucket: "temperature-iot-c6340.appspot.com",
    messagingSenderId: "617322064674",
    appId: "1:617322064674:web:fb1aaf1bbe4a642c14137b"
};

try {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
  } catch (err) {
    console.error('Erro ao inicializar o Firebase', err);
  }

const database = firebase.database()

export {database, firebase}