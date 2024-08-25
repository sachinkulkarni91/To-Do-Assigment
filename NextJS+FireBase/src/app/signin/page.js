'use client'
import React from "react";
import signIn from "@/firebase/auth/signin";
import { useRouter } from 'next/navigation'
import PublicRoute from "@/component/PublicRoute";
import Link from "next/link";
import {toast} from 'react-hot-toast'

function Page() {
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const router = useRouter()

    const handleForm = async (event) => {
        event.preventDefault()

        const { result, error } = await signIn(email, password);

        if (error) {
            toast.error('Invalid User')
            return console.log(error)
        }

        
        
        console.log(result)
        toast.success('Sign in successful!');
        return router.push("/")
    }
    return (
        <PublicRoute>
        <div className="flex justify-center items-center h-screen text-black">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                <h1 className="text-3xl font-bold mb-6 text-center">Sign In</h1>
                <form onSubmit={handleForm} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block font-semibold mb-1">Email</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            type="email"
                            name="email"
                            id="email"
                            placeholder="example@mail.com"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block font-semibold mb-1">Password</label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            type="password"
                            name="password"
                            id="password"
                            placeholder="password"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
                    >
                        Login
                    </button>
                </form>
                <p className="mt-4 text-center">
                        Don't have an account?{' '}
                        <Link href="/signup" className="text-blue-500 hover:underline">
                           Sign up
                        </Link>
                    </p>
            </div>
        </div>
        </PublicRoute>
    );
}

export default Page;