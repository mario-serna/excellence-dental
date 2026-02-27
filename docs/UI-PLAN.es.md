# 🦷 Excellence Dental — Brief de Diseño UI para Sticht

## Contexto del Proyecto

Estás diseñando la UI completa para el **sistema de gestión de Excellence Dental**. Es una aplicación web con control de acceso por roles, construida con **Next.js 14 (App Router)**, **shadcn/ui** y **Tailwind CSS**. Todas las pantallas deben ser **mobile-first y completamente responsivas** — el personal de la clínica usará el sistema tanto en tablets y teléfonos como en escritorio.

El sistema tiene tres roles de usuario: **Administrador**, **Doctor** y **Asistente**. Cada uno tiene una vista ligeramente diferente de las mismas pantallas principales, pero la identidad visual es unificada.

---

## Dirección de Diseño

**Tono**: Minimalismo clínico refinado — limpio, confiable y sereno. Esta es una herramienta profesional usada en salud, por lo que cada decisión de diseño debe comunicar precisión y claridad. Piensa en un SaaS premium que se encuentra con una clínica privada de alto nivel. No frío ni estéril — blancos cálidos, tipografía cuidada, uso intencional del color.

**Pilares Estéticos**:
- Espacio en blanco generoso con densidad intencional en zonas de datos
- Azul cielo como acento primario — calmado, higiénico, confiable
- Sombras suaves y bordes sutiles — sin contornos bruscos
- Microinteracciones suaves y con propósito (hover, transiciones, estados de carga)
- Tipografía legible a cualquier tamaño — las UIs médicas deben ser escaneables en segundos

**Lo que hace esta UI INOLVIDABLE**: La interfaz se siente diseñada específicamente para una clínica dental premium — no un dashboard genérico de SaaS. Las insignias de estado, las tarjetas de pacientes y los bloques de citas se sienten intencionales y contextuales. Un doctor que toma su teléfono entre consultas puede encontrar lo que necesita en 2 segundos.

---

## Design Tokens

### Colores (Variables CSS)
```css
:root {
  --background:         0 0% 98.8%;        /* #FCFCFD — blanco roto */
  --foreground:         215 28% 7%;         /* #0F172A — slate 900 */
  --card:               0 0% 100%;          /* #FFFFFF */
  --card-foreground:    215 28% 7%;
  --primary:            199 89% 48%;        /* #0EA5E9 — azul cielo */
  --primary-foreground: 0 0% 100%;
  --secondary:          210 40% 96%;        /* #F1F5F9 */
  --secondary-foreground: 215 28% 7%;
  --muted:              210 40% 96%;
  --muted-foreground:   215 16% 47%;        /* #64748B — slate 500 */
  --accent:             199 89% 48%;
  --accent-foreground:  0 0% 100%;
  --destructive:        0 84% 60%;          /* #EF4444 */
  --border:             214 32% 91%;        /* #E2E8F0 */
  --input:              214 32% 91%;
  --ring:               199 89% 48%;
  --radius:             0.5rem;

  /* Colores semánticos de estado */
  --status-programada:  199 89% 48%;        /* azul cielo */
  --status-confirmada:  160 84% 39%;        /* #10B981 esmeralda */
  --status-completada:  215 16% 47%;        /* slate — hecho neutral */
  --status-cancelada:   0 84% 60%;          /* rojo */
  --status-no-asistio:  38 92% 50%;         /* ámbar */
}
```

### Tipografía
- **Títulos / Encabezados**: `DM Sans` — moderno, geométrico, cercano. Pesos 500 y 600.
- **Cuerpo / UI**: `DM Sans` — misma familia, peso 400. Consistencia sobre contraste.
- **Monoespaciado** (IDs, timestamps): `JetBrains Mono` — uso pequeño y sutil.
- Tamaño base: `16px`. Altura de línea: `1.6` para cuerpo, `1.2` para títulos.

### Espaciado y Layout
- Ancho del sidebar en escritorio: `256px` (colapsable a `64px` solo íconos)
- Altura del top nav: `64px`
- Ancho máximo del contenido: `1280px`
- Border-radius de tarjetas: `12px`
- Padding estándar: `24px` escritorio, `16px` móvil
- Separación entre secciones: `24px`

### Sombras
```css
--shadow-sm:  0 1px 2px 0 rgb(15 23 42 / 0.05);
--shadow-md:  0 4px 6px -1px rgb(15 23 42 / 0.07), 0 2px 4px -1px rgb(15 23 42 / 0.05);
--shadow-lg:  0 10px 15px -3px rgb(15 23 42 / 0.08), 0 4px 6px -2px rgb(15 23 42 / 0.04);
```

---

## Convenciones de Componentes

### Insignia de Estado (Status Badge)
Badge en forma de píldora, fuente pequeña (`text-xs font-medium`), punto de color + etiqueta.
```
● Programada  → azul cielo  bg-sky-50 text-sky-700 border border-sky-200
● Confirmada  → esmeralda   bg-emerald-50 text-emerald-700 border border-emerald-200
● Completada  → slate       bg-slate-100 text-slate-600 border border-slate-200
● Cancelada   → rojo        bg-red-50 text-red-600 border border-red-200
● No Asistió  → ámbar       bg-amber-50 text-amber-700 border border-amber-200
```

### Insignia de Rol (Role Badge)
Badge pequeño mostrado junto al nombre del usuario.
```
Administrador → bg-violet-50 text-violet-700 border border-violet-200
Doctor        → bg-sky-50 text-sky-700 border border-sky-200
Asistente     → bg-slate-100 text-slate-600 border border-slate-200
```

### Tarjetas
Fondo blanco, `rounded-xl`, `shadow-sm`, `border border-slate-100`. Estado hover: `shadow-md` con `transition-shadow duration-200`.

### Botón Primario
Relleno azul cielo, texto blanco, `rounded-lg`, hover sutil: `bg-sky-600`. Botones de solo ícono usan variante ghost con fondo en hover.

### Inputs de Formulario
`rounded-lg border-slate-200`, anillo de foco en azul cielo, placeholder en `slate-400`. Etiqueta arriba, `text-sm font-medium text-slate-700`.

---

## Shell del Layout

### Escritorio (≥1024px)
```
┌─────────────────────────────────────────────────┐
│ [Sidebar 256px]  │  [Top Nav 64px]               │
│                  │─────────────────────────────  │
│  Logo            │  [Contenido — con scroll]     │
│  ─────           │                               │
│  Nav Links       │                               │
│  (ícono + label) │                               │
│                  │                               │
│  ─────           │                               │
│  Avatar Usuario  │                               │
│  Nombre + Rol    │                               │
│  Cerrar sesión   │                               │
└─────────────────────────────────────────────────┘
```

### Tablet (768px–1023px)
El sidebar colapsa a solo íconos (`64px`). Etiquetas ocultas. Al tocar el ícono se expande como un drawer superpuesto.

### Móvil (<768px)
El sidebar se convierte en una **barra de navegación inferior** con 4 íconos (Inicio, Pacientes, Citas, Menú). La barra superior muestra el logo + hamburguesa para nav secundaria. El contenido ocupa todo el ancho con `16px` de padding horizontal.

---

## Vistas a Diseñar

---

### VISTA 1 — Inicio de Sesión (`/login`)

**Layout**: Tarjeta centrada sobre un fondo sutil. Sin sidebar.

**Fondo**: Degradado azul cielo muy suave — `from-sky-50 to-slate-50`. Marca de agua SVG de un diente en la esquina inferior derecha a baja opacidad (`opacity-5`).

**Tarjeta** (max-width `400px`, centrada):
- Arriba: Logo de Excellence Dental (ícono de diente + wordmark en azul cielo)
- Subtítulo: "Inicia sesión en tu espacio de trabajo"
- Campo: Correo electrónico
- Campo: Contraseña (con toggle mostrar/ocultar)
- Botón primario "Iniciar sesión" (ancho completo)
- Enlace "¿Olvidaste tu contraseña?" (`text-sm`, muted, centrado debajo del botón)
- Sin enlace de registro (sistema solo para personal — los usuarios son invitados por el administrador)

**Móvil**: La tarjeta ocupa toda la pantalla con `16px` de padding. Sin patrón de fondo visible.

**Estados a mostrar**:
- Por defecto (formulario vacío)
- Estado de error: borde rojo en campos, banner de alerta sobre el formulario ("Credenciales inválidas. Verifica tu correo y contraseña.")
- Estado de carga: el botón muestra spinner + "Iniciando sesión..."

---

### VISTA 2 — Panel Principal (`/dashboard`)

**Variantes de rol**: Mostrar la variante de **Doctor** como primaria; indicar diferencias para Administrador y Asistente.

#### Sección Superior — Saludo + Fecha
```
Buenos días, Dr. Rivera 👋
Jueves, 26 de febrero de 2026
```
Texto muted pequeño. No es un encabezado — tono conversacional.

#### Fila de Estadísticas (4 tarjetas, scroll horizontal en móvil)
Cada `StatsCard` tiene:
- Número grande (`text-2xl font-semibold`)
- Etiqueta debajo (`text-sm text-muted`)
- Ícono pequeño arriba a la derecha en un círculo de color suave
- Tendencia opcional: `↑ 12% vs. semana pasada` en esmeralda o rojo

**Tarjetas variante Doctor**:
1. Mis Citas de Hoy — ícono azul cielo (calendario)
2. Esta Semana — ícono slate (gráfica de barras)
3. Pacientes Atendidos este Mes — ícono esmeralda (usuarios)
4. Próxima Cita — muestra la hora, no un número (ícono de reloj)

**El Administrador agrega**:
- Total de Pacientes Activos
- Total de Personal
- Citas Esta Semana (todos los doctores)
- Pendientes / Sin Confirmar (advertencia ámbar)

#### Contenido Principal — Dos columnas en escritorio, apiladas en móvil

**Columna izquierda (60%): Agenda del Día**
- Encabezado de sección: "Agenda de Hoy" con enlace "Ver todas"
- Lista de filas de citas:
  ```
  [Iniciales] Nombre del Paciente       10:00 AM
              Tipo de Servicio          Dr. Rivera
              [● Confirmada badge]      [⋯ menú]
  ```
- Máximo 6 filas, luego pie "Ver todas"
- Estado vacío: ilustración + "Sin citas para hoy. ¡Disfruta la calma!"

**Columna derecha (40%): Acciones Rápidas + Pacientes Recientes**
- Tarjeta de Acciones Rápidas (3 botones apilados):
  - `+ Nueva Cita` (primario)
  - `+ Nuevo Paciente` (outline)
  - `↗ Ver Calendario Completo` (ghost)
- Tarjeta de Pacientes Recientes:
  - Últimos 4 pacientes atendidos
  - Cada fila: avatar + nombre + fecha de última visita + flecha de enlace

#### Inferior — Tira de Calendario Mini (solo escritorio)
Vista horizontal de la semana mostrando qué días tienen citas. Puntos debajo de las fechas. Día actual resaltado en azul cielo.

---

### VISTA 3 — Lista de Pacientes (`/patients`)

**Fila de Encabezado**:
- Izquierda: título "Pacientes" (`text-2xl font-semibold`) + badge de conteo (`142 pacientes`)
- Derecha: input de búsqueda + botón "Nuevo Paciente"

**Barra de Búsqueda**: Ancho completo en móvil. Placeholder: "Buscar por nombre, teléfono o correo…" con ícono de búsqueda dentro del input.

**Fila de Filtros** (debajo del encabezado, scroll horizontal en móvil):
Filtros tipo chip: `Todos` `Recientes` `Con Cita Próxima` `Sin Visita Reciente`

**Tabla (escritorio)**:
```
Avatar | Nombre Completo      | Edad | Teléfono      | Última Visita  | Próx. Cita     | Acciones
────────────────────────────────────────────────────────────────────────────────────────────────────
  MR   | María Rodríguez      | 34   | +52 55 1234   | 12 feb 2026    | 3 mar 2026     | [Ver] [⋯]
  JC   | Jorge Castellanos    | 51   | +52 55 8478   | 28 ene 2026    | —              | [Ver] [⋯]
```
- Avatar: círculo con iniciales de color (color derivado del nombre por hash consistente)
- "Última Visita" hace más de 6 meses → mostrar en ámbar
- Sin cita próxima → mostrar "—" en slate muted
- Hover en fila: highlight sutil `bg-slate-50`

**Tarjetas de Paciente (móvil)** — Reemplaza la tabla con lista de tarjetas:
```
┌─────────────────────────────────┐
│ [MR]  María Rodríguez     [→]   │
│       34 años · +52 55 1234     │
│  Última visita: 12 feb 2026     │
│  Próx. cita:    3 mar 2026      │
└─────────────────────────────────┘
```

**Estado Vacío**: Ilustración centrada de un diente con signo más. "Aún no hay pacientes. Agrega tu primer paciente para comenzar." + botón primario.

**Paginación**: Simple anterior/siguiente con conteo de páginas. `10 por página` por defecto, selector para `25`, `50`.

---

### VISTA 4 — Perfil del Paciente (`/patients/[id]`)

**Encabezado (sticky al hacer scroll)**:
```
← Volver a Pacientes

[Avatar grande — círculo de iniciales 56px]
María Rodríguez
34 años  ·  Nacimiento: 15 de marzo de 1991
📞 +52 55 1234  ·  ✉ maria@correo.com
                                [Editar] [⋯]
```
En móvil: avatar + nombre apilados, datos de contacto abajo, botón editar ancho completo.

**Pestañas** (sticky debajo del encabezado): `Resumen` `Historial` `Citas`

---

**Pestaña: Resumen**

Dos columnas en escritorio, apiladas en móvil.

Izquierda:
- **Tarjeta de Información del Paciente**: Dirección completa, género, contacto de emergencia, notas. Enlace "Editar" arriba a la derecha.
- **Tarjeta de Próxima Cita**: Fecha, hora, doctor, servicio. Acciones "Ver" y "Cancelar". Si no hay ninguna: "Sin citas próximas" + botón "Agendar ahora".

Derecha:
- **Tarjeta de Resumen de Visitas**: Total de visitas, primera visita, última visita, tratamiento más frecuente.
- **Tarjeta del Último Registro**: Fecha de visita más reciente + vista previa corta de notas de tratamiento. Enlace "Ver registro completo →".

---

**Pestaña: Historial**

Layout tipo línea de tiempo — más reciente primero.

Cada registro es una tarjeta de línea de tiempo:
```
│  12 de febrero de 2026
│  ┌────────────────────────────────────────┐
│  │ 🦷 Limpieza Dental + Obturación        │
│  │ Dra. Sarah Kim                         │
│  │                                        │
│  │ Diagnóstico: Caries en diente #14      │
│  │ Tratamiento: Restauración de composite │
│  │ Prescripciones: Ibuprofeno 400mg       │
│  │                                        │
│  │ Próxima visita: 12 mar 2026            │
│  │                             [Editar]  │
│  └────────────────────────────────────────┘
```
- Punto en línea de tiempo + conector de línea vertical entre registros
- Botón "Agregar Registro" arriba a la derecha

Estado vacío: "Sin registros clínicos aún. Documenta la primera visita de este paciente."

---

**Pestaña: Citas**

Lista simple (mismo estilo que la tabla de citas pero filtrada a este paciente). Incluye citas pasadas y futuras. Badges de estado visibles. Nombre del doctor por fila.

---

### VISTA 5 — Formulario Nuevo / Editar Paciente (`/patients/new`)

**Layout**: Centrado, max-width `640px`, tarjeta blanca.

**Encabezado**: Título "Nuevo Paciente" + subtexto "Completa la información del paciente a continuación."

**Secciones del Formulario**:

*Información Personal*
- Nombre Completo (requerido)
- Fecha de Nacimiento (date picker)
- Género (control segmentado: Masculino / Femenino / Otro)
- Teléfono (requerido)
- Correo Electrónico

*Dirección y Notas*
- Dirección (textarea, 2 filas)
- Notas Clínicas (textarea, 3 filas — "Alergias conocidas, condiciones o notas relevantes…")

**Pie del Formulario**:
- Cancelar (botón ghost) + Guardar Paciente (botón primario)
- En móvil: botones de ancho completo, apilados.

**Validación en línea**: Borde rojo + mensaje de error debajo del campo al perder el foco.

---

### VISTA 6 — Formulario Nuevo Registro Clínico (`/patients/[id]/records/new`)

**Layout**: Tarjeta centrada, max-width `680px`. Migas de pan: `Pacientes > María Rodríguez > Nuevo Registro`.

**Campos del Formulario**:
- Fecha de Visita (date picker, por defecto hoy)
- Diagnóstico (textarea, requerido — "Describe los hallazgos clínicos…")
- Notas de Tratamiento (textarea, requerido — "Describe los procedimientos realizados…")
- Prescripciones (textarea, opcional — "Nombre del medicamento, dosis, instrucciones…")
- Fecha de Próxima Visita (date picker, opcional)

**Pie**: Botones Cancelar + Guardar Registro.

---

### VISTA 7 — Lista de Citas (`/appointments`)

**Fila de Encabezado**:
- Izquierda: título "Citas" + conteo
- Derecha: botón "Nueva Cita"

**Toggle de Vista** (debajo del encabezado): `Lista` | `Calendario` — control segmentado, estado activo en azul cielo.

---

**Vista Lista**

**Fila de Filtros** (tipo chip, scroll horizontal en móvil):
`Todas` `Hoy` `Esta Semana` `Programadas` `Confirmadas` `Completadas` `Canceladas`

**Tabla (escritorio)**:
```
Paciente            | Doctor           | Fecha y Hora        | Servicio       | Duración | Estado       | Acciones
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────
María Rodríguez     | Dra. S. Kim      | 26 feb · 10:00 AM   | Limpieza       | 30 min   | ● Confirmada | [⋯]
Jorge Castellanos   | Dr. R. Torres    | 26 feb · 11:30 AM   | Obturación     | 45 min   | ● Programada | [⋯]
```

Menú desplegable de acciones (⋯):
- Confirmar
- Marcar como Completada
- Marcar como No Asistió
- Cancelar Cita
- Ver Paciente

**Lista de Tarjetas (móvil)**:
```
┌──────────────────────────────────────┐
│ 26 feb 2026 · 10:00 AM    30 min    │
│ María Rodríguez        ● Confirmada  │
│ Dra. Sarah Kim · Limpieza            │
│                               [⋯]   │
└──────────────────────────────────────┘
```

---

**Vista Calendario**

Cuadrícula mensual. Cada celda de día muestra:
- Puntos de color por cita (un punto por cita, coloreado por estado)
- Desbordamiento: `+3 más` en texto muted si hay más de 3 citas

Al hacer clic en un día se abre un **panel lateral** (escritorio) o **bottom sheet** (móvil) con la lista de citas de ese día en el mismo estilo de tarjeta de la lista.

Día actual: círculo de fondo azul cielo en el número de fecha.
Días con citas: indicador de punto sutil debajo del número.

---

### VISTA 8 — Formulario Nueva Cita (`/appointments/new`)

**Layout**: Tarjeta centrada, max-width `560px`.

**Encabezado**: "Agendar Cita" + subtexto "Programa una nueva cita para un paciente."

**Campos del Formulario**:

1. **Paciente** — Combobox buscable. Escribe para buscar por nombre o teléfono. Muestra avatar + nombre + teléfono en las opciones del dropdown. Enlace "¿Paciente nuevo?" al final del dropdown.

2. **Doctor** — Select desplegable. Muestra solo usuarios con rol = 'doctor'. Cada opción: iniciales de avatar + nombre.

3. **Fecha** — Date picker calendario. Deshabilita fechas pasadas.

4. **Hora** — Después de seleccionar la fecha, muestra los horarios disponibles como cuadrícula visual:
   ```
   [9:00 AM]  [9:30 AM]  [10:00 AM]  [10:30 AM]
   [11:00 AM] [11:30 AM] [─────────] [2:00 PM ]
                           OCUPADO
   ```
   Los horarios ocupados aparecen grises e inactivos. Los disponibles son chips seleccionables.

5. **Duración** — Select: 15 min / 30 min / 45 min / 60 min / 90 min

6. **Tipo de Servicio** — Select: Limpieza / Obturación / Endodoncia / Extracción / Blanqueamiento / Consulta / Otro

7. **Notas** — Textarea opcional

**Banner de Advertencia de Conflicto** (mostrado en línea si se detecta conflicto):
```
⚠ La Dra. Kim ya tiene una cita a las 10:00 AM en esta fecha.
  Por favor elige un horario diferente.
```
Fondo ámbar, borde ámbar, texto ámbar.

**Pie**: Botones Cancelar + Agendar Cita.

---

### VISTA 9 — Gestión de Usuarios — Administrador (`/admin/users`)

**Encabezado**: Título "Equipo" + badge de conteo de personal + botón "Invitar Usuario" (arriba a la derecha).

**Tabla (escritorio)**:
```
Avatar | Nombre               | Rol           | Correo               | Estado   | Ingreso    | Acciones
──────────────────────────────────────────────────────────────────────────────────────────────────────────
  SK   | Dra. Sarah Kim       | Doctor        | sarah@clinica.com    | Activo   | Ene 2025   | [Editar] [⋯]
  RT   | Dr. Ramón Torres     | Doctor        | ramon@clinica.com    | Activo   | Mar 2025   | [Editar] [⋯]
  LA   | Luis Aguilar         | Asistente     | luis@clinica.com     | Activo   | Jun 2025   | [Editar] [⋯]
  MJ   | Marta Jiménez        | Administrador | marta@clinica.com    | Activo   | Ene 2025   | [Editar] [⋯]
```

**Estado**: Punto verde "Activo" / Punto gris "Inactivo".
Filas inactivas: opacidad ligeramente atenuada (`opacity-60`).

**Lista de Tarjetas (móvil)**: Mismo patrón que pacientes — una tarjeta por usuario con badge de rol, punto de estado y menú de acciones.

---

**Invitar Usuario — Sheet deslizable (lado derecho en escritorio, bottom sheet en móvil)**:

Título: "Invitar Miembro del Equipo"
Subtexto: "Recibirá un correo para configurar su cuenta."

Campos:
- Nombre Completo
- Correo Electrónico
- Rol (select: Doctor / Asistente / Administrador)

Pie: Cancelar + "Enviar Invitación" (botón primario con ícono de sobre).

---

**Editar Usuario — Sheet deslizable**:

Título: "Editar [Nombre]"

Campos:
- Nombre Completo (editable)
- Rol (select)
- Toggle de estado: Activo / Inactivo (componente shadcn Switch)

Banner de advertencia al desactivar:
```
⚠ Desactivar este usuario le impedirá iniciar sesión.
  Sus registros y citas se conservarán.
```

Pie: Cancelar + Guardar Cambios.

---

## Resumen de Comportamiento Responsivo

| Elemento | Escritorio (≥1024px) | Tablet (768–1023px) | Móvil (<768px) |
|---|---|---|---|
| Sidebar | Completo (256px, siempre visible) | Solo íconos (64px) + drawer superpuesto | Barra de navegación inferior (4 tabs) |
| Tablas | Todas las columnas visibles | Ocultar columnas secundarias | Reemplazar con lista de tarjetas |
| Formularios | Tarjeta centrada, máx. 640px | Igual, ancho completo | Pantalla completa con botones sticky en pie |
| Stats del dashboard | Fila horizontal de 4 columnas | Cuadrícula 2×2 | Tira con scroll horizontal |
| Pestañas del perfil | Pestañas horizontales | Pestañas horizontales | Tira de pestañas con scroll |
| Calendario | Cuadrícula mensual + panel lateral | Cuadrícula mensual + bottom sheet | Solo vista semanal + bottom sheet |
| Sheets / Drawers | Desliza desde la derecha, 480px | Desliza desde la derecha, ancho completo | Sube desde abajo |
| Modales / Diálogos | Centrado, máx. 480px | Centrado, máx. 480px | Bottom sheet a pantalla completa |

---

## Microinteracciones y Animaciones

- **Transiciones de página**: Fade-in sutil (`opacity-0 → opacity-100`, `150ms ease-out`)
- **Tarjetas en hover**: `shadow-sm → shadow-md` + `translateY(-1px)`, `200ms ease`
- **Cambio de badge de estado**: Pulso de escala breve (`scale-95 → scale-100`) al actualizar el estado
- **Envío de formulario**: El botón muestra spinner, luego ícono de check en éxito antes de redirigir
- **Acciones en fila de tabla**: Menú desplegable entra con `scale-95 → scale-100`, `100ms`
- **Apertura de Sheet/Drawer**: Desliza desde la derecha/abajo, `250ms ease-out`, backdrop hace fade-in
- **Stats cards al cargar**: Fade-up escalonado (`translateY(8px) → translateY(0)`) con 50ms de retraso entre cada una
- **Notificaciones Toast**: Entra desde arriba-derecha (escritorio) o abajo (móvil), se descarta automáticamente a los 4s
- **Estados vacíos**: Animación de flotación sutil en la ilustración (`translateY -4px → +4px`, bucle de 3s)

---

## Estados Vacíos

Cada lista principal tiene un estado vacío contextual:

| Vista | Ilustración | Mensaje | CTA |
|---|---|---|---|
| Lista de Pacientes | Diente con ícono + | "Aún no hay pacientes" | Agregar Primer Paciente |
| Citas | Calendario con destellos | "No hay citas programadas" | Agendar Cita |
| Registros del Paciente | Portapapeles | "Sin registros para este paciente" | Agregar Primer Registro |
| Usuarios Admin | Persona con + | "Aún no hay miembros en el equipo" | Invitar Primer Miembro |

Las ilustraciones deben ser SVGs simples de un solo color en azul cielo (`#0EA5E9`) a `120px` de tamaño.

---

## Estados de Carga

- **Carga de página**: Skeleton screens (shadcn `Skeleton`) que coincidan exactamente con el layout del estado cargado
- **Skeleton de tabla**: 5 filas de barras shimmer que coincidan con los anchos de columna
- **Stats cards**: Rectángulos skeleton que coincidan con las dimensiones de las tarjetas
- **Perfil del paciente**: Círculo skeleton de avatar + 3 líneas skeleton de texto

---

## Notas de Accesibilidad

- Todos los elementos interactivos tienen anillo `:focus-visible` en azul cielo
- El color nunca es el único indicador — los badges de estado usan tanto color COMO etiqueta de texto
- Los errores de formulario son anunciados vía `aria-describedby`
- El nav del sidebar usa `aria-current="page"` en el enlace activo
- Los modales atrapan el foco y lo restauran al cerrarse
- Todos los botones de solo ícono tienen `aria-label`
- Tamaño mínimo de área táctil: `44×44px` en móvil

---

## Entregables Esperados de Sticht

Por favor diseña y entrega todas las siguientes pantallas:

1. **Inicio de Sesión** — estados por defecto, error y carga
2. **Panel Principal** — variante Doctor (escritorio + móvil)
3. **Panel Principal** — variante Administrador (solo escritorio, indicando diferencias)
4. **Lista de Pacientes** — tabla escritorio + lista de tarjetas móvil + estado vacío
5. **Perfil del Paciente** — las 3 pestañas (Resumen, Historial, Citas) en escritorio y móvil
6. **Formulario Nuevo Paciente** — estado por defecto + estado de error de validación
7. **Formulario Nuevo Registro Clínico**
8. **Citas — Vista Lista** — escritorio + móvil + estado vacío
9. **Citas — Vista Calendario** — escritorio + móvil
10. **Formulario Nueva Cita** — por defecto + estado de advertencia de conflicto + cuadrícula de horarios
11. **Gestión de Usuarios Admin** — tabla escritorio + tarjetas móvil
12. **Sheet Invitar Usuario**
13. **Sheet Editar Usuario** — incluida la advertencia de desactivación

Todas las pantallas deben entregarse en:
- **Móvil**: 390px de ancho (viewport iPhone 14)
- **Tablet**: 768px de ancho
- **Escritorio**: 1440px de ancho