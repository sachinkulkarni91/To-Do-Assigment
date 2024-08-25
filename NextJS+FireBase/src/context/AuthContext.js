"use client"

import React, { createContext } from 'react';
import {
    onAuthStateChanged,
    getAuth,
    signOut,
} from 'firebase/auth';
import firebase_app from '@/firebase/../config';

const auth = getAuth(firebase_app);

export const AuthContext = createContext({});

export const useAuthContext = () => React.useContext(AuthContext);

export const AuthContextProvider = ({
    children,
}) => {
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [logout, setLogout] = React.useState(null);

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                setLogout(() => async () => {
                    try {
                        await signOut(auth);
                    } catch (error) {
                        console.log(error);
                    }
                });
            } else {
                setUser(null);
                setLogout(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, logout }}>
            {loading ? <div>Loading...</div> : children}
        </AuthContext.Provider>
    );
};