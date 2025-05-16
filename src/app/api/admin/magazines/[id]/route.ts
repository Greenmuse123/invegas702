import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies as nextCookies } from 'next/headers';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: {
      get: (key: string) => {
        const cookie = nextCookies().get(key);
        return cookie?.value ?? null;
      },
      set: () => {},
      remove: () => {},
    }}
  );

  const id = params.id;
  const body = await req.json();
  const { title, description, published_at, status } = body;

  const { error } = await supabase
    .from('magazines')
    .update({ title, description, published_at, status })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}
