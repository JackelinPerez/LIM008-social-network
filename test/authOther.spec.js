import myMockAuth from '../_mock/firebaseMock.js';

global.firebase = myMockAuth();
import { sendEmail, passwordReset, userStateChange } from '../src/lib/authBD/otherAuth.js';

describe('userStateChange', () => {
  it('Deberia ser una funcion: userStateChange', () => {
    expect(typeof userStateChange).toBe('function');
  });
      
//   it('Deberia poder saber el estado de coneccion de mi usuario', (done) => {
//     const callbackUser = (userState) => {
//       console.log(userState);
//       done();
//     }; 
//     userStateChange(callbackUser);
//   });
});
  
describe('sendEmail', () => {
  it('Deberia ser una funcion: userStateChange', () => {
    expect(typeof sendEmail).toBe('function');
  });
  it('Deberia enviar un correo de confirmacion del usuario para terminar con el proceso de registro', () => {
    sendEmail('http://localhost:8887/src')
      .then((result) => {
        expect(result).toBe('se envio un mensaje de correo electronico para terminar con el proceso');
      });
  });
});
  
describe('passwordReset', () => {
  it('Deberia ser una funcion: passwordReset', () => {
    expect(typeof passwordReset).toBe('function');
  });
  
  it('Deberia enviar correo de reestablecimiento de cuenta', () => {
    passwordReset('pepita5@gmail.com')
      .then((result) => {
        expect(result).toBe('se envio un mensaje de correo electronico para cambiar tu contraseña');
      });
  });  
});