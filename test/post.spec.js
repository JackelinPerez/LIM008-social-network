import MockFirebase from 'mock-cloud-firestore';

const fixtureData = {
  __collection__: {
    posts: {
      __doc__: {
        user1: {
          name: 'Ricardo Lopez',
          age: 26,
          complete: false
        },
      }
    }
  }
};

global.firebase = new MockFirebase(fixtureData, { isNaiveSnapshotListenerEnabled: true });

import { createPostBDFirestore } from '../src/lib/crudBD/crudUser/crudUser.js';

describe('createPostBDFirestore'), () => {
  it('deberia ser una función'), () => {
    expect(typeof (createPostBDFirestore)).toBe('object');
  };
  it('debería crear un post', (done) => {
    const data = fixtureData.__collection__.posts.__doc__.user1;
    return createPostBDFirestore('posts', data)
      .then(() => getAllPost(
        (data) => {
          const result = data.find((post) => post.name === 'Ricardo Lopez');
          expect(post.name).toBe('Ricardo Lopez');
          done();
        }
      ));
  });
};