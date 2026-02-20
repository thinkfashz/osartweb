import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, concat, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { supabase } from './supabase-auth';

const httpUri = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3001/graphql';
const wsUri = httpUri.replace(/^http/, 'ws');

const httpLink = new HttpLink({
    uri: httpUri,
});

const wsLink = typeof window !== 'undefined' ? new GraphQLWsLink(
    createClient({
        url: wsUri,
        connectionParams: async () => {
            const { data: { session } } = await supabase.auth.getSession();
            return {
                authorization: session?.access_token ? `Bearer ${session.access_token}` : '',
            };
        },
    })
) : null;

const authLink = setContext(async (_, { headers }) => {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        if (token) {
            return {
                headers: {
                    ...headers,
                    authorization: `Bearer ${token}`,
                },
            };
        }
        return { headers };
    } catch (e) {
        console.error('[Apollo] Auth Error:', e);
        return { headers };
    }
});

const splitLink = typeof window !== 'undefined' && wsLink
    ? split(
        ({ query }) => {
            const definition = getMainDefinition(query);
            return (
                definition.kind === 'OperationDefinition' &&
                definition.operation === 'subscription'
            );
        },
        wsLink,
        authLink.concat(httpLink)
    )
    : authLink.concat(httpLink);

const client = new ApolloClient({
    link: splitLink,
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
