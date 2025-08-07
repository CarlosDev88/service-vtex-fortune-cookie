import parser from 'co-body'

export async function createCookieFortune(
  ctx: Context,
  next: () => Promise<unknown>
) {
  const {
    clients: { masterdata },
  } = ctx

  const data = await parser(ctx.req)

  // Creamos un nuevo documento en la data entity 'CF'
  await masterdata.createDocument({
    dataEntity: 'CF',
    fields: {
      CookieFortune: data.CookieFortune, // Asegúrate que esto venga en el body
    },
    schema: 'default', // Asegúrate que el schema tenga ese nombre en tu Master Data v2
  })

  ctx.status = 201
  ctx.body = {
    message: 'Galleta de la fortuna creada con éxito',
    ok: true,
  }

  await next()
}
