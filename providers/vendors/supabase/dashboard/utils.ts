/**
 * Utility functions for Supabase dashboard provider.
 * Handles data transformation and formatting.
 */

import type {
  Appointment,
  AppointmentStatus,
} from '@/providers/domain/dashboard';

/**
 * Transforms raw database appointment data to the Appointment interface.
 * @param raw Raw appointment data from Supabase
 * @returns Transformed Appointment object
 */
export function mapAppointment(raw: any): Appointment {
  return {
    id: raw.id,
    patientId: raw.patient_id,
    doctorId: raw.doctor_id,
    scheduledAt: raw.scheduled_at,
    durationMins: raw.duration_mins,
    status: raw.status as AppointmentStatus,
    serviceType: raw.service_type,
    notes: raw.notes,
    patient: {
      id: raw.patient_id,
      name: raw.patients?.full_name || 'Unknown Patient',
    },
    doctor: {
      id: raw.doctor_id,
      name: raw.profiles?.full_name || 'Unknown Doctor',
    },
    // Computed display fields
    time: formatAppointmentTime(raw.scheduled_at),
    duration: `${raw.duration_mins}m`,
    type: raw.service_type,
  };
}

/**
 * Formats appointment time for display.
 * @param scheduledAt ISO string from database
 * @returns Formatted time string (e.g., "09:00 AM")
 */
export function formatAppointmentTime(scheduledAt: string): string {
  return new Date(scheduledAt).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}
