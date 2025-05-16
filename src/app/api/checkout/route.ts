import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Accepts either { magazine, quantity } or { cart: [...] }
    let line_items = [];

    if (body.cart && Array.isArray(body.cart)) {
      line_items = body.cart.map((item: any) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${item.title}${item.issue_number ? ` (Issue #${item.issue_number})` : ''}`,
            images: item.image ? [item.image] : undefined,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity ?? 1,
      }));
      if (line_items.length === 0) {
        return NextResponse.json({ error: 'Cart is empty.' }, { status: 400 });
      }
    } else if (body.magazine && body.magazine.id && body.magazine.title && body.magazine.price) {
      line_items = [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${body.magazine.title} (Issue #${body.magazine.issue_number})`,
              images: body.magazine.image ? [body.magazine.image] : undefined,
            },
            unit_amount: Math.round(body.magazine.price * 100),
          },
          quantity: body.quantity ?? 1,
        },
      ];
    } else {
      return NextResponse.json({ error: 'Missing magazine or cart info.' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 499, currency: 'usd' },
            display_name: 'Standard Shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 5 },
              maximum: { unit: 'business_day', value: 10 },
            },
          },
        },
      ],
      success_url: `${req.nextUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.nextUrl.origin}/checkout/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe Checkout error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
