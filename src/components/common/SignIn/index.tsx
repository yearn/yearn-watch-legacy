// Import FirebaseAuth and firebase.
import React, { useEffect, useState } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { Typography } from '@material-ui/core';
import firebase, { groupings } from '../../../utils/firebase';

// Configure FirebaseUI.
const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // We will display Google and Facebook as auth providers.
    signInOptions: [firebase.auth?.GithubAuthProvider.PROVIDER_ID],
    callbacks: {
        // Avoid redirects after sign-in.
        signInSuccessWithAuthResult: () => false,
    },
};

const SignInScreen = () => {
    const [isSignedIn, setIsSignedIn] = useState(false); // Local signed-in state.
    const [groups, setGroupings] = useState<any>(null); // Local signed-in state.

    console.log('groups', groups);
    if (isSignedIn && !groups) {
        console.log('load groupings');
        groupings
            .doc('default')
            .get()
            .then((result) => setGroupings(result.data()));
    }

    // Listen to the Firebase Auth state and set the local state.
    useEffect(() => {
        const unregisterAuthObserver = firebase
            .auth()
            .onAuthStateChanged((user) => {
                setIsSignedIn(!!user);
            });
        return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
    }, []);

    if (!isSignedIn) {
        return (
            <div>
                <Typography style={{ color: '#fff' }}>
                    <p>Please sign-in:</p>
                </Typography>

                <StyledFirebaseAuth
                    uiConfig={uiConfig}
                    firebaseAuth={firebase.auth()}
                />
            </div>
        );
    }
    return (
        <div>
            <Typography style={{ color: '#fff' }}>
                <p>
                    Welcome {firebase.auth()?.currentUser?.displayName}! You are
                    now signed-in!
                </p>
            </Typography>

            <button onClick={() => firebase.auth()?.signOut()}>Sign-out</button>
        </div>
    );
};

export default SignInScreen;
