import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  repairType: { type: String, required: true },
  cost: { type: Number, required: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerAddress: { type: String, required: true },
  status: { type: String, default: 'en proceso' }, // Estado: 'en proceso', 'terminado', 'no terminado'
  orderNumber: { type: String, unique: true, required: true } // Nuevo campo
});
const appointmentSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  appointmentDate: { type: String, required: true },
  appointmentTime: { type: String, required: true },
  service: { type: String, required: true },
  status: { type: String, default: 'Programada' }
});
