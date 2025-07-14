import * as H5AuthActions from '@/app/actions/h5_auth_actions';

export async function POST(request: Request, { params }: { params: Promise<{ action: string }> }) {
  const { action } = await params;
  const data = await request.json();

  if (H5AuthActions[action]) {
    const res = await H5AuthActions[action](data);
    return Response.json(res);
  }

  return new Response(JSON.stringify({ error: 'Unknown action' }), { status: 400 });
}
