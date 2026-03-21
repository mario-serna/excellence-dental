import { Button } from '@/components/ui/button';
import { DynamicIcon } from '@/components/ui/dynamic-icon';
import { ELEMENT_VARIANTS, ElementVariant } from '@/components/ui/types';
import Link from 'next/link';

interface QuickActionButtonProps {
  action?: () => void;
  href?: string;
  icon: string; // LucideIcon component name (e.g., 'CalendarPlus', 'UserPlus')
  text: string;
  variant?: ElementVariant;
  isMobile?: boolean;
  disabled?: boolean;
}

export function QuickActionButton({
  action,
  href,
  icon,
  text,
  variant = ELEMENT_VARIANTS.default,
  isMobile,
  disabled = false,
}: QuickActionButtonProps) {
  const buttonContent = (
    <>
      <DynamicIcon
        iconName={icon}
        className={isMobile ? 'size-5' : 'flex-shrink-0 size-5'}
      />
      {!isMobile && (
        <div className="text-left flex-1">
          <span className="text-sm line-clamp-2 leading-tight">{text}</span>
        </div>
      )}
    </>
  );

  if (isMobile) {
    return (
      <div className="flex flex-col items-center gap-2 w-20">
        {href ? (
          <Link href={href}>
            <Button
              variant={variant}
              className="h-14 w-14 flex items-center justify-center p-0"
            >
              <DynamicIcon iconName={icon} className="size-5" />
            </Button>
          </Link>
        ) : (
          <Button
            variant={variant}
            className="h-14 w-14 flex items-center justify-center p-0"
            onClick={action}
            disabled={disabled}
          >
            <DynamicIcon iconName={icon} className="size-5" />
          </Button>
        )}
        <span className="text-xs text-muted-foreground leading-tight text-center break-words">
          {text}
        </span>
      </div>
    );
  }

  return href ? (
    <Link href={href}>
      <Button
        variant={variant}
        className="flex w-full h-12 justify-start gap-4 px-6"
      >
        {buttonContent}
      </Button>
    </Link>
  ) : (
    <Button
      variant={variant}
      className="flex w-full h-12 justify-start gap-4 px-6"
      onClick={action}
      disabled={disabled}
    >
      {buttonContent}
    </Button>
  );
}
