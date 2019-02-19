import MockFirebase from 'mock-cloud-firestore';

const fixtureData = {
  __collection__: {
    Post: {
      __doc__: {
        post1: {
          description: 'Un mundo tech es un mundo sin fin',
          privacy: 'publico'
        },
        post2: {
          description: 'Nuevos smartphones llegarán a Perú este 2019',
          privacy: 'publico'
        }
      }
    }
  }
};

global.firebase = new MockFirebase(fixtureData, { isNaiveSnapshotListenerEnabled: true });


import { createPostBDFireStore } from '../src/lib/crudBD/crudUser/crudUser.js';
import { getPost } from '../src/UI/view-controller.js';

const post3 = {
  description: 'Tecnologia en tus manos',
  privacy: 'amigos'
};

describe('Wallpost', () => {
  it('Debería poder agregar un post', (done) => {
    return createPostBDFireStore('Post', post3)
      .then(() => getPost(
        (data) => {
          const result = data.find((post3) => post3.description === 'Tecnologia en tus manos');
          expect(result.post3).toBe('Tecnologia en tus manos');
          done();
        }
      ));
  });
});
