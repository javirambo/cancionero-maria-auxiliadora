# Tablas

# Tabla Canciones
- Es la única tabla del cancionero.

## `Numero` int NOT NULL
- Número de la canción e índice de la tabla.

## `Titulo` text (importante que sea utf8, porque se rompen los acentos)
- Titulo de la cancion (a veces con el autor)

## `Letra` text (idem titulo)
- Letra de la canción completa. Los ** son para identificar el estribillo. Resaltan el texto entre *.

## `Grupo` varchar(200) 
- Es el nombre en donde se ubican canciones para asociarlas entre si, (estan asociadas a un tipo o grupo de canciones)

## `Extras` varchar(500)
- no se usa (quitar).

# Tabla Configuraciones
- Es un simple diccionario que cada conjunto de datos tiene su clave.

# `Clave` varchar(100)
- Nombre de la clave a buscar en el diccionario.

# `Valor` text 
- Contenido del diccionario.


# Búsquedas
- Se usa un único campo para buscar número de la canción o parte de la letra o el título.
- El resultado muestra todas las canciones que coincidan.


# Domingo
- Se agrupan canciones bajo una mini-play list
- Cada cancion agregada al "Domingo" agrega su número a una lista de números.
- En configuraciones se guarda el diccionario de los domingos, asi:
   'domingo' => '20 12 30'
- (son simples arrays de PHP donde meto o saco numeros y luego se guarda en la tabla)
