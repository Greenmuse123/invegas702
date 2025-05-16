import { NextRequest, NextResponse } from 'next/server';

// Replace this with your real integration (e.g., Mailchimp, ConvertKit, Supabase, DB, etc.)
async function saveEmailToNewsletter(email: string) {
  // Example: just log to server, or extend to call your newsletter provider
  console.log('Newsletter signup:', email);
  // Simulate success
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== 'string' || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }
    // Save to newsletter provider or database
    const ok = await saveEmailToNewsletter(email);
    if (!ok) throw new Error('Failed to save newsletter signup');
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error.' }, { status: 500 });
  }
}
