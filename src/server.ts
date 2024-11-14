import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

const mongoURI = 'mongodb+srv://Aleuser:user123@ordenes-servicio.bw4iv.mongodb.net/?retryWrites=true&w=majority&appName=Ordenes-Servicio';

// Configuración de CORS actualizada
const allowedOrigins = [
  'https://app-ordenes-frontend.onrender.com',
  'http://localhost:5173',
  'http://localhost:3000',
  'https://app-ordenes-backend.onrender.com'
];

app.use(cors({
  origin: function(origin, callback) {
    // Permitir solicitudes sin origen (como las herramientas de desarrollo)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true
}));

// El resto de tu código del servidor permanece igual...

app.use(bodyParser.json());

// Ruta de health check
app.get('/health', async (req: Request, res: Response) => {
  res.send({ 
    message: "Servidor OK",
    dbStatus: mongoose.connection.readyState
  });
});
// Conexión a MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch((error: any) => console.error('Error de conexión a MongoDB:', error));


const orderSchema = new mongoose.Schema({
  brand: String,
  model: String,
  repairType: String,
  cost: Number,
  customerName: String,
  customerPhone: String,
  customerAddress: String,
  status: { type: String, default: 'En proceso' }
});

const Order = mongoose.model('Order', orderSchema);

app.use(cors());
app.use(bodyParser.json());


// Ruta para crear una nueva orden
app.post('/api/orders', async (req: Request, res: Response) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear la orden' });
  }
});
//////////////////////////////////////////////////////////////////////////
// Ruta para obtener una orden específica por ID
// Ruta para obtener una orden específica por ID
// Ruta para obtener una orden específica por ID
// Ruta para obtener una orden específica por ID
app.get('/api/orders/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID de orden inválido' });
    }

    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    const idSlice = order._id.toString().slice(-4);
    res.json({ ...order.toObject(), idSlice });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la orden' });
  }
});
////////////////////////////////////////////////////////////////////////7
// Ruta para obtener todas las órdenes
app.get('/api/orders', async (req: Request, res: Response) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las órdenes' });
  }
});



// Ruta para actualizar una orden
app.put('/api/orders/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedOrder = await Order.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar la orden' });
  }
});

// Ruta para eliminar una orden
app.delete('/api/orders/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Order.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la orden' });
  }
});
// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
