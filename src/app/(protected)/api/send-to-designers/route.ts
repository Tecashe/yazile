export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const n8nResponse = await fetch(process.env.N8N_SEND_TO_DESIGNERS_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    if (!n8nResponse.ok) {
      throw new Error(`N8N failed: ${n8nResponse.statusText}`)
    }

    return Response.json(await n8nResponse.json())
  } catch (error) {
    return Response.json({ error: 'Failed to send' }, { status: 500 })
  }
}