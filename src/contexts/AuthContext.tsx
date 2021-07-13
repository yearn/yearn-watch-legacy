import React, { useContext, useState, useEffect } from 'react';
import firebase, { auth } from '../utils/firebase';

type ContextProps = {
    currentUser?: firebase.User;
};

const AuthContext = React.createContext<Partial<ContextProps>>({});

export function useAuth() {
    return useContext(AuthContext);
}

type Props = {
    children?: React.ReactNode;
};

export const AuthProvider: React.FC = ({ children }: Props) => {
    const [currentUser, setCurrentUser] = useState<firebase.User | undefined>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setCurrentUser(user);
            }
            setLoading(false);
        });
        // Make sure we un-register Firebase observers when the component unmounts.
        return () => unsubscribe();
    }, []);

    const value = {
        currentUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
