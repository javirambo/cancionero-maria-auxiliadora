# Cancionero Maria Auxiliadora

Cancionero liturgico con letras de canciones para la misa. Pensado para uso desde el celular.

## Caracteristicas

- **Sin base de datos**: todas las canciones estan en un archivo JSON (`canciones.json`)
- **PWA instalable**: se puede instalar en el celular como una app (Android, iPhone, PC)
- **Funciona offline**: usa service worker para cachear los archivos y funcionar sin conexion
- **Busqueda**: por numero, titulo o texto de la letra
- **Mobile-first**: disenado para pantallas chicas con Bootstrap 4

## Estructura del proyecto

```
src/
  index.php          # Pagina principal (buscador + listado + vista de cancion)
  canciones.json     # Datos de todas las canciones (~427)
  def.css            # Estilos
  manifest.json      # Configuracion PWA
  service-worker.js  # Cache offline
  icon-192.png       # Icono PWA
  icon-512.png       # Icono PWA
backup/
  cancionero-completo.sql   # Backup historico de la base MySQL
  migrar_canciones-v3.py    # Script para regenerar canciones.json desde backup SQL
```

## Deploy en un servidor

### Requisitos

- Servidor web con PHP 8.0+ (Apache, Nginx, XAMPP, etc.)
- No requiere base de datos ni credenciales

### Pasos

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/javierrambaldo/cancionero-maria-auxiliadora.git
   ```
2. Apuntar el servidor web a la carpeta `src/`
3. Abrir `index.php` en el navegador

### Ejemplo con Apache (XAMPP)

```bash
# Copiar src/ al directorio de Apache
cp -r src/ /opt/lampp/htdocs/cancionero/
# Abrir http://localhost/cancionero/
```

### Ejemplo con PHP built-in server (para testear rapido)

```bash
cd src/
php -S localhost:8000
# Abrir http://localhost:8000
```

## Testear en local

La forma mas rapida de probar el cancionero:

```bash
cd src/
php -S localhost:8000
```

Abrir http://localhost:8000 en el navegador. Funciona todo: busqueda, vista de canciones, etc.

> **Nota sobre PWA/offline:** El service worker solo funciona en HTTPS o en `localhost`. Si testeas con el servidor built-in de PHP en localhost, la PWA se registra correctamente.

## Regenerar canciones.json

Si tenes un backup SQL nuevo y queres actualizar las canciones:

```bash
cd backup/
python3 migrar_canciones-v3.py
```

Esto genera `src/canciones.json` a partir del backup SQL.

## Historial de versiones

- **V1**: PHP + MySQL, permite editar online
- **V1.1**: PHP + MySQL con PWA
- **V2**: Next.js + Turso (SQLite)
- **V3** (actual): PHP sin base de datos, todo en JSON, PWA offline

## Licencia

El **código fuente** (PHP y JavaScript) de este proyecto se distribuye bajo la licencia **MIT**.

```
MIT License

Copyright (c) 2026 Javier Rambaldo.

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

© 2026 Javier Rambaldo. Proyecto abierto y de acceso publico.
