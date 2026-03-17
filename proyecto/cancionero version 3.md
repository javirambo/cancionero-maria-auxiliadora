# Cancionero V3

*Marzo 2026*

Version PHP sin base de datos (all-in-one) para que sea rápido y que se pueda cachear en dispositivos.

---

## Objetivo

Crear una versión de solo lectura del cancionero que funcione sin base de datos MySQL. Las canciones se cargan desde un archivo JSON estático, lo que permite:

- Uso offline / local por los fieles
- Sin dependencia de conexiones externas
- Base para una futura migración a app móvil

**No incluye:** edición, eliminación, login, acordes, grupos, "Misa de hoy".

---

## Arquitectura

### Datos: `src-v3/canciones.json`

Archivo JSON plano generado desde el backup de la base de datos. Contiene 427 canciones con esta estructura:

```json
[
  {
    "numero": 1,
    "titulo": "Abba Padre",
    "letra": "El Señor, el Señor ya está aquí\n...\n*Abba Padre, venga tu Reino*"
  },
  ...
]
```

- `numero`: ID de la canción (entero)
- `titulo`: Nombre de la canción
- `letra`: Texto completo. Las líneas vacías separan estrofas. El marcado `*texto*` indica estribillos (se muestra en negrita).

### Páginas PHP: `src-v3/`

| Archivo | Rol |
|---------|-----|
| `index.php` | Página principal: H1 azul + buscador + lista completa de canciones |
| `cancion.php` | Muestra letra de una canción o resultados de búsqueda por texto |
| `i-start.php` | Header HTML: Bootstrap + CSS + H1 azul "Cancionero María Auxiliadora" |
| `i-end.php` | Footer HTML (`</body></html>`) |
| `def.css` | Estilos (copiado de `src/`) |
| `canciones.json` | Datos de todas las canciones |

Los archivos de `src/` (versión con base de datos) no se modificaron.

---

## Flujo de la app

```
index.php
  └── [H1 azul] Cancionero María Auxiliadora
  └── [Input] Busque por Número, nombre, letra  →  cancion.php?n={texto}
  └── [Lista] 1. Abba Padre / 2. Vienen con alegría / ...  →  cancion.php?n={numero}

cancion.php?n=1          (búsqueda por número)
  └── Muestra título + letra formateada
  └── Botón [Volver]

cancion.php?n=aleluya    (búsqueda por texto)
  └── Lista de canciones que contienen "aleluya" en título o letra
  └── Preview de 200 caracteres + botón [Ver letra]
  └── Botón [Volver]
```

---

## Migración de datos

**Script:** `tmp/migrar_canciones.py`

El backup `backup/backup-turso-2026-03-02.sql` guarda las letras en formato JSON array:

```json
[{"c": "acorde", "l": "texto de línea"}, {"c": "", "l": ""}, ...]
```

El script Python:
1. Parsea cada `INSERT INTO Canciones` del SQL
2. Extrae `id`, `titulo` y `letra` (ignora `grupo` y `extras`)
3. Convierte el array JSON de letra: une todos los valores `l` con `\n`
4. Preserva líneas vacías (separadores de estrofa) y el marcado `*estribillo*`
5. Genera `src-v3/canciones.json` con `numero`, `titulo`, `letra`

Para regenerar el JSON:
```bash
python3 migrar_canciones.py
```

---

## Formateo de letras en PHP

`cancion.php` aplica la función `boldizar()` antes de mostrar la letra:
- `*texto*` → `<b>texto</b>` (estribillos en negrita)
- `\n` → `<br>` (saltos de línea con `nl2br()`)

---

## Cómo usar

1. Apuntar el servidor web (Apache/Nginx con PHP 8+) a la carpeta `src-v3/`
2. Acceder a `index.php` en el navegador
3. Para regenerar canciones desde un nuevo backup: ejecutar `tmp/migrar_canciones.py`

No requiere base de datos ni credenciales.
