"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    useEffect(() => {
        const token = localStorage.getItem('access_token');

        if (!token) {
            toast.error("You're not logged in. Redirecting to the login page");
            router.push('/faculty/login'); 
        }
    }, []);

    return children;
};

export default AuthGuard;