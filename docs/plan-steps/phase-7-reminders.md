# 🔔 Phase 7 — Reminders

## Overview

Automated appointment reminder system using Supabase Edge Functions and Resend for email notifications.

## Steps

### 7.1 Edge Function Implementation

```typescript
// supabase/functions/send-reminders/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from 'https://esm.sh/resend';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);
const resend = new Resend(Deno.env.get('RESEND_API_KEY')!);

interface Appointment {
  id: string;
  scheduled_at: string;
  patients: {
    full_name: string;
    email?: string;
    phone?: string;
  };
  profiles: {
    full_name: string;
    email?: string;
  };
  service_type?: string;
  duration_mins: number;
}

Deno.serve(async () => {
  console.log('Starting reminder check...');

  const now = new Date();
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  try {
    // Get appointments in next 24 hours
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select(
        `
        *,
        patients(full_name, email, phone),
        profiles!appointments_doctor_id_fkey(full_name, email)
      `
      )
      .in('status', ['scheduled', 'confirmed'])
      .gte('scheduled_at', now.toISOString())
      .lte('scheduled_at', in24h.toISOString());

    if (error) {
      console.error('Error fetching appointments:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }

    console.log(`Found ${appointments?.length || 0} appointments to remind`);

    for (const appt of appointments || []) {
      await sendPatientReminder(appt);
      await sendDoctorReminder(appt);
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed: appointments?.length || 0,
      })
    );
  } catch (error) {
    console.error('Error in reminder function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
});

async function sendPatientReminder(appointment: Appointment) {
  if (!appointment.patients?.email) {
    console.log(`Patient ${appointment.patients.full_name} has no email`);
    return;
  }

  const appointmentTime = new Date(appointment.scheduled_at);
  const formattedTime = appointmentTime.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Appointment Reminder</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #0EA5E9; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px; }
        .appointment-details { background: white; padding: 15px; border-radius: 6px; margin: 15px 0; }
        .detail-row { display: flex; justify-content: space-between; margin: 8px 0; }
        .detail-label { font-weight: bold; color: #666; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Appointment Reminder</h1>
          <p>You have an appointment scheduled for tomorrow!</p>
        </div>
        <div class="content">
          <h2>Hello ${appointment.patients.full_name},</h2>
          <p>This is a friendly reminder about your upcoming appointment at our dental clinic.</p>
          
          <div class="appointment-details">
            <h3>Appointment Details</h3>
            <div class="detail-row">
              <span class="detail-label">Date & Time:</span>
              <span>${formattedTime}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Doctor:</span>
              <span>Dr. ${appointment.profiles.full_name}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Duration:</span>
              <span>${appointment.duration_mins} minutes</span>
            </div>
            ${
              appointment.service_type
                ? `
            <div class="detail-row">
              <span class="detail-label">Service:</span>
              <span>${appointment.service_type}</span>
            </div>
            `
                : ''
            }
          </div>
          
          <p><strong>Please arrive 10 minutes early</strong> to complete any necessary paperwork.</p>
          <p>If you need to reschedule or cancel, please call us at <strong>(555) 123-4567</strong>.</p>
        </div>
        <div class="footer">
          <p>Dental Clinic Management System</p>
          <p>123 Medical Drive, Health City, HC 12345</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: 'reminders@dental-clinic.com',
      to: appointment.patients.email,
      subject: 'Appointment Reminder - Dental Clinic',
      html: emailHtml,
    });

    if (error) {
      console.error(
        `Failed to send patient reminder for ${appointment.patients.email}:`,
        error
      );
      await logReminder(
        appointment.id,
        'email',
        'patient',
        'failed',
        error.message
      );
    } else {
      console.log(`Patient reminder sent to ${appointment.patients.email}`);
      await logReminder(appointment.id, 'email', 'patient', 'sent');
    }
  } catch (error) {
    console.error(`Error sending patient reminder:`, error);
    await logReminder(
      appointment.id,
      'email',
      'patient',
      'failed',
      error.message
    );
  }
}

async function sendDoctorReminder(appointment: Appointment) {
  if (!appointment.profiles?.email) {
    console.log(`Doctor ${appointment.profiles.full_name} has no email`);
    return;
  }

  const appointmentTime = new Date(appointment.scheduled_at);
  const formattedTime = appointmentTime.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Appointment Reminder</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #10B981; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px; }
        .appointment-details { background: white; padding: 15px; border-radius: 6px; margin: 15px 0; }
        .detail-row { display: flex; justify-content: space-between; margin: 8px 0; }
        .detail-label { font-weight: bold; color: #666; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Appointment Reminder</h1>
          <p>You have an appointment scheduled for tomorrow</p>
        </div>
        <div class="content">
          <h2>Dr. ${appointment.profiles.full_name},</h2>
          <p>This is a reminder about your upcoming appointment with ${appointment.patients.full_name}.</p>
          
          <div class="appointment-details">
            <h3>Appointment Details</h3>
            <div class="detail-row">
              <span class="detail-label">Date & Time:</span>
              <span>${formattedTime}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Patient:</span>
              <span>${appointment.patients.full_name}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Duration:</span>
              <span>${appointment.duration_mins} minutes</span>
            </div>
            ${
              appointment.service_type
                ? `
            <div class="detail-row">
              <span class="detail-label">Service:</span>
              <span>${appointment.service_type}</span>
            </div>
            `
                : ''
            }
            ${
              appointment.patients.phone
                ? `
            <div class="detail-row">
              <span class="detail-label">Patient Phone:</span>
              <span>${appointment.patients.phone}</span>
            </div>
            `
                : ''
            }
          </div>
          
          <p>Please review the patient's file before the appointment and prepare accordingly.</p>
        </div>
        <div class="footer">
          <p>Dental Clinic Management System</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: 'reminders@dental-clinic.com',
      to: appointment.profiles.email,
      subject: `Appointment Reminder - ${appointment.patients.full_name}`,
      html: emailHtml,
    });

    if (error) {
      console.error(
        `Failed to send doctor reminder for ${appointment.profiles.email}:`,
        error
      );
      await logReminder(
        appointment.id,
        'email',
        'doctor',
        'failed',
        error.message
      );
    } else {
      console.log(`Doctor reminder sent to ${appointment.profiles.email}`);
      await logReminder(appointment.id, 'email', 'doctor', 'sent');
    }
  } catch (error) {
    console.error(`Error sending doctor reminder:`, error);
    await logReminder(
      appointment.id,
      'email',
      'doctor',
      'failed',
      error.message
    );
  }
}

async function logReminder(
  appointmentId: string,
  channel: string,
  recipientType: string,
  status: string,
  errorMessage?: string
) {
  try {
    await supabase.from('reminder_logs').insert({
      appointment_id: appointmentId,
      channel: channel,
      recipient_type: recipientType,
      status: status,
      error_message: errorMessage || null,
      sent_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to log reminder:', error);
  }
}
```

### 7.2 Deploy Edge Function

```bash
# Deploy the function
supabase functions deploy send-reminders

# Set up cron schedule
supabase functions schedule send-reminders --cron="0 8 * * *"
```

### 7.3 Manual Trigger Component

```tsx
// components/admin/ReminderTester.tsx
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

export function ReminderTester() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const testReminders = async () => {
    setTesting(true);
    setResult(null);

    try {
      const response = await fetch('/api/admin/test-reminders', {
        method: 'POST',
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Reminder System</CardTitle>
        <CardDescription>
          Manually trigger the reminder system to test email delivery
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={testReminders} disabled={testing} className="w-full">
          {testing ? 'Testing...' : 'Send Test Reminders'}
        </Button>

        {result && (
          <div className="space-y-3">
            {result.success ? (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Test Successful</p>
                  <p className="text-sm text-green-600">
                    Processed {result.processed} appointments
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-800">Test Failed</p>
                  <p className="text-sm text-red-600">{result.error}</p>
                </div>
              </div>
            )}

            {result.details && (
              <div className="space-y-2">
                <h4 className="font-medium">Details:</h4>
                {result.details.map((detail: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 border rounded"
                  >
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">{detail.recipient}</span>
                    </div>
                    <Badge
                      variant={
                        detail.status === 'sent' ? 'default' : 'destructive'
                      }
                    >
                      {detail.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

### 7.4 API Route for Testing

```typescript
// app/api/admin/test-reminders/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Trigger the edge function
    const { data, error } = await supabase.functions.invoke('send-reminders');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

## Implementation Steps

### Edge Function Setup

- [ ] Create reminder Edge Function with email templates
- [ ] Implement patient and doctor reminder logic
- [ ] Add error handling and logging
- [ ] Deploy function to Supabase

### Scheduling & Automation

- [ ] Set up cron schedule for daily execution
- [ ] Configure timezone handling
- [ ] Add manual trigger functionality
- [ ] Implement reminder history tracking

### Email Templates

- [ ] Design professional email templates
- [ ] Add clinic branding and contact info
- [ ] Create responsive HTML emails
- [ ] Include appointment details and directions

## Deliverables

- Automated reminder system
- Professional email templates
- Error handling and logging
- Manual testing interface
- Cron-based scheduling

## Estimated Time

1 day
