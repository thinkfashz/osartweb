import { NextRequest, NextResponse } from 'next/server';

// Actual Backend GraphQL endpoint
const BACKEND_GRAPHQL_URL = 'https://osartweb-ltg8-git-main-think-fastzs-projects.vercel.app/graphql';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const headers = new Headers(req.headers);

        // Clean up headers to avoid proxy loop and host mismatch
        headers.delete('host');
        headers.delete('connection');
        headers.delete('content-length');
        // Ensure the backend receives a clean content-type
        headers.set('content-type', 'application/json');

        console.log(`[GraphQL Proxy] Forwarding request to: ${BACKEND_GRAPHQL_URL}`);

        const response = await fetch(BACKEND_GRAPHQL_URL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body),
        });

        // If 401 or 404, capture and log the response text for debugging
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[GraphQL Proxy Error] Backend status ${response.status}: ${errorText.substring(0, 500)}`);
            return NextResponse.json(
                { errors: [{ message: `Backend error (${response.status})` }] },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('[GraphQL Proxy Critical Error]:', error);
        return NextResponse.json(
            { errors: [{ message: `Internal Proxy Error: ${error.message}` }] },
            { status: 500 }
        );
    }
}

// Support GET for Playground if needed
export async function GET(req: NextRequest) {
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
