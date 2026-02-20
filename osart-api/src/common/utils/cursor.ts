export interface ProductCursor {
    createdAt: string;
    id: string;
}

export function encodeCursor(data: ProductCursor): string {
    return Buffer.from(JSON.stringify(data)).toString('base64');
}

export function decodeCursor(cursor: string): ProductCursor | null {
    try {
        const decoded = Buffer.from(cursor, 'base64').toString('utf-8');
        return JSON.parse(decoded) as ProductCursor;
    } catch (e) {
        return null;
    }
}
