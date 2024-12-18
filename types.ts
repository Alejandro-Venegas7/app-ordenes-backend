// types.ts

export interface Order {
    _id: string; // Asumiendo que cada orden tiene un ID único
    brand: string;
    model: string;
    repairType: string;
    cost: number;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    status: 'en proceso' | 'terminado' | 'no terminado'; // Tipo de status con opciones específicas
}
// types.ts
// ... otros tipos existentes ...

export interface Appointment {
    _id?: string;
    customerName: string;
    customerPhone: string;
    appointmentDate: string;
    appointmentTime: string;
    service: string;
    status: 'Programada' | 'Confirmada' | 'Cancelada';
  }