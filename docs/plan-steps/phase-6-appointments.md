# 📅 Phase 6 — Appointments

## Overview
Complete appointment management system with calendar view, booking interface, and conflict detection.

## Steps

### 6.1 Appointments List Page

```tsx
// app/[locale]/(dashboard)/appointments/page.tsx
'use client'
import { useState } from 'react'
import { AppointmentsList } from '@/components/appointments/AppointmentsList'
import { AppointmentsCalendar } from '@/components/appointments/AppointmentsCalendar'
import { Button } from '@/components/ui/button'
import { Plus, Filter } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'

export default function AppointmentsPage() {
  const [view, setView] = useState<'list' | 'calendar'>('list')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [doctorFilter, setDoctorFilter] = useState<string>('all')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Appointments</h1>
          <p className="text-muted-foreground">Manage clinic schedule and bookings</p>
        </div>
        <Link href="/appointments/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Book Appointment
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
          <CardDescription>
            Filter appointments by status and doctor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="no_show">No Show</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={doctorFilter} onValueChange={setDoctorFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by doctor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Doctors</SelectItem>
                <SelectItem value="dr-smith">Dr. Smith</SelectItem>
                <SelectItem value="dr-jones">Dr. Jones</SelectItem>
                <SelectItem value="dr-wilson">Dr. Wilson</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* View Toggle */}
      <Tabs value={view} onValueChange={(value) => setView(value as 'list' | 'calendar')}>
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-4">
          <AppointmentsList 
            statusFilter={statusFilter}
            doctorFilter={doctorFilter}
          />
        </TabsContent>
        
        <TabsContent value="calendar" className="space-y-4">
          <AppointmentsCalendar 
            statusFilter={statusFilter}
            doctorFilter={doctorFilter}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

### 6.2 Appointments List Component

```tsx
// components/appointments/AppointmentsList.tsx
'use client'
import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Calendar, Clock, User, Check, X, AlertCircle } from 'lucide-react'
import { format, formatDistanceToNow, isToday, isTomorrow, isYesterday } from 'date-fns'
import { getAppointments } from '@/lib/supabase/queries'
import type { Appointment } from '@/types'

interface AppointmentsListProps {
  statusFilter?: string
  doctorFilter?: string
}

export function AppointmentsList({ statusFilter = 'all', doctorFilter = 'all' }: AppointmentsListProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAppointments()
  }, [statusFilter, doctorFilter])

  const loadAppointments = async () => {
    try {
      setLoading(true)
      const filters: any = {}
      
      if (statusFilter !== 'all') {
        filters.status = statusFilter
      }
      
      if (doctorFilter !== 'all') {
        filters.doctor_id = doctorFilter
      }

      const data = await getAppointments(filters)
      setAppointments(data)
    } catch (error) {
      console.error('Error loading appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'scheduled': return 'default'
      case 'confirmed': return 'secondary'
      case 'completed': return 'default'
      case 'cancelled': return 'destructive'
      case 'no_show': return 'destructive'
      default: return 'default'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <Clock className="h-3 w-3" />
      case 'confirmed': return <Check className="h-3 w-3" />
      case 'completed': return <Check className="h-3 w-3" />
      case 'cancelled': return <X className="h-3 w-3" />
      case 'no_show': return <AlertCircle className="h-3 w-3" />
      default: return <Clock className="h-3 w-3" />
    }
  }

  const formatAppointmentDate = (dateString: string) => {
    const date = new Date(dateString)
    
    if (isToday(date)) {
      return `Today at ${format(date, 'h:mm a')}`
    } else if (isTomorrow(date)) {
      return `Tomorrow at ${format(date, 'h:mm a')}`
    } else if (isYesterday(date)) {
      return `Yesterday at ${format(date, 'h:mm a')}`
    } else {
      return format(date, 'MMM d, h:mm a')
    }
  }

  const updateAppointmentStatus = async (appointmentId: string, newStatus: string) => {
    // Implementation for status update
    console.log(`Updating appointment ${appointmentId} to ${newStatus}`)
    await loadAppointments() // Refresh list
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
                    <div className="space-y-2">
                      <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                      <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                    </div>
                  </div>
                  <div className="h-6 w-16 animate-pulse rounded bg-muted" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (appointments.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No appointments found</h3>
          <p className="text-muted-foreground mb-4">
            {statusFilter !== 'all' || doctorFilter !== 'all' 
              ? 'Try adjusting your filters' 
              : 'No appointments scheduled'}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <Card key={appointment.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={appointment.patients?.avatar_url} />
                  <AvatarFallback>
                    {appointment.patients?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="space-y-2">
                  <div>
                    <h3 className="font-semibold">{appointment.patients?.full_name}</h3>
                    <p className="text-sm text-muted-foreground">
                      with {appointment.profiles?.full_name}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatAppointmentDate(appointment.scheduled_at)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{appointment.duration_mins} minutes</span>
                    </div>
                    
                    {appointment.service_type && (
                      <Badge variant="outline">
                        {appointment.service_type}
                      </Badge>
                    )}
                  </div>
                  
                  {appointment.notes && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {appointment.notes}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge variant={getStatusVariant(appointment.status)} className="flex items-center gap-1">
                  {getStatusIcon(appointment.status)}
                  {appointment.status}
                </Badge>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {appointment.status === 'scheduled' && (
                      <DropdownMenuItem onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}>
                        <Check className="mr-2 h-4 w-4" />
                        Confirm
                      </DropdownMenuItem>
                    )}
                    
                    {appointment.status === 'confirmed' && (
                      <DropdownMenuItem onClick={() => updateAppointmentStatus(appointment.id, 'completed')}>
                        <Check className="mr-2 h-4 w-4" />
                        Mark Complete
                      </DropdownMenuItem>
                    )}
                    
                    {(appointment.status === 'scheduled' || appointment.status === 'confirmed') && (
                      <DropdownMenuItem onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}>
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </DropdownMenuItem>
                    )}
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      View Patient Profile
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem>
                      <Calendar className="mr-2 h-4 w-4" />
                      Reschedule
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
```

### 6.3 Appointment Form Component

```tsx
// components/appointments/AppointmentForm.tsx
'use client'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { appointmentSchema, type AppointmentFormData } from '@/lib/validations/appointment'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, AlertTriangle } from 'lucide-react'
import { format, addDays, setHours, setMinutes } from 'date-fns'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { checkAppointmentConflict } from '@/lib/appointments/conflict-check'
import { getPatients, getDoctors } from '@/lib/supabase/queries'

interface AppointmentFormProps {
  initialData?: Partial<AppointmentFormData>
  onSubmit: (data: AppointmentFormData) => Promise<void>
  isLoading?: boolean
}

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
]

const SERVICE_TYPES = [
  { value: 'checkup', label: 'Check-up' },
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'filling', label: 'Filling' },
  { value: 'extraction', label: 'Extraction' },
  { value: 'consultation', label: 'Consultation' },
  { value: 'crown', label: 'Crown' },
  { value: 'root_canal', label: 'Root Canal' },
  { value: 'orthodontics', label: 'Orthodontics' }
]

export function AppointmentForm({ initialData, onSubmit, isLoading }: AppointmentFormProps) {
  const { toast } = useToast()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialData?.scheduled_at ? new Date(initialData.scheduled_at) : undefined
  )
  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [checkingConflict, setCheckingConflict] = useState(false)
  
  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: initialData,
  })

  const selectedTime = form.watch('time_slot')
  const selectedPatient = form.watch('patient_id')
  const selectedDoctor = form.watch('doctor_id')
  const selectedDuration = form.watch('duration_mins')

  useEffect(() => {
    loadPatients()
    loadDoctors()
  }, [])

  useEffect(() => {
    if (selectedDate && selectedTime) {
      const [hours, minutes] = selectedTime.split(':')
      const dateTime = new Date(selectedDate)
      dateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0)
      form.setValue('scheduled_at', dateTime.toISOString())
    }
  }, [selectedDate, selectedTime, form])

  useEffect(() => {
    if (selectedDate && selectedTime && selectedDoctor && selectedDuration) {
      checkForConflicts()
    }
  }, [selectedDate, selectedTime, selectedDoctor, selectedDuration])

  const loadPatients = async () => {
    try {
      const data = await getPatients()
      setPatients(data)
    } catch (error) {
      console.error('Error loading patients:', error)
    }
  }

  const loadDoctors = async () => {
    try {
      const data = await getDoctors()
      setDoctors(data)
    } catch (error) {
      console.error('Error loading doctors:', error)
    }
  }

  const checkForConflicts = async () => {
    if (!selectedDate || !selectedTime || !selectedDoctor || !selectedDuration) return

    try {
      setCheckingConflict(true)
      const [hours, minutes] = selectedTime.split(':')
      const startTime = new Date(selectedDate)
      startTime.setHours(parseInt(hours), parseInt(minutes), 0, 0)
      
      const { hasConflict, conflicts } = await checkAppointmentConflict(
        selectedDoctor,
        startTime,
        selectedDuration,
        initialData?.id // Exclude current appointment when editing
      )

      if (hasConflict) {
        const conflictTime = format(new Date(conflicts[0].scheduled_at), 'h:mm a')
        form.setError('scheduled_at', {
          message: `Doctor has a conflicting appointment at ${conflictTime}`,
        })
      } else {
        form.clearErrors('scheduled_at')
      }
    } catch (error) {
      console.error('Error checking conflicts:', error)
    } finally {
      setCheckingConflict(false)
    }
  }

  const handleSubmit = async (data: AppointmentFormData) => {
    try {
      await onSubmit(data)
      toast({
        title: 'Success',
        description: 'Appointment booked successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to book appointment',
        variant: 'destructive'
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="patient_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Patient *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select patient" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {patients.map((patient: any) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="doctor_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Doctor *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select doctor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {doctors.map((doctor: any) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        Dr. {doctor.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !selectedDate && 'text-muted-foreground'
                        )}
                      >
                        {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date() || date < new Date('1900-01-01')}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="time_slot"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {TIME_SLOTS.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="duration_mins"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration *</FormLabel>
                <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="service_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SERVICE_TYPES.map((service) => (
                      <SelectItem key={service.value} value={service.value}>
                        {service.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {form.formState.errors.scheduled_at && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <p className="text-sm text-destructive">
              {form.formState.errors.scheduled_at.message}
            </p>
          </div>
        )}

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Special instructions, patient preferences, etc." 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" disabled={isLoading || checkingConflict}>
            {isLoading || checkingConflict ? 'Processing...' : 'Book Appointment'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
```

## Implementation Steps

### Appointment Management
- [ ] Create appointments list with filtering
- [ ] Build calendar view component
- [ ] Implement appointment booking form
- [ ] Add conflict detection system
- [ ] Create status management actions

### Advanced Features
- [ ] Implement real-time conflict checking
- [ ] Add appointment reminders
- [ ] Create recurring appointments support
- [ ] Build waitlist functionality

### User Experience
- [ ] Add drag-and-drop rescheduling
- [ ] Implement bulk actions
- [ ] Create appointment templates
- [ ] Add mobile-responsive design

## Deliverables
- Complete appointment management system
- Calendar and list views
- Conflict detection and prevention
- Status management workflow
- Doctor and patient scheduling

## Estimated Time
2 days
