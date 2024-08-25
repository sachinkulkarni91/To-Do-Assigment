'use client'
import React from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import PrivateRoute from "@/component/PrivateRoute";

function Page() {
    const { user, logout } = useAuthContext();
    const router = useRouter();

    React.useEffect(() => {
        if (user == null) router.push("/");
    }, [user]);

    const handleLogout = async () => {
        try {
            await logout();
            router.push("/");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <PrivateRoute>
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-3xl font-bold mb-6">Only logged in users can view this page</h1>
            <button
                onClick={handleLogout}
                className="bg-red-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-600 transition-colors duration-300"
            >
                Logout
            </button>
        </div>
        </PrivateRoute>
    );
}

export default Page;