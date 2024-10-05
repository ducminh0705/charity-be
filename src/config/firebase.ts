import * as admin from 'firebase-admin';
import serviceAccount from '../locals/firebaseServiceAccount.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export default admin;
