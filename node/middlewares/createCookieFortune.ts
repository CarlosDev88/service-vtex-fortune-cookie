import parser from 'co-body'

export async function createCookieFortune(
  ctx: Context,
  next: () => Promise<unknown>
) {
  const {
    clients: { masterdata },
  } = ctx

  const data = await parser(ctx.req)

  const result = await masterdata.createDocument({
    dataEntity: 'CF',
    fields: {
      CookieFortune: data.CookieFortune,
    },
    schema: 'default',
  })

  ctx.status = 201
  ctx.body = {
    message: 'Galleta de la fortuna creada con éxito',
    ok: true,
    id: result.DocumentId,
    CookieFortune: data.CookieFortune,
  }

  await next()
}
