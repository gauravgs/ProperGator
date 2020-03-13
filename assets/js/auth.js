var firebaseConfig = {
    apiKey: "AIzaSyBZqcjvhSwn83MWYdd7zs64lEJ4uToxZYI",
    authDomain: "propogator-2cc09.firebaseapp.com",
    databaseURL: "https://propogator-2cc09.firebaseio.com",
    projectId: "propogator-2cc09",
    storageBucket: "propogator-2cc09.appspot.com",
    messagingSenderId: "981440900539",
    appId: "1:981440900539:web:33994faa9533c0f6f3a89e",
    measurementId: "G-65XK5QD0VE"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
const auth = firebase.auth();

function logout(){
    localStorage.clear();
    auth.signOut();
}