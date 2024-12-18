import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 4000;

const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://Aleuser:user123@ordenes-servicio.bw4iv.mongodb.net/?retryWrites=true&w=majority&appName=Ordenes-Servicio';

// Configuración de CORS
const allowedOrigins = [
  'https://app-ordenes-frontend.onrender.com',
  'http://localhost:5173',
  'http://localhost:3000',
  'https://app-ordenes-backend.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);  // Permitir solicitudes sin origen (como las herramientas de desarrollo)
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true
}));

app.use(bodyParser.json());

// Conexión a MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch((error) => console.error('Error de conexión a MongoDB:', error));

// Esquema y modelo para Órdenes
const orderSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  repairType: { type: String, required: true },
  cost: { type: Number, required: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerAddress: { type: String, required: true },
  status: { type: String, default: 'En proceso' },
  orderNumber: { type: String, unique: true }
});

const Order = mongoose.model('Order', orderSchema);

// Esquema y modelo para Citas
const appointmentSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  appointmentDate: { type: String, required: true },
  appointmentTime: { type: String, required: true },
  service: { type: String, required: true },
  status: { type: String, default: 'Programada' }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

// Ruta de health check
app.get('/health', (req: Request, res: Response) => {
  res.send({
    message: "Servidor OK",
    dbStatus: mongoose.connection.readyState
  });
});

// Rutas para Órdenes
app.post('/api/orders', async (req: Request, res: Response) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error al crear la orden:', error);
    res.status(400).json({ error: 'Error al crear la orden', details: error });
  }
});

app.get('/api/orders', async (req: Request, res: Response) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    console.error('Error al obtener órdenes:', error);
    res.status(500).json({ error: 'Error al obtener las órdenes' });
  }
});
/////////////////////////////////////////
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

////////////////////////////////////////
app.put('/api/orders/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedOrder = await Order.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedOrder);
  } catch (error) {
    console.error('Error al actualizar orden:', error);
    res.status(400).json({ error: 'Error al actualizar la orden' });
  }
});

//Nuevo comentario
app.delete('/api/orders/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Order.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar orden:', error);
    res.status(500).json({ error: 'Error al eliminar la orden' });
  }
});

// Rutas para Citas
app.post('/api/appointments', async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerName, customerPhone, appointmentDate, appointmentTime, service } = req.body;

    // Validación de campos
    if (!customerName || !customerPhone || !appointmentDate || !appointmentTime || !service) {
      console.log('Datos faltantes en la solicitud:', req.body);
      res.status(400).json({ error: 'Todos los campos son obligatorios' });
      return;
    }

    console.log('Datos recibidos:', req.body);

    const newAppointment = new Appointment({
      customerName,
      customerPhone,
      appointmentDate,
      appointmentTime,
      service,
      status: 'Programada'
    });

    const savedAppointment = await newAppointment.save();
    res.status(201).json(savedAppointment);
  } catch (error) {
    console.error('Error al crear la cita:', error);
    res.status(500).json({
      error: 'Error interno del servidor al crear la cita',
      details: error instanceof Error ? error.message : error
    });
  }
});


app.get('/api/appointments', async (req: Request, res: Response) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (error) {
    console.error('Error al obtener citas:', error);
    res.status(500).json({ error: 'Error al obtener las citas' });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
