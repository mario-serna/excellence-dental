# 🧑‍⚕️ Phase 5 — Patient Management

## Overview

Complete patient management system with CRUD operations, patient profiles, and medical records.

## Steps

### 5.1 Patient List Page

```tsx
// app/[locale]/(dashboard)/patients/page.tsx
import { Suspense } from 'react';
import { PatientsList } from '@/components/patients/PatientsList';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

export default function PatientsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Patients</h1>
          <p className="text-muted-foreground">
            Manage patient records and information
          </p>
        </div>
        <Link href="/patients/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Patient
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search Patients</CardTitle>
          <CardDescription>
            Find patients by name, phone, or email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search patients..." className="pl-10" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patients List */}
      <Suspense fallback={<div>Loading patients...</div>}>
        <PatientsList />
      </Suspense>
    </div>
  );
}
```

### 5.2 Patients List Component

```tsx
// components/patients/PatientsList.tsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { MoreHorizontal, Edit, FileText, Calendar } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { getPatients } from '@/lib/supabase/queries';
import type { Patient } from '@/types';

export function PatientsList() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const data = await getPatients();
      setPatients(data);
    } catch (error) {
      console.error('Error loading patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="h-12 w-12 animate-pulse rounded-full bg-muted" />
                <div className="space-y-2">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (filteredPatients.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">No patients found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm
                ? 'Try adjusting your search terms'
                : 'Get started by adding your first patient'}
            </p>
            <Button asChild>
              <Link href="/patients/new">Add Patient</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredPatients.map((patient) => (
        <Card key={patient.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={patient.avatar_url} />
                  <AvatarFallback>
                    {patient.full_name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="font-semibold">{patient.full_name}</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    {patient.phone && <p>{patient.phone}</p>}
                    {patient.email && <p>{patient.email}</p>}
                  </div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/patients/${patient.id}`}>
                      <FileText className="mr-2 h-4 w-4" />
                      View Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/patients/${patient.id}/edit`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/appointments/new?patient=${patient.id}`}>
                      <Calendar className="mr-2 h-4 w-4" />
                      Book Appointment
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {patient.notes && (
              <p className="mt-4 text-sm text-muted-foreground line-clamp-2">
                {patient.notes}
              </p>
            )}

            <div className="mt-4 flex items-center justify-between">
              <Badge variant="outline">
                Patient since {format(new Date(patient.created_at), 'MMM yyyy')}
              </Badge>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/patients/${patient.id}`}>View Details</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

### 5.3 Patient Form Component

```tsx
// components/patients/PatientForm.tsx
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { patientSchema, type PatientFormData } from '@/lib/validations/patient';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface PatientFormProps {
  initialData?: Partial<PatientFormData>;
  onSubmit: (data: PatientFormData) => Promise<void>;
  isLoading?: boolean;
}

export function PatientForm({
  initialData,
  onSubmit,
  isLoading,
}: PatientFormProps) {
  const { toast } = useToast();
  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: initialData,
  });

  const handleSubmit = async (data: PatientFormData) => {
    try {
      await onSubmit(data);
      toast({
        title: 'Success',
        description: 'Patient saved successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save patient',
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter patient name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value
                          ? format(new Date(field.value), 'PPP')
                          : 'Pick a date'}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) =>
                        field.onChange(date?.toISOString().split('T')[0])
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="Phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Email address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Street address, city, state, zip code"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Medical Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Allergies, medical conditions, medications, etc."
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
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Patient'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
```

### 5.4 Patient Profile Page

```tsx
// app/[locale]/(dashboard)/patients/[id]/page.tsx
import { notFound } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Phone, Mail, MapPin, Calendar, Edit, FileText } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { getPatientById } from '@/lib/supabase/queries';
import { PatientRecords } from '@/components/patients/PatientRecords';
import { PatientAppointments } from '@/components/patients/PatientAppointments';

interface PatientProfilePageProps {
  params: { id: string };
}

export default async function PatientProfilePage({
  params,
}: PatientProfilePageProps) {
  const patient = await getPatientById(params.id);

  if (!patient) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{patient.full_name}</h1>
          <p className="text-muted-foreground">Patient Profile</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href={`/appointments/new?patient=${patient.id}`}>
              Book Appointment
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/patients/${patient.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      {/* Patient Information */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
            <CardDescription>Personal and contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-medium">Contact Information</h4>
                {patient.phone && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{patient.phone}</span>
                  </div>
                )}
                {patient.email && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{patient.email}</span>
                  </div>
                )}
                {patient.address && (
                  <div className="flex items-start space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>{patient.address}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Personal Details</h4>
                {patient.dob && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Born {format(new Date(patient.dob), 'MMM d, yyyy')}(
                      {Math.floor(
                        (Date.now() - new Date(patient.dob).getTime()) /
                          (365.25 * 24 * 60 * 60 * 1000)
                      )}{' '}
                      years)
                    </span>
                  </div>
                )}
                {patient.gender && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Badge variant="outline" className="capitalize">
                      {patient.gender}
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {patient.notes && (
              <div>
                <h4 className="font-medium mb-2">Medical Notes</h4>
                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  {patient.notes}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold">12</div>
              <p className="text-sm text-muted-foreground">Total Visits</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">3</div>
              <p className="text-sm text-muted-foreground">This Year</p>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">Mar 15</div>
              <p className="text-sm text-muted-foreground">Last Visit</p>
            </div>
            <Button variant="outline" className="w-full" asChild>
              <Link href={`/patients/${patient.id}/records/new`}>
                <FileText className="mr-2 h-4 w-4" />
                Add Record
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Records and Appointments */}
      <Tabs defaultValue="records" className="space-y-4">
        <TabsList>
          <TabsTrigger value="records">Medical Records</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
        </TabsList>

        <TabsContent value="records">
          <PatientRecords patientId={patient.id} />
        </TabsContent>

        <TabsContent value="appointments">
          <PatientAppointments patientId={patient.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

## Implementation Steps

### Patient Management

- [ ] Create patient list page with search and filtering
- [ ] Build patient form with validation
- [ ] Implement patient profile page with tabs
- [ ] Create patient records management
- [ ] Add patient appointment history

### Data Operations

- [ ] Implement CRUD operations for patients
- [ ] Add patient search functionality
- [ ] Create medical records system
- [ ] Build appointment history tracking

### User Experience

- [ ] Add loading states and error handling
- [ ] Implement responsive design
- [ ] Add quick action buttons
- [ ] Create empty states

## Deliverables

- Complete patient management system
- Patient profiles with medical history
- Search and filtering capabilities
- Medical records tracking
- Appointment history integration

## Estimated Time

2 days
