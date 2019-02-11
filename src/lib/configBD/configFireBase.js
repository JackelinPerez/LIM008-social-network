export const configBD = () => {
  const config = {
    apiKey: 'AIzaSyB6y4plbowLP3O7C8zj6jRwNOo2qt92Lkc',
    authDomain: 'myfirstbdsn.firebaseapp.com',
    databaseURL: 'https://myfirstbdsn.firebaseio.com',
    projectId: 'myfirstbdsn',
    storageBucket: 'myfirstbdsn.appspot.com',
    messagingSenderId: '768660542055'
  };
  firebase.initializeApp(config);
  return 1;
};