// Modifica la ruta /crear-preferencia
app.post('/crear-preferencia', async (req, res) => {
  if (!req.body || typeof req.body.servicio !== 'string') {
    return res.status(400).json({ 
      error: 'Datos inválidos',
      details: 'Se requiere un objeto con propiedad "servicio"'
    });
  }

  try {
    const { servicio } = req.body;
    const datos = servicios[servicio];

    if (!datos) {
      return res.status(400).json({ 
        error: 'Servicio inválido',
        availableServices: Object.keys(servicios)
      });
    }

    // Verificar que las URLs de retorno estén configuradas
    if (!process.env.FRONTEND_URL) {
      console.warn('FRONTEND_URL no está configurado, usando localhost');
    }

    const requestData = {
      items: [
        {
          title: datos.title,
          quantity: 1,
          unit_price: datos.unit_price,
          currency_id: 'ARS' // Asegurar la moneda
        }
      ],
      back_urls: {
        success: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/pago-exitoso`,
        failure: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/pago-fallido`,
        pending: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/pago-pendiente`
      },
      auto_return: 'approved'
    };

    console.log('Enviando a MercadoPago:', requestData);
    
    const result = await preferenceClient.create({ body: requestData });
    
    console.log('Respuesta de MercadoPago:', result);

    res.status(200).json({ 
      id: result.id,
      init_point: result.init_point // Útil para debug
    });

  } catch (error) {
    console.error('Error detallado al crear preferencia:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });
    
    res.status(500).json({ 
      error: 'Error al generar la preferencia',
      details: error.message,
      code: error.code
    });
  }
});