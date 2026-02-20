import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, concat } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { supabase } from './supabase-auth';

const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3001/graphql',
});

const authLink = setContext(async (_, { headers }) => {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        if (!token) {
            console.warn('[Apollo] No se detectó sesión activa. Operando como Guest.');
        } else {
            console.log('[Apollo] Sesión detectada. Token inyectado.');
        }

        return {
            headers: {
                ...headers,
                authorization: token ? `Bearer ${token}` : '',
            },
        };
    } catch (e) {
        console.error('[Apollo] Error al obtener sesión de Supabase:', e);
        return { headers };
    }
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    products: {
                        merge(existing, incoming) {
                            return incoming;
                        },
                    },
                },
            },
        },
    }),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-and-network',
        },
    },
});

export default client;
