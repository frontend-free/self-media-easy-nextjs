import * as H5AuthActions from '@/app/actions/h5_auth_actions';

export async function POST(request: Request, { params }: { params: { action: string } }) {
  const data = await request.json();

  if (H5AuthActions[params.action]) {
    const res = await H5AuthActions[params.action](data);
    return Response.json(res);
  }

  return new Response(JSON.stringify({ error: 'Unknown action' }), { status: 400 });
}
