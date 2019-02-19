export const createUser = (email, password) => {
  return firebase.auth().createUserWithEmailAndPassword(email, password);
};

export const logInUser = (email, password) => {
  return firebase.auth().signInWithEmailAndPassword(email, password);
};

export const authenticateFacebook = () => {
  let provider = new firebase.auth.FacebookAuthProvider(); 
  return firebase.auth().signInWithPopup(provider);
};

export const authenticateGoogle = () => {
  let provider = new firebase.auth.GoogleAuthProvider(); 
  return firebase.auth().signInWithPopup(provider);
};

export const logOutUser = () => {
  return firebase.auth().signOut();
};

// export const sendEmail = (userRegister, config) => {
//   return userRegister.sendEmailVerification(config);
// };

// export const passwordReset = (email) => {
//   return firebase.auth().sendPasswordResetEmail(email);
// };

// export const userStateChange = (callbackUser, objElements) => {
//   return firebase.auth().onAuthStateChanged((userState) => {
//     callbackUser(userState, objElements);
//   });
// };