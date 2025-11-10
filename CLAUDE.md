# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a PHP-based Catholic song catalog (Cancionero María Auxiliadora) for browsing, searching, and managing liturgical songs. The application is designed for mobile-first access and includes lyrics, chords, and liturgical organization.

## Database Structure

The application uses MySQL with two main tables:

### Canciones (Songs)
- `Numero` (int, NOT NULL): Song number and table index
- `Titulo` (text, utf8): Song title, sometimes includes author
- `Letra` (text, utf8): Full song lyrics. Use `*text*` for bold sections (chorus/estribillo)
- `Grupo` (varchar 200): Category/type of song (ENTRADA, COMUNION, MARIA, etc.)
- `Extras` (varchar 500): Unused field, can be removed

### Configuraciones (Configuration)
- Simple key-value dictionary
- `Clave` (varchar 100): Configuration key
- `Valor` (text): Configuration value
- Used for storing "domingo" playlist as space-separated song numbers (e.g., "20 12 30")

## Architecture

### Entry Points and Flow
- [index.php](src/index.php): Main page with search, song index, and groups
- [cancion.php](src/cancion.php): Displays individual song or search results
- [domingo.php](src/domingo.php): Manages Sunday playlist
- [nueva.php](src/nueva.php): Form for creating new songs
- [modificar.php](src/modificar.php): Form for editing existing songs
- [save.php](src/save.php): Handles song save operations

### Core Components
- [dbconfig.php](src/dbconfig.php): Database credentials (NEVER commit real credentials)
- [dbconnection.php](src/dbconnection.php): PDO connection and utility functions
- [i-start.php](src/i-start.php): HTML header and page initialization
- [i-end.php](src/i-end.php): HTML footer
- [def.css](src/def.css): Main stylesheet

### Authentication
- Session-based login system via [login.php](src/login.php) / [logout.php](src/logout.php)
- `$_SESSION["login"] === true` gates admin features (add/edit/delete songs)
- All admin pages check `$validUser` variable

## Key Functions (dbconnection.php)

- `buscarCancion($numero)`: Fetches song by number, returns array with numero/titulo/letra/grupo/extras
- `buscarCancionPorTexto($text)`: Searches songs by text in titulo or letra, returns array of matches
- `boldizar($string)`: Converts `*text*` to `<b>text</b>` and newlines to `<br>`
- `paragrafizar($string)`: Converts newlines to `<p>` tags
- `getListaDomingo()`: Returns array of song numbers for Sunday playlist
- `addCancionDomingo($canciones)`: Adds songs to Sunday playlist (space/comma/dash separated)
- `delCancionDomingo($item)`: Removes song from Sunday playlist

## Song Categories (Grupos)

Songs are organized into liturgical categories:
- ENTRADA, PERDON, GLORIA, ALELUYA, OFRENDAS, SANTO, COMUNION
- ACCION DE GRACIAS / ADORACION, DESPEDIDA
- MARIA, SALMOS Y CANTICOS
- ADVIENTO, NAVIDAD, CUARESMA, PASCUA
- ESPIRITU SANTO, ALABANZA / ANIMACION
- OTROS

## Text Formatting Conventions

- `*estribillo*` in lyrics marks chorus text (displayed bold)
- Single `\n` separates lines within stanza
- Double `\n\n` separates stanzas
- All text must be UTF-8 to preserve Spanish accents

## Search Functionality

- [buscar.php](src/buscar.php) provides unified search
- Accepts song number OR text fragment
- Searches across both `titulo` and `letra` fields
- Returns all matching songs

## Database Files

- [backup/cancionero-completo.sql](backup/cancionero-completo.sql): Full database backup with data
- [backup/cancionero-struct.sql](backup/cancionero-struct.sql): Database structure only

## Security Notes

- SQL queries use string concatenation (vulnerable to SQL injection)
- When modifying queries, migrate to prepared statements with parameter binding
- [dbconfig.php](src/dbconfig.php) contains hardcoded credentials - use environment variables in production
- Display errors are disabled in production (`display_errors = false`)

## Development Setup

1. Configure Apache/Nginx with PHP 8.0+
2. Import database from [backup/cancionero-completo.sql](backup/cancionero-completo.sql)
3. Update credentials in [dbconfig.php](src/dbconfig.php)
4. Ensure UTF-8 charset for database and PHP
5. Point web server to `src/` directory

## Code Style

- Spanish naming conventions for domain logic (canciones, letras, grupos)
- Inline PHP with HTML templates
- Bootstrap CSS classes for styling
- Session management for authentication state
