"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuthContext();
    const router = useRouter();

    React.useEffect(() => {
        if (!loading && !user) {
            router.replace('/signin');
        }
    }, [loading, user, router]);

    if (loading || !user) {
        return <div>Loading...</div>;
    }

    return children;
};

export default PrivateRoute;