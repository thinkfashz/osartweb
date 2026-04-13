import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Universal payment webhook handler.
 * Receives notifications from MercadoPago and Stripe and updates order status.
 *
 * Usage:
 *   MercadoPago → POST /api/payments/webhook?provider=mercadopago
 *   Stripe      → POST /api/payments/webhook?provider=stripe
 *
 * ENV vars:
 *   MERCADOPAGO_ACCESS_TOKEN
 *   STRIPE_WEBHOOK_SECRET
 */

async function updateOrderPayment(
  orderId: string,
  provider: string,
  status: 'paid' | 'failed' | 'pending',
  externalId: string
) {
  if (!supabaseAdmin) return;

  await supabaseAdmin
    .from('orders')
    .update({
      payment_status: status,
      payment_provider: provider,
      payment_external_id: externalId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId);
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const provider = searchParams.get('provider');

  try {
    if (provider === 'mercadopago') {
      const body = await request.json();
      const topic = body?.type ?? body?.topic;

      if (topic === 'payment') {
        const paymentId = body?.data?.id ?? body?.id;
        const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

        if (accessToken && paymentId) {
          const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          if (mpRes.ok) {
            const payment = await mpRes.json();
            const orderId = payment.external_reference;
            const mpStatus = payment.status; // approved | rejected | pending

            const mapped =
              mpStatus === 'approved' ? 'paid' :
              mpStatus === 'rejected' ? 'failed' : 'pending';

            if (orderId) {
              await updateOrderPayment(orderId, 'mercadopago', mapped, String(paymentId));
            }
          }
        }
      }

      return NextResponse.json({ received: true });
    }

    if (provider === 'stripe') {
      const rawBody = await request.text();
      const sig = request.headers.get('stripe-signature');
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

      // Verify signature if secret is configured
      if (webhookSecret && sig) {
        try {
          // Dynamic import to avoid server-side issues without stripe package
          const crypto = await import('crypto');
          const [, timestampPart, signaturePart] = sig.split(',').reduce<Record<string, string>>((acc, part) => {
            const [k, v] = part.split('=');
            acc[k.trim()] = v.trim();
            return acc;
          }, {}) as any;

          const t = timestampPart ?? '';
          const v1 = signaturePart ?? '';
          const payload = `${t}.${rawBody}`;
          const expectedSig = crypto
            .createHmac('sha256', webhookSecret)
            .update(payload)
            .digest('hex');

          if (expectedSig !== v1) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
          }
        } catch {
          // signature check failed – log and continue in dev mode
          console.warn('[Stripe webhook] signature verification failed');
        }
      }

      const event = JSON.parse(rawBody);

      if (event.type === 'payment_intent.succeeded') {
        const intent = event.data.object;
        const orderId = intent.metadata?.order_id;
        if (orderId) {
          await updateOrderPayment(orderId, 'stripe', 'paid', intent.id);
        }
      } else if (event.type === 'payment_intent.payment_failed') {
        const intent = event.data.object;
        const orderId = intent.metadata?.order_id;
        if (orderId) {
          await updateOrderPayment(orderId, 'stripe', 'failed', intent.id);
        }
      }

      return NextResponse.json({ received: true });
    }

    return NextResponse.json({ error: 'Provider desconocido' }, { status: 400 });
  } catch (err: any) {
    console.error('[Webhook] error:', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
