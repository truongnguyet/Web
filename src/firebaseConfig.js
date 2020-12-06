import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyDjsSlFHbDKHd0bhZ-5mrAOVb5KnnKEDgE",
    authDomain: "amisprocess.firebaseapp.com",
    projectId: "amisprocess",
    storageBucket: "amisprocess.appspot.com",
    messagingSenderId: "94216398872",
    appId: "1:94216398872:web:20974561d3311952c33b6d",
    measurementId: "G-364HMZWZ4V"
};

firebase.initializeApp(firebaseConfig)

export const firestore = firebase.firestore()
export const auth = firebase.auth()
export const storage = firebase.storage()
