import {
  Item,
  ItemActions,
  ItemContent,
  ItemHeader,
} from '@/components/ui/item';
import { Clock } from 'lucide-react';

export function AppointmentSkeleton() {
  return (
    <Item className="border rounded-lg">
      <ItemHeader>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Clock className="h-5 w-5 text-primary" />
        </div>
        <ItemContent>
          <div className="space-y-2">
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="h-3 w-32 animate-pulse rounded bg-muted" />
          </div>
        </ItemContent>
        <ItemActions>
          <div className="h-6 w-16 animate-pulse rounded bg-muted" />
          <div className="h-8 w-16 animate-pulse rounded bg-muted" />
        </ItemActions>
      </ItemHeader>
      <div className="flex items-center space-x-2 text-sm text-muted-foreground ml-14">
        <div className="h-4 w-16 animate-pulse rounded bg-muted" />
        <div className="h-4 w-2 animate-pulse rounded bg-muted" />
        <div className="h-4 w-16 animate-pulse rounded bg-muted" />
      </div>
    </Item>
  );
}
