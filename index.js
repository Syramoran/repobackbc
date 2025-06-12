import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MercadoPagoConfig, Preference } from 'mercadopago';

// Initialize environment variables
dotenv.config();

// Create Express application
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}));

// Validate required environment variables
if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
  throw new Error('Falta configurar MERCADOPAGO_ACCESS_TOKEN');
}

// Mercado Pago Configuration
const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
});
const preferenceClient = new Preference(mpClient);

// Mock database of services
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

// Create payment preference endpoint
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

    const result = await preferenceClient.create({
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

    res.status(200).json({ id: result.id });

  } catch (error) {
    console.error('Error al crear preferencia:', error);
    res.status(500).json({ 
      error: 'Error interno al generar la preferencia',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    message: 'Servidor de pagos funcionando'
  });
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

export default app; // For testing purposes