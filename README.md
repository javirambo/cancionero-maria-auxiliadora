# Cancionero María Auxiliadora

Sitio web para buscar, ver y gestionar canciones de música católica para uso litúrgico.  
Adaptado para dispositivos móviles.

## Características

- Listado y búsqueda de canciones por título, texto o número.
- Organización por categorías litúrgicas (Entrada, Comunión, María, etc.).
- Playlist de domingo para organizar las canciones de la misa.
- Visualización de letras con marcado de estribillos en negrita.
- Sistema de login para administración (agregar, editar, eliminar canciones).
- Diseño mobile-first con Bootstrap.

## Tecnología

- **PHP 8.0+** con HTML inline
- **MySQL** (PDO)
- **Bootstrap CSS**
- Sesiones PHP para autenticación

## Estructura

```
src/
├── index.php          # Página principal con búsqueda e índice
├── cancion.php        # Vista de canción individual
├── buscar.php         # Búsqueda por número o texto
├── domingo.php        # Gestión de playlist dominical
├── nueva.php          # Formulario para nueva canción
├── modificar.php      # Formulario para editar canción
├── save.php           # Guardado de canciones
├── eliminar.php       # Eliminación de canciones
├── login.php          # Autenticación
├── logout.php         # Cierre de sesión
├── dbconfig.php       # Credenciales de base de datos
├── dbconnection.php   # Conexión PDO y funciones utilitarias
├── i-start.php        # Header HTML
├── i-end.php          # Footer HTML
├── bottom.php         # Barra inferior
├── grupos.php         # Listado por categorías
├── indice.php         # Índice de canciones
├── backup.php         # Exportación de backup
└── def.css            # Estilos
```

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/javierrambaldo/cancionero-maria-auxiliadora.git
   ```
2. Importar la base de datos desde `backup/cancionero-completo.sql`.
3. Configurar credenciales en `src/dbconfig.php`.
4. Apuntar el servidor web (Apache/Nginx) al directorio `src/`.
5. Asegurar charset UTF-8 en base de datos y PHP.

## Licencia

El **código fuente** (PHP y JavaScript) se distribuye bajo la licencia **MIT**.

> **Importante:** Las **letras y acordes** incluidos en este proyecto **no están cubiertos** por la licencia MIT.  
> Pertenecen a sus respectivos autores y editoriales. Su inclusión es únicamente con fines litúrgicos.

---

© 2025 Javier Rambaldo
