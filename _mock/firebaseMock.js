import { callbackify } from 'util';

const auth = () => {
  return {
    currentUser: {
      sendEmailVerification: (config) => {
        return new Promise((resolve) => {
          resolve('se envio un mensaje de correo electronico para terminar con el proceso');
        });
      }
    },
    sendPasswordResetEmail: (emailUser) => {
      return new Promise((resolve) => {
        resolve('se envio un mensaje de correo electronico para cambiar tu contraseña');
      });
    },
    // onAuthStateChanged: (userState) => {
    //   userState = (state) => {
    //     const stateAux = {
    //       email: 'pepita5@gmail.com',
    //     };
    //     state = stateAux;
    //   };
    // }
  };
};

const firebase = {
  auth,
};

export default jest.fn(() => {
  return firebase;
});