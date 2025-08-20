/* eslint-disable prefer-destructuring */
function decodeJwtPayload(token: string): any {
  const parts = token.split('.')

  if (parts.length !== 3) return null

  const payload = parts[1]
  const paddedPayload = payload + '='.repeat((4 - (payload.length % 4)) % 4)
  const decoded = Buffer.from(paddedPayload, 'base64').toString('utf8')

  return JSON.parse(decoded)
}

export async function vtexAuth(ctx: Context, next: () => Promise<void>) {
  const {
    request: { headers },
  } = ctx

  const cookieHeader = headers.cookie as string

  if (!cookieHeader) {
    ctx.status = 401
    ctx.body = { error: 'Requiere de autenticacion' }

    return
  }

  // Extraer VtexIdclientAutCookie
  const vtexTokenMatch = cookieHeader.match(/VtexIdclientAutCookie=([^;]+)/)

  if (!vtexTokenMatch) {
    ctx.status = 401
    ctx.body = { error: 'Token no encontrado' }

    return
  }

  try {
    // Decodificar JWT payload
    const payload = decodeJwtPayload(vtexTokenMatch[1])

    if (!payload) {
      ctx.status = 401
      ctx.body = { error: 'Secion no valida' }

      return
    }

    // Validar expiración
    const now = Math.floor(Date.now() / 1000)

    if (payload.exp <= now) {
      ctx.status = 401
      ctx.body = { error: 'Secion expirada' }

      return
    }

    // Continuar al siguiente middleware
    await next()
  } catch (error) {
    ctx.status = 401
    ctx.body = { error: 'Error validando token' }
  }
}
