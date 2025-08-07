export async function randomFortune(ctx: Context, next: () => Promise<void>) {
  const {
    clients: { masterdata },
  } = ctx

  try {
    // Función para generar número aleatorio con formato XX-XX XXXX
    const generateRandomNumber = (): string => {
      const getRandomTwoDigits = () => Math.floor(Math.random() * 90) + 10 // 10-99
      const getRandomFourDigits = () => Math.floor(Math.random() * 9000) + 1000 // 1000-9999

      const part1 = getRandomTwoDigits()
      const part2 = getRandomTwoDigits()
      const part3 = getRandomFourDigits()

      return `${part1}-${part2} ${part3}`
    }

    // Obtener todos los registros disponibles
    const CF: Array<Record<string, unknown>> = await masterdata.searchDocuments(
      {
        dataEntity: 'CF',
        fields: ['CookieFortune'],
        pagination: {
          page: 1,
          pageSize: 1000, // Aumentamos para obtener todos los registros
        },
      }
    )

    // Verificar si hay registros disponibles
    if (!CF || CF.length === 0) {
      ctx.status = 404
      ctx.body = {
        error: 'No hay mensajes de fortuna disponibles',
        success: false,
      }
      await next()

      return
    }

    // Seleccionar un registro aleatorio
    const randomIndex = Math.floor(Math.random() * CF.length)
    const selectedFortune = CF[randomIndex]

    // Verificar que el mensaje existe y no está vacío
    const fortuneMessage = selectedFortune.CookieFortune as string

    if (!fortuneMessage || fortuneMessage.trim() === '') {
      ctx.status = 500
      ctx.body = {
        error: 'El mensaje de fortuna seleccionado está vacío',
        success: false,
      }
      await next()

      return
    }

    // Si todo está bien, generar el número aleatorio y devolver la respuesta
    const randomNumber = generateRandomNumber()

    ctx.status = 200
    ctx.body = {
      data: {
        message: fortuneMessage.trim(),
        number: randomNumber,
        success: true,
      },
    }
  } catch (error) {
    // En caso de error de conexión o cualquier otro problema
    ctx.status = 500
    ctx.body = {
      error: 'Error al conectar con Master Data o procesando la solicitud',
      details: error instanceof Error ? error.message : 'Error desconocido',
      success: false,
    }
  }

  await next()
}
