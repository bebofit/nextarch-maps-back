import * as admin from 'firebase-admin';
import config from '../config';

// const { FIREBASE_ADMIN } = config;

class Admin {
  constructor() {
    // const config = JSON.parse(FIREBASE_ADMIN);
    // admin.initializeApp({
    //   credential: admin.credential.cert(config)
    // });
  }

  async verifyToken(idToken: string, uid: string): Promise<boolean> {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      //   console.log(decodedToken);
      if (uid !== decodedToken.uid) {
        return false;
      }
      // you can take data from decoedToken here
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default new Admin();
