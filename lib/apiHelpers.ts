// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withErrorHandler(handler: (req: Request, ctx?: any) => Promise<Response>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async (req: Request, ctx?: any): Promise<Response> => {
    try {
      return await handler(req, ctx)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Internal server error'
      console.error('[API Error]', message)
      return Response.json({ error: message }, { status: 500 })
    }
  }
}
