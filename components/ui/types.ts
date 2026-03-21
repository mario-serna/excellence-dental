export const ELEMENT_VARIANTS = {
  default: 'default',
  outline: 'outline',
  secondary: 'secondary',
  destructive: 'destructive',
  ghost: 'ghost',
  link: 'link',
} as const;
export type ElementVariant =
  (typeof ELEMENT_VARIANTS)[keyof typeof ELEMENT_VARIANTS];

export const ELEMENT_SIZES = {
  default: 'default',
  xs: 'xs',
  sm: 'sm',
  lg: 'lg',
  icon: 'icon',
  'icon-xs': 'icon-xs',
  'icon-sm': 'icon-sm',
  'icon-lg': 'icon-lg',
} as const;
export type ElementSize = (typeof ELEMENT_SIZES)[keyof typeof ELEMENT_SIZES];
