# 👤 Phase 8 — User Management (Admin Only)

## Overview

Admin-only user management system with role-based access control, user invitations, and profile management.

## Steps

### 8.1 Users List Page

```tsx
// app/[locale]/(dashboard)/admin/users/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { UsersList } from '@/components/admin/UsersList';
import { Button } from '@/components/ui/button';
import { Plus, Search, UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RoleGuard } from '@/components/layout/RoleGuard';
import { useRole } from '@/hooks/useRole';

export default function UsersPage() {
  const { isAdmin } = useRole();

  if (!isAdmin) {
    return (
      <RoleGuard allowedRoles={['admin']}>
        <div>Access denied</div>
      </RoleGuard>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage clinic staff and permissions
          </p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite User
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search Users</CardTitle>
          <CardDescription>Find users by name, email, or role</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search users..." className="pl-10" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <UsersList />
    </div>
  );
}
```

### 8.2 Users List Component

```tsx
// components/admin/UsersList.tsx
'use client';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Mail,
  Shield,
  ShieldOff,
} from 'lucide-react';
import { format } from 'date-fns';
import { getUsers } from '@/lib/supabase/queries';
import type { Profile } from '@/types';
import { useToast } from '@/hooks/use-toast';

export function UsersList() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      // Implementation for toggling user status
      console.log(`Toggling user ${userId} status to ${!currentStatus}`);
      await loadUsers(); // Refresh list
      toast({
        title: 'Success',
        description: `User ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user status',
        variant: 'destructive',
      });
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'doctor':
        return 'default';
      case 'assistant':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 animate-pulse rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-20 animate-pulse rounded bg-muted" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (filteredUsers.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">No users found</h3>
            <p className="text-muted-foreground">
              {searchTerm
                ? 'Try adjusting your search terms'
                : 'No users in the system yet'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {filteredUsers.map((user) => (
        <Card key={user.id}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.avatar_url} />
                  <AvatarFallback>
                    {user.full_name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold">{user.full_name}</h3>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    {user.phone && (
                      <div className="flex items-center space-x-1">
                        <Mail className="h-4 w-4" />
                        <span>user.email@example.com</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Shield className="h-4 w-4" />
                      <span>{user.is_active ? 'Active' : 'Inactive'}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Joined {format(new Date(user.created_at), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit User
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => toggleUserStatus(user.id, user.is_active)}
                  >
                    {user.is_active ? (
                      <>
                        <ShieldOff className="mr-2 h-4 w-4" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <Shield className="mr-2 h-4 w-4" />
                        Activate
                      </>
                    )}
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete User
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

### 8.3 Invite User Sheet

```tsx
// components/admin/InviteUserSheet.tsx
'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Mail, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const inviteUserSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  role: z.enum(['admin', 'doctor', 'assistant'], {
    required_error: 'Please select a role',
  }),
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
});

type InviteUserFormData = z.infer<typeof inviteUserSchema>;

interface InviteUserSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteUserSheet({ open, onOpenChange }: InviteUserSheetProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<InviteUserFormData>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      email: '',
      role: 'assistant',
      full_name: '',
    },
  });

  const handleSubmit = async (data: InviteUserFormData) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to invite user');
      }

      toast({
        title: 'Success',
        description: `Invitation sent to ${data.email}`,
      });

      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send invitation',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Invite New User
          </SheetTitle>
          <SheetDescription>
            Send an invitation to join the dental clinic management system
          </SheetDescription>
        </SheetHeader>

        <div className="px-1">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter email address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="assistant">Assistant</SelectItem>
                        <SelectItem value="doctor">Doctor</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Mail className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Invitation
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
```

### 8.4 API Route for User Invitation

```typescript
// app/api/admin/invite/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Verify requester is admin first (in a real implementation)
    // const adminSupabase = createClient(...)
    // const { data: { session } } = await adminSupabase.auth.getSession()
    // if (!session || session.user.app_metadata?.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const { email, role, full_name } = await request.json();

    // Validate input
    if (!email || !role || !full_name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
      data: { full_name },
      options: {
        data: { role },
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
      },
    });

    if (error) {
      console.error('Invite error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Log the invitation
    await supabase.from('invitation_logs').insert({
      email,
      role,
      full_name,
      invited_by: 'admin_user_id', // Would come from session
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Invitation sent successfully',
      user: data,
    });
  } catch (error) {
    console.error('Invite API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
```

## Implementation Steps

### User Management

- [ ] Create users list with role-based filtering
- [ ] Build user invitation system
- [ ] Implement user status management
- [ ] Add user profile editing
- [ ] Create role-based access control

### Admin Features

- [ ] Implement user invitation workflow
- [ ] Add bulk user operations
- [ ] Create user activity logging
- [ ] Build permission management

### Security & Access

- [ ] Protect admin routes with middleware
- [ ] Implement role-based UI components
- [ ] Add audit logging for admin actions
- [ ] Create secure API endpoints

## Deliverables

- Complete user management system
- Role-based access control
- User invitation workflow
- Admin-only functionality
- Security and audit features

## Estimated Time

1 day
