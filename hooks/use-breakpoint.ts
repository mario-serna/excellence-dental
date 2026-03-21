import * as React from 'react';

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

type Breakpoint = keyof typeof BREAKPOINTS;

// Global state for efficient breakpoint tracking
const breakpointState = new Map<Breakpoint, boolean>();
const listeners = new Set<() => void>();

export function useBreakpoint(breakpoint: Breakpoint): boolean {
  const [isBreakpoint, setIsBreakpoint] = React.useState<boolean>(() => {
    // Initialize with current value if available
    return breakpointState.get(breakpoint) ?? false;
  });

  React.useEffect(() => {
    // Update state when global state changes
    const updateState = () => {
      setIsBreakpoint(breakpointState.get(breakpoint) ?? false);
    };

    // Add to listeners
    listeners.add(updateState);

    // Set up media query if not already exists
    if (!breakpointState.has(breakpoint)) {
      const mql = window.matchMedia(
        `(min-width: ${BREAKPOINTS[breakpoint]}px)`
      );
      const onChange = () => {
        const newValue = window.innerWidth >= BREAKPOINTS[breakpoint];
        breakpointState.set(breakpoint, newValue);
        // Notify all listeners
        listeners.forEach((listener) => listener());
      };

      mql.addEventListener('change', onChange);
      // Set initial value
      onChange();
    }

    updateState();

    return () => {
      listeners.delete(updateState);
    };
  }, [breakpoint]);

  return isBreakpoint;
}

export function useIsMobile(): boolean {
  return useBreakpoint('sm');
}

export function useIsTablet(): boolean {
  // Tablet is screens >= md but < lg
  const isMdOrAbove = useBreakpoint('md');
  const isLgOrAbove = useBreakpoint('lg');
  return isMdOrAbove && !isLgOrAbove;
}

export function useIsDesktop(): boolean {
  return useBreakpoint('lg');
}
