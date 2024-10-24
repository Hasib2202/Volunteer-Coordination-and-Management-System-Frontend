// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { NextPage } from 'next';

// export function withAuthProtection<P extends object>(WrappedComponent: NextPage<P>): NextPage<P> {
//   const ProtectedRoute: NextPage<P> = (props) => {
//     const router = useRouter();

//     useEffect(() => {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         router.push('/signin');
//       }
//     }, []);

//     return <WrappedComponent {...props} />;
//   };

//   // Copy getInitialProps from WrappedComponent if it exists
//   if ((WrappedComponent as any).getInitialProps) {
//     ProtectedRoute.getInitialProps = (WrappedComponent as any).getInitialProps;
//   }

//   return ProtectedRoute;
// }

// 'use client';

// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';

// export function withAuthProtection<P extends object>(WrappedComponent: React.ComponentType<P>) {
//     return function ProtectedRoute(props: P) {
//         const router = useRouter();

//         useEffect(() => {
//             const token = localStorage.getItem('token');
//             if (!token) {
//                 router.push('/signin');
//             }
//         }, [router]);

//         return <WrappedComponent {...props} />;
//     };
// }

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function withAuthProtection<P extends object>(WrappedComponent: React.ComponentType<P>) {
    return function ProtectedRoute(props: P) {
        const router = useRouter();

        useEffect(() => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/signin');
                return; // Exit if no token found
            }

            // Set a timeout to automatically logout after 1 minute
            const timeoutId = setTimeout(() => {
                localStorage.removeItem('token'); // Clear the token
                router.push('/signin'); // Redirect to sign-in page
                // },3 * 60 * 1000); // 60 seconds
            }, 30 * 60 * 1000); // 3 minutes (3 * 60 seconds)

            // Cleanup function to clear the timeout if the component unmounts
            return () => clearTimeout(timeoutId);
        }, [router]);

        return <WrappedComponent {...props} />;
    };
}
