
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
  () => mockfirestore
);

// iniciando test
import { createUser, logInUser, authenticateFacebook, authenticateGoogle, passwordReset, logOutUser } from "../src/lib/authBD/authFireBase.js"

describe('createUser', () => {
  it('Deberia ser una funcion', () => {
    expect(typeof (createUser)).toBe('function');
  });
  it('Deberia poder crear un nuevo usuario', () => {
    return createUser('mayrat.casavilca@gmail.com', '123456')
      .then((result) => {
        expect(result.email).toBe('mayrat.casavilca@gmail.com')
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
        expect(user.email).toBe('mayrat.casavilca@gmail')
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
  it('Deberia poder iniciar sesion con Google', () => {
    return authenticateGoogle().then((result) => {
      expect(typeof result).toBe('object')
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



// describe('createPostBDFirestore', () => {
//   it('debería crear un post', () => {
//     expect(createPostBDFirestore());

//     triggers.create(event);
//   });

//   it('update', function() {
//     var event = {
//       data: new firebasemock.DeltaDocumentSnapshot(mockapp, {
//         name: 'bob',
//         createdTime: new Date()
//       }, {
//         name: 'bobby'
//       }, 'users/' + uid),
//       params: {
//         uid: uid
//       }
//     };

//     expect(event.data.previous.get('name')).to.equal('bob');
//     expect(event.data.get('name')).to.equal('bobby');
//     expect(event.params.uid).to.equal(uid);

//     triggers.update(event);
//   });

//   it('delete', function() {
//     var event = {
//       data: new firebasemock.DeltaDocumentSnapshot(mockapp, {
//         name: 'bob',
//         createdTime: new Date()
//       }, null, 'users/' + uid),
//       params: {
//         uid: uid
//       }
//     };

//     expect(event.data.previous.get('name')).to.equal('bob');
//     expect(event.params.uid).to.equal(uid);

//   });
// });
