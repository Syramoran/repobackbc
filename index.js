import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MercadoPagoConfig } from 'mercadopago';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}));

//MP
const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
})

// Base de datos local de servicios (seguridad)
const servicios = {
  '1': {
    title: 'Visita técnica',
    unit_price: 10000
  },
  '2': {
    title: 'Limpieza',
    unit_price: 50000
  },
  '3': {
    title: 'Instalación',
    unit_price: 200000
  }
};
if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
  throw new Error('Falta configurar MERCADOPAGO_ACCESS_TOKEN');
}

//ruta para crear preferencia
app.post('/crear-preferencia', async (req, res) => {
  if (!req.body || typeof req.body.servicio !== 'string') {
    return res.status(400).json({ error: 'Datos inválidos' });
  }
  try {
    const { servicio } = req.body;
    const datos = servicios[servicio];

    if (!datos) {
      return res.status(400).json({ error: 'Servicio inválido' });
    }

    const preference = await mpClient.preference.create({
      body: {
        items: [
          {
            title: datos.title,
            quantity: 1,
            unit_price: datos.unit_price
          }
        ],
        back_urls: {
          success: `${process.env.FRONTEND_URL}/pago-exitoso`,
          failure: `${process.env.FRONTEND_URL}/pago-fallido`,
          pending: `${process.env.FRONTEND_URL}/pago-pendiente`
        },
        auto_return: 'approved'
      }
    });

    res.status(200).json({ id: preference.id })

  } error: (err) => {
  console.error('Error al crear preferencia:', err);
  alert(`Error: ${err.status} - ${err.error?.error || 'Sin mensaje'}`);
}

});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
