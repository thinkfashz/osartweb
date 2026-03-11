'use client';

import { ApolloProvider } from "@apollo/client/react";
import client from "@/lib/apollo-client";
import { AuthProvider } from "@/context/AuthContext";
import { StorefrontProvider } from "@/context/StorefrontContext";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ApolloProvider client={client}>
            <AuthProvider>
                <StorefrontProvider>
                    {children}
                </StorefrontProvider>
            </AuthProvider>
        </ApolloProvider>
    );
}
