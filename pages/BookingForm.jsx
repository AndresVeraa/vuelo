import { useAuth } from '../src/context/AuthContext.jsx';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../src/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { MapPin, Calendar, Clock, Users, Luggage, Phone, Edit } from 'lucide-react';

export default function BookingForm() {
  const { user, userData } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    pickupDate: '',
    pickupTime: '',
    passengers: 1,
    luggage: 1,
    userPhone: userData?.phone || '',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  const today = new Date()
    .toISOString()
    .split('T')[0];

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]:
        type === 'number' ? (value === '' ? 0 : Number(value)) : value,
    }));
    // Clear error for this field on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.pickupLocation.trim()) {
      newErrors.pickupLocation = 'El origen es requerido';
    }
    if (!formData.dropoffLocation.trim()) {
      newErrors.dropoffLocation = 'El destino es requerido';
    }
    if (!formData.pickupDate) {
      newErrors.pickupDate = 'La fecha es requerida';
    } else if (formData.pickupDate < today) {
      newErrors.pickupDate = 'La fecha no puede ser anterior a hoy';
    }
    if (!formData.pickupTime) {
      newErrors.pickupTime = 'La hora es requerida';
    }
    const phoneRegex = /^\d{9,}$/;
    if (!formData.userPhone.trim()) {
      newErrors.userPhone = 'El teléfono de contacto es requerido';
    } else if (!phoneRegex.test(formData.userPhone.replace(/\s/g, ''))) {
      newErrors.userPhone = 'Ingrese un teléfono válido (mínimo 9 dígitos)';
    }
    if (formData.passengers < 1 || formData.passengers > 8) {
      newErrors.passengers = 'El número de pasajeros debe estar entre 1 y 8';
    }
    if (formData.luggage < 0 || formData.luggage > 10) {
      newErrors.luggage = 'El número de maletas debe estar entre 0 y 10';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setIsSubmitting(true);
    try {
      const docRef = await addDoc(collection(db, 'bookings'), {
        userId: user.uid,
        userName: userData?.name || user.email?.split('@')[0] || 'Usuario',
        userPhone: formData.userPhone,
        pickupLocation: formData.pickupLocation,
        dropoffLocation: formData.dropoffLocation,
        pickupDate: formData.pickupDate,
        pickupTime: formData.pickupTime,
        passengers: formData.passengers,
        luggage: formData.luggage,
        notes: formData.notes,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      setBookingId(docRef.id);
      setSubmitSuccess(true);
    } catch (error) {
      console.error('Error adding document: ', error);
      // TODO: show error to user
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess && bookingId) {
    // Redirect to confirmation page with booking id
    navigate(`/reserva-confirmada?id=${bookingId}`, { replace: true });
    return null; // Prevent rendering form while navigating
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <section className="w-full max-w-md space-y-8">
        <div className="text-center">
          <p className="text-sm font-semibold tracking-widest text-gray-500 uppercase">
            Reserva de traslado
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Solicita tu traslado
          </h1>
          <p className="mt-4 text-base text-gray-600">
            Completa los datos de tu viaje y nosotros nos encargamos del resto.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Origin/Destination Group */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2 relative">
              <label className="block text-sm font-medium text-gray-700">Origen</label>
              <div className="flex items-center pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                <MapPin className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                name="pickupLocation"
                placeholder="Ej: Aeropuerto Madrid-Barajas, Terminal 4"
                value={formData.pickupLocation}
                onChange={handleChange}
                className={`
                  block w-full rounded-lg border border-gray-300
                  pl-10 px-4 py-2.5 text-sm focus:ring-2 focus:ring-[var(--primary)]
                  focus:border-[var(--primary)] transition-all duration-200
                  ${errors.pickupLocation ? 'border-red-500 focus:ring-red-500' : ''}
                `}
              />
              {errors.pickupLocation && (
                <p className="mt-1 text-sm text-red-600">{errors.pickupLocation}</p>
              )}
            </div>

            <div className="space-y-2 relative">
              <label className="block text-sm font-medium text-gray-700">Destino</label>
              <div className="flex items-center pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                <MapPin className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                name="dropoffLocation"
                placeholder="Ej: Hotel Ritz, Madrid"
                value={formData.dropoffLocation}
                onChange={handleChange}
                className={`
                  block w-full rounded-lg border border-gray-300
                  pl-10 px-4 py-2.5 text-sm focus:ring-2 focus:ring-[var(--primary)]
                  focus:border-[var(--primary)] transition-all duration-200
                  ${errors.dropoffLocation ? 'border-red-500 focus:ring-red-500' : ''}
                `}
              />
              {errors.dropoffLocation && (
                <p className="mt-1 text-sm text-red-600">{errors.dropoffLocation}</p>
              )}
            </div>
          </div>

          {/* Date/Time Group */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2 relative">
              <label className="block text-sm font-medium text-gray-700">Fecha</label>
              <div className="flex items-center pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                <Calendar className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="date"
                name="pickupDate"
                min={today}
                value={formData.pickupDate}
                onChange={handleChange}
                className={`
                  block w-full rounded-lg border border-gray-300
                  pl-10 px-4 py-2.5 text-sm focus:ring-2 focus:ring-[var(--primary)]
                  focus:border-[var(--primary)] transition-all duration-200
                  ${errors.pickupDate ? 'border-red-500 focus:ring-red-500' : ''}
                `}
              />
              {errors.pickupDate && (
                <p className="mt-1 text-sm text-red-600">{errors.pickupDate}</p>
              )}
            </div>

            <div className="space-y-2 relative">
              <label className="block text-sm font-medium text-gray-700">Hora</label>
              <div className="flex items-center pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                <Clock className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="time"
                name="pickupTime"
                value={formData.pickupTime}
                onChange={handleChange}
                className={`
                  block w-full rounded-lg border border-gray-300
                  pl-10 px-4 py-2.5 text-sm focus:ring-2 focus:ring-[var(--primary)]
                  focus:border-[var(--primary)] transition-all duration-200
                  ${errors.pickupTime ? 'border-red-500 focus:ring-red-500' : ''}
                `}
              />
              {errors.pickupTime && (
                <p className="mt-1 text-sm text-red-600">{errors.pickupTime}</p>
              )}
            </div>
          </div>

          {/* Passengers/Luggage Group */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2 relative">
              <label className="block text-sm font-medium text-gray-700">Pasajeros</label>
              <div className="flex items-center pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                <Users className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="number"
                name="passengers"
                min="1"
                max="8"
                value={formData.passengers}
                onChange={handleChange}
                className={`
                  block w-full rounded-lg border border-gray-300
                  pl-10 px-4 py-2.5 text-sm focus:ring-2 focus:ring-[var(--primary)]
                  focus:border-[var(--primary)] transition-all duration-200
                  ${errors.passengers ? 'border-red-500 focus:ring-red-500' : ''}
                `}
              />
              {errors.passengers && (
                <p className="mt-1 text-sm text-red-600">{errors.passengers}</p>
              )}
            </div>

            <div className="space-y-2 relative">
              <label className="block text-sm font-medium text-gray-700">Maletas</label>
              <div className="flex items-center pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                <Luggage className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="number"
                name="luggage"
                min="0"
                max="10"
                value={formData.luggage}
                onChange={handleChange}
                className={`
                  block w-full rounded-lg border border-gray-300
                  pl-10 px-4 py-2.5 text-sm focus:ring-2 focus:ring-[var(--primary)]
                  focus:border-[var(--primary)] transition-all duration-200
                  ${errors.luggage ? 'border-red-500 focus:ring-red-500' : ''}
                `}
              />
              {errors.luggage && (
                <p className="mt-1 text-sm text-red-600">{errors.luggage}</p>
              )}
            </div>
          </div>

          {/* Phone Field */}
          <div className="space-y-2 relative">
            <label className="block text-sm font-medium text-gray-700">Teléfono de contacto</label>
            <div className="flex items-center pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
              <Phone className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="tel"
              name="userPhone"
              placeholder="Ej: 600000000"
              value={formData.userPhone}
              onChange={handleChange}
              className={`
                block w-full rounded-lg border border-gray-300
                pl-10 px-4 py-2.5 text-sm focus:ring-2 focus:ring-[var(--primary)]
                focus:border-[var(--primary)] transition-all duration-200
                ${errors.userPhone ? 'border-red-500 focus:ring-red-500' : ''}
              `}
            />
            {errors.userPhone && (
              <p className="mt-1 text-sm text-red-600">{errors.userPhone}</p>
            )}
          </div>

          {/* Notes Field */}
          <div className="space-y-2 relative">
            <label className="block text-sm font-medium text-gray-700">Notas adicionales (opcional)</label>
            <div className="flex items-center pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
              <Edit className="h-4 w-4 text-gray-400" />
            </div>
            <textarea
              name="notes"
              placeholder="Instrucciones adicionales, ej: Necesito silla de bebé"
              value={formData.notes}
              onChange={handleChange}
              className={`
                block w-full rounded-lg border border-gray-300
                pl-10 px-4 py-2.5 text-sm focus:ring-2 focus:ring-[var(--primary)]
                focus:border-[var(--primary)] transition-all duration-200 resize-y
                min-h-[80px]
              `}
              rows={4}
            />
          </div>

          {/* Submit Button */}
          <div className="space-y-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                w-full flex justify-center items-center px-6 py-3 text-base font-medium
                transition-all duration-200 rounded-lg border border-transparent
                bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] focus:outline-none
                focus:ring-2 focus-ring-offset-2 focus-ring-[var(--primary)]
                disabled:opacity-50 disabled:cursor-not-allowed
                transform hover:scale-[1.02] active:scale-[0.98]
              `}
            >
              {isSubmitting ? (
                <>
                  Confirmando...
                  <svg className="ml-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                </>
              ) : (
                'Confirmar reserva'
              )}
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-gray-500">
          Tus datos están seguros. Solo utilizaremos tu teléfono para coordinar el traslado.
        </div>
      </section>
    </main>
  );
}