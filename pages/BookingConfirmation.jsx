import { useAuth } from '../src/context/AuthContext.jsx';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../src/firebase';

// TODO: reemplazar con el número real del negocio, formato internacional sin '+'
const BUSINESS_WHATSAPP_NUMBER = "34600000000"; // Ejemplo: España

export default function BookingConfirmation() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('id');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!bookingId) {
      setError('ID de reserva no proporcionado');
      setLoading(false);
      return;
    }

    const fetchBooking = async () => {
      try {
        const docRef = doc(db, 'bookings', bookingId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setBooking({
            id: bookingId,
            ...data,
            // Convert Firestore timestamp to date string if needed
            createdAt: data.createdAt?.toDate?.() || null,
          });
        } else {
          setError('Reserva no encontrada');
        }
      } catch (err) {
        console.error('Error fetching booking: ', err);
        setError('Error al cargar la reserva');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <section className="w-full max-w-md space-y-6">
          <div className="text-center">
            <p className="text-sm font-semibold tracking-widest text-gray-500 uppercase">
              Confirmación
            </p>
            <h1 className="mt-2 text-xl font-bold text-gray-900">
              Cargando reserva...
            </h1>
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <section className="w-full max-w-md space-y-6">
          <div className="text-center">
            <p className="text-sm font-semibold tracking-widest text-gray-500 uppercase">
              Error
            </p>
            <h1 className="mt-2 text-xl font-bold text-gray-900">
              Algo salió mal
            </h1>
            <p className="mt-4 text-base text-gray-600">{error}</p>
            <div className="mt-6">
              <a href="/" className="w-full inline-flex justify-center px-6 py-3 text-base font-medium
                transition-all duration-200 rounded-lg border border-gray-300
                bg-white text-gray-900 hover:bg-gray-50 focus:outline-none
                focus:ring-2 focus-ring-offset-2 focus-ring-gray-500
                transform hover:scale-[1.02] active:scale-[0.98]">
                Volver al inicio
              </a>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!booking) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <section className="w-full max-w-md space-y-6">
          <div className="text-center">
            <p className="text-sm font-semibold tracking-widest text-gray-500 uppercase">
              Confirmación
            </p>
            <h1 className="mt-2 text-xl font-bold text-gray-900">
              Reserva no encontrada
            </h1>
            <div className="mt-6">
              <a href="/" className="w-full inline-flex justify-center px-6 py-3 text-base font-medium
                transition-all duration-200 rounded-lg border border-gray-300
                bg-white text-gray-900 hover:bg-gray-50 focus:outline-none
                focus:ring-2 focus-ring-offset-2 focus-ring-gray-500
                transform hover:scale-[1.02] active:scale-[0.98]">
                Volver al inicio
              </a>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const formatDateTime = () => {
    const date = new Date(booking.pickupDate);
    const time = booking.pickupTime;
    return `${date.toLocaleDateString('es-ES')} a las ${time}`;
  };

  const handleWhatsAppClick = () => {
    const message = `Hola, quiero confirmar mi reserva de traslado:
📍 Origen: ${booking.pickupLocation}
📍 Destino: ${booking.dropoffLocation}
📅 Fecha: ${booking.pickupDate} a las ${booking.pickupTime}
👥 Pasajeros: ${booking.passengers}
🧳 Maletas: ${booking.luggage}
📞 Contacto: ${booking.userPhone}
📝 Notas: ${booking.notes || 'Sin notas adicionales'}

ID de reserva: ${booking.id}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <section className="w-full max-w-md space-y-8">
        <div className="text-center">
          <p className="text-sm font-semibold tracking-widest text-gray-500 uppercase">
            Reserva confirmada
          </p>
          <h1 className="mt-2 text-2xl font-bold text-gray-900">
            ¡Gracias por tu solicitud!
          </h1>
          <p className="mt-4 text-base text-gray-600">
            Tu solicitud de traslado fue registrada. Confírmala por WhatsApp para que la procesemos.
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <div className="space-y-3">
            <p className="flex items-start">
              <span className="flex-shrink-0 text-blue-600">📍</span>
              <span className="ml-3"><strong className="text-gray-700">Origen:</strong> <span className="ml-2 text-gray-900">{booking.pickupLocation}</span></span>
            </p>
            <p className="flex items-start">
              <span className="flex-shrink-0 text-blue-600">📍</span>
              <span className="ml-3"><strong className="text-gray-700">Destino:</strong> <span className="ml-2 text-gray-900">{booking.dropoffLocation}</span></span>
            </p>
            <p className="flex items-start">
              <span className="flex-shrink-0 text-blue-600">📅</span>
              <span className="ml-3"><strong className="text-gray-700">Fecha y hora:</strong> <span className="ml-2 text-gray-900">{formatDateTime()}</span></span>
            </p>
            <p className="flex items-start">
              <span className="flex-shrink-0 text-blue-600">👥</span>
              <span className="ml-3"><strong className="text-gray-700">Pasajeros:</strong> <span className="ml-2 text-gray-900">{booking.passengers}</span></span>
            </p>
            <p className="flex items-start">
              <span className="flex-shrink-0 text-blue-600">🧳</span>
              <span className="ml-3"><strong className="text-gray-700">Maletas:</strong> <span className="ml-2 text-gray-900">{booking.luggage}</span></span>
            </p>
            <p className="flex items-start">
              <span className="flex-shrink-0 text-blue-600">📞</span>
              <span className="ml-3"><strong className="text-gray-700">Teléfono de contacto:</strong> <span className="ml-2 text-gray-900">{booking.userPhone}</span></span>
            </p>
            {booking.notes && (
              <p className="flex items-start">
                <span className="flex-shrink-0 text-blue-600">📝</span>
                <span className="ml-3"><strong className="text-gray-700">Notas:</strong> <span className="ml-2 text-gray-900">{booking.notes}</span></span>
              </p>
            )}
          </div>
        </div>

        {/* WhatsApp Button */}
        <button
          onClick={handleWhatsAppClick}
          className="w-full flex justify-center items-center px-6 py-3 text-base font-medium
            transition-all duration-200 rounded-lg border border-transparent
            bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] focus:outline-none
            focus:ring-2 focus-ring-offset-2 focus-ring-[var(--primary)]
            transform hover:scale-[1.02] active:scale-[0.98]
            mt-4"
        >
          Confirmar por WhatsApp
        </button>

        {/* Back to Home Link */}
        <div className="mt-6">
          <a href="/" className="w-full inline-flex justify-center px-6 py-3 text-base font-medium
            transition-all duration-200 rounded-lg border border-gray-300
            bg-white text-gray-900 hover:bg-gray-50 focus:outline-none
            focus:ring-2 focus-ring-offset-2 focus-ring-gray-500
            transform hover:scale-[1.02] active:scale-[0.98]">
            Volver al inicio
          </a>
        </div>
      </section>
    </main>
  );
}