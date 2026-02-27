# 🗄️ Phase 0 — Project Setup

## Overview

Initial project scaffolding, dependency installation, and development environment configuration.

## Steps

### 0.1 Basic Setup

- [ ] `npx create-next-app@latest dental-poc --typescript --tailwind --app`
- [ ] Install and init shadcn/ui: `npx shadcn@latest init`
- [ ] Install dependencies:
  ```bash
  npm install @supabase/supabase-js @supabase/ssr
  npm install react-hook-form @hookform/resolvers zod
  npm install zustand
  npm install resend
  npm install date-fns
  ```
- [ ] Install shadcn components:
  ```bash
  npx shadcn@latest add button input label card badge
  npx shadcn@latest add dialog sheet select textarea
  npx shadcn@latest add table tabs avatar separator
  npx shadcn@latest add form toast dropdown-menu
  npx shadcn@latest add calendar popover
  ```
- [ ] Create Supabase project at supabase.com
- [ ] Configure `.env.local`:
  ```env
  NEXT_PUBLIC_SUPABASE_URL=
  NEXT_PUBLIC_SUPABASE_ANON_KEY=
  SUPABASE_SERVICE_ROLE_KEY=
  RESEND_API_KEY=
  ```
- [ ] Apply theme variables to `globals.css`
- [ ] Set up Inter font in `layout.tsx`

### 0.2 i18n Setup (Spanish Default)

- [ ] Install next-intl: `npm install next-intl`
- [ ] Create `i18n.ts` configuration:

  ```ts
  import { getRequestConfig } from 'next-intl/server';

  export default getRequestConfig(async ({ locale }) => ({
    messages: (await import(`./locales/${locale}/common.json`)).default,
  }));
  ```

- [ ] Create Spanish translation file `locales/es/common.json`:
  ```json
  {
    "common": {
      "save": "Guardar",
      "cancel": "Cancelar",
      "delete": "Eliminar",
      "edit": "Editar",
      "add": "Agregar",
      "search": "Buscar",
      "loading": "Cargando...",
      "error": "Error",
      "success": "Éxito"
    },
    "auth": {
      "login": "Iniciar Sesión",
      "logout": "Cerrar Sesión",
      "email": "Correo Electrónico",
      "password": "Contraseña",
      "loginButton": "Ingresar"
    },
    "navigation": {
      "dashboard": "Panel Principal",
      "patients": "Pacientes",
      "appointments": "Citas",
      "users": "Usuarios"
    }
  }
  ```
- [ ] Create English translation file `locales/en/common.json`:
  ```json
  {
    "common": {
      "save": "Save",
      "cancel": "Cancel",
      "delete": "Delete",
      "edit": "Edit",
      "add": "Add",
      "search": "Search",
      "loading": "Loading...",
      "error": "Error",
      "success": "Success"
    },
    "auth": {
      "login": "Login",
      "logout": "Logout",
      "email": "Email",
      "password": "Password",
      "loginButton": "Sign In"
    },
    "navigation": {
      "dashboard": "Dashboard",
      "patients": "Patients",
      "appointments": "Appointments",
      "users": "Users"
    }
  }
  ```
- [ ] Update `next.config.ts` for i18n:

  ```ts
  import createNextIntlPlugin from 'next-intl/plugin';

  const withNextIntl = createNextIntlPlugin('./i18n.ts');

  /** @type {import('next').NextConfig} */
  const nextConfig = {};

  export default withNextIntl(nextConfig);
  ```

- [ ] Create locale proxy structure in `app/`:
  ```
  app/
  ├── [locale]/
  │   ├── (auth)/
  │   │   └── login/
  │   │       └── page.tsx
  │   ├── (dashboard)/
  │   │   ├── layout.tsx
  │   │   ├── dashboard/
  │   │   │   └── page.tsx
  │   │   ├── patients/
  │   │   │   ├── page.tsx
  │   │   │   ├── new/page.tsx
  │   │   │   └── [id]/
  │   │   │       ├── page.tsx
  │   │   │       └── records/
  │   │   │           └── new/page.tsx
  │   │   ├── appointments/
  │   │   │   ├── page.tsx
  │   │   │   └── new/page.tsx
  │   │   └── admin/
  │   │       └── users/
  │   │           └── page.tsx
  │   └── layout.tsx
  └── page.tsx
  ```
- [ ] Create locale redirect `app/page.tsx`:

  ```ts
  import { redirect } from 'next/navigation';

  export default function RootPage() {
    redirect('/es');
  }
  ```

- [ ] Update `[locale]/layout.tsx` to support locale parameter:

  ```ts
  import { NextIntlClientProvider } from 'next-intl'
  import { getMessages } from 'next-intl/server'
  import { notFound } from 'next/navigation'

  export default async function LocaleLayout({
    children,
    params: { locale }
  }: {
    children: React.ReactNode
    params: { locale: string }
  }) {
    // Validate locale
    if (!['es', 'en'].includes(locale)) {
      notFound()
    }

    const messages = await getMessages()

    return (
      <html lang={locale}>
        <body>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </body>
      </html>
    )
  }
  ```

### 0.3 Testing Setup

- [ ] Install Vitest and related dependencies:
  ```bash
  npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom @vitest/ui
  ```
- [ ] Create `vitest.config.ts`:

  ```ts
  import { defineConfig } from 'vitest/config';
  import { resolve } from 'path';

  export default defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./test/setup.ts'],
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './'),
      },
    },
  });
  ```

- [ ] Create test setup file `test/setup.ts`:
  ```ts
  import '@testing-library/jest-dom';
  ```
- [ ] Add test scripts to `package.json`:
  ```json
  {
    "scripts": {
      "test": "vitest",
      "test:ui": "vitest --ui",
      "test:coverage": "vitest --coverage"
    }
  }
  ```
- [ ] Create example test `__tests__/example.test.tsx`:

  ```tsx
  import { render, screen } from '@testing-library/react';
  import { describe, it, expect } from 'vitest';

  describe('Example Test', () => {
    it('should render', () => {
      render(<div>Hello World</div>);
      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });
  });
  ```

### 0.4 Development Environment

- [ ] Configure ESLint for Next.js + TypeScript:
  ```json
  {
    "extends": ["next/core-web-vitals", "@typescript-eslint/recommended"],
    "rules": {
      "@typescript-eslint/no-unused-vars": "error",
      "prefer-const": "error"
    }
  }
  ```
- [ ] Configure Prettier:
  ```json
  {
    "semi": false,
    "singleQuote": true,
    "tabWidth": 2,
    "trailingComma": "es5"
  }
  ```
- [ ] Add VS Code settings (`.vscode/settings.json`):
  ```json
  {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "typescript.preferences.importModuleSpecifier": "relative",
    "editor.codeActionsOnSave": {
      "source.fixAll.prettier": "always",
      "source.removeUnusedImports": "always",
      "source.organizeLinkDefinitions": "always",
      "source.addMissingImports.ts": "always",
      "source.organizeImports": "always"
    }
  }
  ```

## Deliverables

- Fully configured Next.js project with TypeScript and Tailwind
- Internationalization setup with Spanish as default
- Testing framework configuration
- Development environment with linting and formatting
- Supabase project created and environment variables configured

## Estimated Time

0.5 day
