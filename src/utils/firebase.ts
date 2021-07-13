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

export type FirebaseProps = {
    firebase: firebase.app.App;
    groupings: firebase.firestore.CollectionReference<firebase.firestore.DocumentData>;
    auth: firebase.auth.Auth;
    initialized: boolean;
};

let app: firebase.app.App;
let groupings: firebase.firestore.CollectionReference<firebase.firestore.DocumentData>;
let auth: firebase.auth.Auth;
let initialized = false;
export const init = (): FirebaseProps => {
    if (
        firebase.apps.length === 0 &&
        config.apiKey &&
        config.projectId &&
        config.authDomain &&
        !initialized
    ) {
        app = firebase.initializeApp(config);
        console.log('connection initialized');
        groupings = firebase?.firestore().collection('groupings');
        auth = firebase?.auth();
        initialized = true;
    }

    return {
        firebase: app,
        groupings,
        auth,
        initialized,
    };
};

// export const groupings = firebase?.firestore().collection('groupings');
// export const auth = firebase?.auth();

export default firebase;
