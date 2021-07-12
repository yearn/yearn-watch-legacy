// Import FirebaseAuth and firebase.
import React, { useEffect, useState } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase, { scores } from '../../../utils/firebase';

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
    const [score, setScore] = useState<any>(null); // Local signed-in state.

    console.log('score', score);
    if (isSignedIn && !score) {
        console.log('load score');
        scores
            .doc('1')
            .get()
            .then((result) => setScore(result.data()));
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
                <h1>My App</h1>
                <p>Please sign-in:</p>
                <StyledFirebaseAuth
                    uiConfig={uiConfig}
                    firebaseAuth={firebase.auth()}
                />
            </div>
        );
    }
    return (
        <div>
            <h1>My App</h1>
            <p>
                Welcome {firebase.auth()?.currentUser?.displayName}! You are now
                signed-in!
            </p>
            <button onClick={() => firebase.auth()?.signOut()}>Sign-out</button>
        </div>
    );
};

export default SignInScreen;
