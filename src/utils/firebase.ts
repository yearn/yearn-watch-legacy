import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { collection, Collection } from 'typesaurus';
import { Groups } from '../types/grouping';
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
    groupings: Collection<Groups>;
    auth: firebase.auth.Auth;
    initialized: boolean;
};

let app: firebase.app.App;
let groupings: Collection<Groups>;
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
        groupings = collection<Groups>('groupings');
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

export default firebase;
