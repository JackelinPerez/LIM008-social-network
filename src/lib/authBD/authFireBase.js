// variables locales
let provider;

export const createUser = (email, password) => {
  return firebase.auth().createUserWithEmailAndPassword(email, password);
};

export const logInUser = (email, password) => {
  return firebase.auth().signInWithEmailAndPassword(email, password);
};

export const authenticateFacebook = () => {
  provider = new firebase.auth.FacebookAuthProvider(); 
  return firebase.auth().signInWithPopup(provider);
};

export const authenticateGoogle = () => {
  provider = new firebase.auth.GoogleAuthProvider(); 
  return firebase.auth().signInWithPopup(provider);
};

export const logOutUser = () => {
  return firebase.auth().signOut();
};

export const sendEmail = (config) => {
  return firebase.auth().currentUser.email.sendEmailVerification(config);
};

export const passwordReset = (email) => {
  return firebase.auth().sendPasswordResetEmail(email);
};

export const userStateChange = (user) => {
  firebase.auth().onAuthStateChanged((userState) => user.push(userState));
  return user;
}

export const dataConnectUser = () => {
  return firebase.auth().currentUser;
}