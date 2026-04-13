import { NextRequest, NextResponse } from 'next/server';

/**
 * Stripe – create a PaymentIntent
 * Docs: https://stripe.com/docs/api/payment_intents/create
 *
 * ENV vars required:
 *   STRIPE_SECRET_KEY  – sk_live_… or sk_test_…
 */
export async function POST(request: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeKey) {
    return NextResponse.json(
      { error: 'Stripe no configurado. Agrega STRIPE_SECRET_KEY a tus variables de entorno.' },
      { status: 501 }
    );
  }

  try {
    const body = await request.json();
    const { amount, currency = 'clp', orderId, customerEmail } = body as {
      amount: number;
      currency?: string;
      orderId: string;
      customerEmail?: string;
    };

    if (!amount || !orderId) {
      return NextResponse.json({ error: 'Parámetros inválidos' }, { status: 400 });
    }

    // Stripe expects integer amounts (CLP has no decimals)
    const amountInt = Math.round(amount);

    const params = new URLSearchParams({
      amount: String(amountInt),
      currency: currency.toLowerCase(),
      'metadata[order_id]': orderId,
      'automatic_payment_methods[enabled]': 'true',
    });

    if (customerEmail) {
      params.append('receipt_email', customerEmail);
    }

    const stripeRes = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!stripeRes.ok) {
      const err = await stripeRes.json();
      console.error('[Stripe] error:', err);
      return NextResponse.json({ error: 'Error al crear intento de pago', detail: err?.error?.message }, { status: 500 });
    }

    const intent = await stripeRes.json();

    return NextResponse.json({
      clientSecret: intent.client_secret,
      paymentIntentId: intent.id,
    });
  } catch (err: any) {
    console.error('[Stripe] unexpected error:', err);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
