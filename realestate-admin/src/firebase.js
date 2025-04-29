// import firebase from 'firebase/app';
// import 'firebase/messaging';

// const firebaseConfig = {
//   apiKey: import.meta.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: import.meta.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   projectId: import.meta.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket:import.meta.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.REACT_APP_FIREBASE_APP_ID,
//   measurementId: import.meta.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
// };

// // Initialize Firebase
// firebase.initializeApp(firebaseConfig);

// const messaging = firebase.messaging();

// export const requestPermission = async () => {
//   try {
//     await Notification.requestPermission();
//     const token = await messaging.getToken();
//     console.log('FCM Token:', token);
//     return token;
//   } catch (error) {
//     console.error('Permission denied or error:', error);
//     return null;
//   }
// };

// export default messaging;
