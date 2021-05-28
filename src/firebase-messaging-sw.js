importScripts("https://www.gstatic.com/firebasejs/8.6.2/firebase-app.js")
importScripts("https://www.gstatic.com/firebasejs/8.6.2/firebase-messaging.js")

var firebaseConfig = {
    apiKey: "AIzaSyAUj7DWC0s0qt3_cwYvXf5fcvcJbnP9DuA",
    authDomain: "job-portal-8aa59.firebaseapp.com",
    projectId: "job-portal-8aa59",
    storageBucket: "job-portal-8aa59.appspot.com",
    messagingSenderId: "593914624373",
    appId: "1:593914624373:web:7bc7ac934dfa34b74ffb3c",
    measurementId: "G-95NCG2QDWL"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
      body: 'Background Message body.',
      icon: '/firebase-logo.png'
    };
  
    // self.registration.showNotification(notificationTitle,
    //   notificationOptions);
});