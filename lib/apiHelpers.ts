export function withErrorHandler(
  handler: (req: Request) => Promise<Response>
) {
  return async (req: Request): Promise<Response> => {
    try {
      return await handler(req)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Internal server error'
      console.error('[API Error]', message)
      return Response.json({ error: message }, { status: 500 })
    }
  }
}
