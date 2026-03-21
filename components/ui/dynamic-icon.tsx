'use client';

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

interface DynamicIconProps {
  iconName: string;
  className?: string;
  size?: number | string;
}

export function DynamicIcon({
  iconName,
  className,
  size = 20,
}: DynamicIconProps) {
  const IconComponent = dynamic(
    async () => {
      const lucideModule = await import('lucide-react');
      const Icon = lucideModule[
        iconName as keyof typeof lucideModule
      ] as ComponentType<{ className?: string; size?: number | string }>;

      if (!Icon) {
        console.warn(`Icon "${iconName}" not found in lucide-react`);
        // Fallback to HelpCircle icon
        const HelpCircle = lucideModule.HelpCircle;
        return HelpCircle;
      }

      return Icon;
    },
    {
      loading: () => (
        <div
          className="animate-pulse bg-muted rounded"
          style={{ width: size, height: size }}
        />
      ),
      ssr: false,
    }
  );

  return <IconComponent className={className} size={size} />;
}
