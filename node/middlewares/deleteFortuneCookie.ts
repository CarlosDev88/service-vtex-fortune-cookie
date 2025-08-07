export async function deleteFortuneCookie(
  ctx: Context,
  next: () => Promise<void>
) {
  const {
    clients: { masterdata },
  } = ctx

  const rawId = ctx.vtex.route.params.id
  const idParam = Array.isArray(rawId) ? rawId[0] : rawId

  if (!idParam) {
    ctx.status = 400
    ctx.body = { error: 'ID is required' }
    return
  }

  try {
    await masterdata.deleteDocument({
      dataEntity: 'CF',
      id: idParam,
    })

    ctx.status = 200
    ctx.body = {
      message: `Record with ID ${idParam} deleted successfully`,
    }
  } catch (error) {
    ctx.status = 500
    ctx.body = {
      error: 'Failed to delete record',
      details: error.message,
    }
  }

  await next()
}
