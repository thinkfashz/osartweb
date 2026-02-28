import { NextRequest, NextResponse } from 'next/server';

// Actual Backend URL
const BACKEND_GRAPHQL_URL = 'https://osartweb-ltg8-git-main-think-fastzs-projects.vercel.app/graphql';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const headers = new Headers(req.headers);

        // Clean up headers that might cause issues in proxying
        headers.delete('host');
        headers.delete('connection');
        headers.delete('content-length');

        const response = await fetch(BACKEND_GRAPHQL_URL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body),
        });

        const data = await response.json();
        return NextResponse.json(data, {
            status: response.status,
            headers: {
                'Cache-Control': 'no-store, max-age=0',
            }
        });
    } catch (error: any) {
        console.error('[GraphQL Proxy Error]:', error);
        return NextResponse.json(
            { errors: [{ message: `Proxy Error: ${error.message}` }] },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    // Allow GET for Playground or Schema introspection
    try {
        const response = await fetch(BACKEND_GRAPHQL_URL);
        const contentType = response.headers.get('content-type') || 'text/html';
        const data = await response.text();

        return new NextResponse(data, {
            status: response.status,
            headers: { 'Content-Type': contentType }
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
