import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { getEnv } from './env';

const { fbAuthDomain, fbApiKey, fbProjectId } = getEnv();

// Configure Firebase.
const config = {
    apiKey: fbApiKey,
    authDomain: fbAuthDomain,
    projectId: fbProjectId,
    // ...
};

if (firebase.apps.length === 0) {
    firebase.initializeApp(config);
    console.log('connection initialized');
}

export const groupings = firebase?.firestore().collection('groupings');
export const auth = firebase?.auth();

export default firebase;
