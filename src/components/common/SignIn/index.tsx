// Import FirebaseAuth and firebase.
import React, { useState } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { Typography } from '@material-ui/core';
import firebase, { init as initFB } from '../../../utils/firebase';
import { useAuth } from '../../../contexts/AuthContext';

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
    const [groups, setGroupings] = useState<any>(null); // Local signed-in state.
    const { currentUser, isSignedIn, signOut } = useAuth();

    console.log('groups', groups);
    if (isSignedIn && !groups) {
        const { groupings } = initFB();
        console.log('load groupings');
        groupings
            .doc('default')
            .get()
            .then((result) => setGroupings(result.data()));
    }

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
                    Welcome {currentUser?.displayName}! You are now signed-in!
                </p>
            </Typography>

            <button onClick={() => signOut()}>Sign-out</button>
        </div>
    );
};

export default SignInScreen;
