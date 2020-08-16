import * as firebase from 'firebase'

let config = {
    apiKey: "AIzaSyAgtOMsgueqoE1acwvIDADQLZDPWYiW7PE",
    authDomain: "stinder-3b3b6.firebaseapp.com",
    databaseURL: "https://stinder-3b3b6.firebaseio.com",
    projectId: "stinder-3b3b6",
    storageBucket: "stinder-3b3b6.appspot.com",
    messagingSenderId: "274076431598",
    appId: "1:274076431598:web:7a3a0b1887c288eb9cefff"
};

firebase.initializeApp(config);

export default firebase;