import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        ok: true,
        timestamp: new Date().toISOString(),
        service: 'osart-unified-api',
        environment: process.env.NODE_ENV
    });
}
