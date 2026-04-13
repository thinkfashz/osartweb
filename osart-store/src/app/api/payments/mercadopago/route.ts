import { NextRequest, NextResponse } from 'next/server';

/**
 * MercadoPago Checkout Pro – create a preference
 * Docs: https://www.mercadopago.cl/developers/es/reference/preferences
 *
 * ENV vars required:
 *   MERCADOPAGO_ACCESS_TOKEN  – your production/sandbox access token
 *   NEXT_PUBLIC_APP_URL       – public base URL (e.g. https://osart.cl)
 */
export async function POST(request: NextRequest) {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

  if (!accessToken) {
    return NextResponse.json(
      { error: 'MercadoPago no configurado. Agrega MERCADOPAGO_ACCESS_TOKEN a tus variables de entorno.' },
      { status: 501 }
    );
  }

  try {
    const body = await request.json();
    const { items, orderId, payerEmail } = body as {
      items: Array<{ title: string; quantity: number; unit_price: number; currency_id?: string }>;
      orderId: string;
      payerEmail?: string;
    };

    if (!items?.length || !orderId) {
      return NextResponse.json({ error: 'Parámetros inválidos' }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const preference = {
      items: items.map((item) => ({
        title: item.title,
        quantity: item.quantity,
        unit_price: item.unit_price,
        currency_id: item.currency_id ?? 'CLP',
      })),
      payer: payerEmail ? { email: payerEmail } : undefined,
      external_reference: orderId,
      back_urls: {
        success: `${appUrl}/checkout/success?orderId=${orderId}&provider=mercadopago`,
        failure: `${appUrl}/checkout?error=payment_failed`,
        pending: `${appUrl}/orders`,
      },
      auto_return: 'approved',
      notification_url: `${appUrl}/api/payments/webhook?provider=mercadopago`,
      statement_descriptor: 'OSART REPUESTOS',
    };

    const mpRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(preference),
    });

    if (!mpRes.ok) {
      const err = await mpRes.json();
      console.error('[MercadoPago] error:', err);
      return NextResponse.json({ error: 'Error al crear preferencia de pago', detail: err }, { status: 500 });
    }

    const mpData = await mpRes.json();

    return NextResponse.json({
      preferenceId: mpData.id,
      initPoint: mpData.init_point,       // production redirect URL
      sandboxInitPoint: mpData.sandbox_init_point,
    });
  } catch (err: any) {
    console.error('[MercadoPago] unexpected error:', err);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
