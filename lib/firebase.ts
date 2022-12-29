import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBWxRkeReS3ZjxEdyT0rQoSFv8DYCjqQbI",
    authDomain: "fireship-next-fire.firebaseapp.com",
    projectId: "fireship-next-fire",
    storageBucket: "fireship-next-fire.appspot.com",
    messagingSenderId: "409474338777",
    appId: "1:409474338777:web:6b6e2877c6d7ffde6b13c8",
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
