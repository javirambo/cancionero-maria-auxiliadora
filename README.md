# Cancionero María Auxiliadora

Sitio web para organizar canciones de música católica litúrgica.  
Incluye buscador, letras, acordes, transposición de tonos, y gestión de playlist para el domingo.

## Características

- Búsqueda de canciones por título, letra o número.
- Visualización de letras con acordes y transposición de tonos.
- Organización por categorías litúrgicas (Entrada, Comunión, María, etc.).
- Playlist del domingo con drag & drop para reordenar.
- Integración con Gemini AI para formateo de letras y acordes.
- Login de administrador para agregar, editar y eliminar canciones.
- Diseño mobile-first con Tailwind CSS.

## Stack técnico (v2)

- **Framework**: Next.js 16 (App Router, React 19, Server Actions)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS 4
- **Base de datos**: SQLite via [Turso](https://turso.tech) (libSQL)
- **ORM**: Prisma con adapter libSQL
- **Deploy**: Vercel
- **IA**: Google Gemini API (formateo de acordes)

## Desarrollo local

### Requisitos

- Node.js 18+
- npm

### Instalación

```bash
git clone https://github.com/javierrambaldo/cancionero-maria-auxiliadora.git
cd cancionero-maria-auxiliadora/next-app
npm install
```

### Variables de entorno

Crear un archivo `.env` en `next-app/` con:

```env
DATABASE_URL="libsql://tu-db.turso.io"
TURSO_AUTH_TOKEN="tu-token-de-turso"
ADMIN_PASSWORD="tu-password-admin"
GEMINI_API_KEY="tu-api-key-de-gemini"
```

### Ejecutar

```bash
npm run dev
```

La app se abre en [http://localhost:3000](http://localhost:3000).

### Build de producción

```bash
npm run build
npm start
```

> `npm run build` ejecuta `prisma generate && next build` automáticamente.

## Deploy a Vercel

1. Importar el repositorio en [vercel.com](https://vercel.com).
2. Configurar el **Root Directory** como `next-app`.
3. Agregar las variables de entorno en Settings > Environment Variables:
   - `DATABASE_URL`
   - `TURSO_AUTH_TOKEN`
   - `ADMIN_PASSWORD`
   - `GEMINI_API_KEY`
4. Vercel detecta Next.js automáticamente y ejecuta `npm run build`.
5. Cada push a la branch configurada hace deploy automático.

## Estructura del proyecto (next-app)

```
next-app/
├── src/
│   ├── app/
│   │   ├── page.tsx            # Página principal (búsqueda, índice, grupos)
│   │   ├── actions.ts          # Server Actions (CRUD canciones, domingo, login)
│   │   ├── cancion/[id]/       # Vista de canción individual
│   │   ├── domingo/            # Playlist del domingo
│   │   ├── nueva/              # Formulario nueva canción
│   │   └── login/              # Login de administrador
│   ├── components/             # Componentes React
│   │   ├── SongView.tsx        # Vista de canción con acordes
│   │   ├── TransposableLyrics  # Letras con transposición
│   │   ├── SongForm.tsx        # Formulario de canción
│   │   ├── SearchInput.tsx     # Buscador
│   │   ├── BottomBar.tsx       # Barra inferior de navegación
│   │   └── ...
│   └── lib/
│       ├── prisma.ts           # Cliente Prisma (singleton)
│       └── utils.ts            # Utilidades
├── prisma/
│   ├── schema.prisma           # Esquema de base de datos
│   ├── migrations/             # Migraciones
│   ├── seed.ts                 # Seed de datos
│   └── dev.db                  # Base de datos local SQLite
└── package.json
```

## Versiones anteriores (PHP)

Las versiones anteriores en PHP se conservan como referencia histórica:

- **v1 / v1.1** (`src/`, `src-v1.1/`): App PHP con MySQL, edición online, PWA.
- **v3** (`src-v3/`): Versión offline sin base de datos (todo en JSON/PHP).

## Licencia

El **código fuente** (PHP y JavaScript) de este proyecto se distribuye bajo la licencia **MIT**.

```
MIT License

Copyright (c) 2025 Javier Rambaldo.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

> ⚠️ **Importante:** Las **letras, acordes y partituras** incluidas en este proyecto **no están cubiertas** por esta licencia MIT.  
> Pertenecen a sus respectivos autores y editoriales. Su inclusión es únicamente con fines educativos o litúrgicos.

## Contribuciones

Las contribuciones son bienvenidas.  
Podés enviar *pull requests* con mejoras o nuevas funcionalidades.  
Antes de hacerlo, asegurate de que el código siga el formato y la estructura actual.

---

© 2025 Javier Rambaldo. Proyecto abierto y de acceso público.
