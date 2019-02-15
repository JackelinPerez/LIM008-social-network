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

import { createPostBDFirestore } from "../src/lib/crudBD/crudUser/crudUser.js"

describe('createPostBDFirestore'), () => {
    it('deberia ser una función'), () => {
      expect(typeof (createPostBDFirestore)).toBe('object');
    };
  };