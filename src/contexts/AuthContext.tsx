import React, { useContext, useState, useEffect } from 'react';
import firebase, { init } from '../utils/firebase';

const { auth, initialized } = init();

type ContextProps = {
    isSignedIn: boolean;
    signOut: () => Promise<void>;
    currentUser?: firebase.User | null;
};

const signOut = () => {
    return auth.signOut();
};

const AuthContext = React.createContext<ContextProps>({
    isSignedIn: false,
    signOut,
});

export function useAuth() {
    return useContext(AuthContext);
}

type Props = {
    children?: React.ReactNode;
};

export const AuthProvider: React.FC = ({ children }: Props) => {
    const [currentUser, setCurrentUser] = useState<firebase.User | null>();
    const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth?.onAuthStateChanged((user) => {
            if (user) {
                setIsSignedIn(true);
            } else {
                setIsSignedIn(false);
            }
            setCurrentUser(user);
            setLoading(false);
        });
        // Make sure we un-register Firebase observers when the component unmounts.
        return () => unsubscribe && unsubscribe();
    }, []);

    const value = {
        currentUser,
        isSignedIn,
        signOut,
    };

    const readyToLoad = initialized ? !loading : true;

    return (
        <AuthContext.Provider value={value}>
            {readyToLoad && children}
        </AuthContext.Provider>
    );
};
