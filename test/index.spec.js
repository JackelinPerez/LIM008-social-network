// configurando firebase moc
const firebasemock = require('firebase-mock');
const mockauth = new firebasemock.MockFirebase();
const mockfirestore = new firebasemock.MockFirestore();
mockfirestore.autoFlush();
mockauth.autoFlush();

global.firebase = firebasemock.MockFirebaseSdk(
  // use null if your code does not use RTDB
  path => (path ? mockdatabase.child(path) : null),
  () => mockauth,
  () => mockfirestore,
);

// iniciando test

import { createUser, logInUser, authenticateFacebook, authenticateGoogle, logOutUser} from '../src/lib/authBD/authFireBase.js';

describe('createUser', () => {
  it('Deberia ser una funcion', () => {
    expect(typeof (createUser)).toBe('function');
  });
  it('Deberia poder crear un nuevo usuario', () => {
    return createUser('mayrat.casavilca@gmail.com', '123456')
      .then((result) => {
        expect(result.email).toBe('mayrat.casavilca@gmail.com');
      });
  });
});

describe('logInUser', () => {
  it('Deberia ser una funcion', () => {
    expect(typeof (logInUser)).toBe('function');
  });
  it('Deberia poder iniciar sesion', () => {
    return logInUser('mayrat.casavilca@gmail', '123456')
      .then((user) => {
        expect(user.email).toBe('mayrat.casavilca@gmail');
      });
  });
});

describe('authenticateFacebook', () => {
  it('Deberia ser una funcion', () => {
    expect(typeof (authenticateFacebook)).toBe('function');
  });
  it('Deberia poder iniciar sesion con Facebook', () => {
    return authenticateFacebook().then((result) => {
      expect(typeof result).toBe('object');
    });
  });
});

describe('authenticateGoogle', () => {
  it('Deberia ser una funcion', () => {
    expect(typeof (authenticateGoogle)).toBe('function');
  });
  it('Deberia poder inisiar sesion con Google', () => {
    return authenticateGoogle().then((result) => {
      expect(typeof result).toBe('object');
    });
  });
});

describe('logOutUser', () => {
  it('Deberia ser una funcion', () => {
    expect(typeof (logOutUser)).toBe('function');
  });
  it('Deberia poder cerrar sesion', () => {
    return logOutUser();
  });
});

