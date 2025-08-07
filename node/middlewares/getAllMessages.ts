export async function getAllMessages(ctx: Context, next: () => Promise<void>) {
  const {
    clients: { masterdata },
  } = ctx

  const CF: Array<Record<string, unknown>> = await masterdata.searchDocuments({
    dataEntity: 'CF',
    fields: ['id', 'CookieFortune'],
    pagination: {
      page: 1,
      pageSize: 100,
    },
  })

  ctx.status = 200
  ctx.body = {
    data: { ok: CF },
  }
  await next()
}
