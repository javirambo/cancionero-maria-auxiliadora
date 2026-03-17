#!/usr/bin/env python3
"""
Migra canciones desde el backup SQL de Turso a un archivo JSON plano.
El campo 'letra' en el backup es un array JSON de objetos {"c": "acorde", "l": "linea"}.
Este script extrae solo el texto (campo "l") y genera un JSON con numero, titulo y letra.

Uso:
    python3 migrar_canciones.py <backup.sql> <salida.json>

Argumentos:
    backup.sql    Ruta al archivo SQL de backup (ej: ../backup/backup-turso-2026-03-02.sql)
    salida.json   Ruta donde se guardará el JSON generado (ej: canciones.json)

Ejemplo:
    python3 migrar_canciones.py ../backup/backup-turso-2026-03-02.sql canciones.json
"""

import re
import json
import sys


def extract_string_value(s, pos):
    """
    Extrae un string delimitado por comillas simples desde la posicion pos.
    Maneja escapes de comilla simple ('').
    Retorna (valor, nueva_posicion).
    """
    assert s[pos] == "'", f"Esperaba comilla simple en pos {pos}, encontré: {s[pos]!r}"
    pos += 1
    result = []
    while pos < len(s):
        ch = s[pos]
        if ch == "'":
            # comilla escapada ''
            if pos + 1 < len(s) and s[pos + 1] == "'":
                result.append("'")
                pos += 2
            else:
                # fin del string
                pos += 1
                break
        elif ch == "\\":
            next_ch = s[pos + 1] if pos + 1 < len(s) else ""
            if next_ch == "n":
                result.append("\n")
            elif next_ch == "t":
                result.append("\t")
            elif next_ch == "\\":
                result.append("\\")
            elif next_ch == "'":
                result.append("'")
            else:
                result.append(next_ch)
            pos += 2
        else:
            result.append(ch)
            pos += 1
    return "".join(result), pos


def parse_insert(line):
    """
    Parsea una linea INSERT INTO Canciones (id, titulo, letra, grupo, extras) VALUES (...)
    Retorna dict con id, titulo, letra, grupo, extras o None si no se pudo parsear.
    """
    # Buscar el VALUES (
    m = re.match(r"INSERT INTO Canciones \(id, titulo, letra, grupo, extras\) VALUES \(", line)
    if not m:
        return None

    pos = m.end()

    # id (entero)
    m2 = re.match(r"(\d+), ", line[pos:])
    if not m2:
        return None
    song_id = int(m2.group(1))
    pos += m2.end()

    # titulo (string)
    titulo, pos = extract_string_value(line, pos)
    assert line[pos] == ",", f"Esperaba ',' después de titulo en pos {pos}"
    pos += 2  # skip ", "

    # letra (string)
    letra_raw, pos = extract_string_value(line, pos)
    assert line[pos] == ",", f"Esperaba ',' después de letra en pos {pos}"
    pos += 2  # skip ", "

    # grupo (string o NULL)
    if line[pos:pos+4] == "NULL":
        grupo = ""
        pos += 4
    else:
        grupo, pos = extract_string_value(line, pos)

    return {
        "id": song_id,
        "titulo": titulo,
        "letra_raw": letra_raw,
        "grupo": grupo,
    }


def convert_letra(letra_raw):
    """
    Convierte el campo letra (JSON array de {"c": ..., "l": ...}) a texto plano.
    Solo extrae el campo "l" (letra), ignorando "c" (acordes).
    Preserva líneas vacías como separadores de estrofa.
    Preserva el marcado *texto* para estribillos.
    """
    try:
        lines = json.loads(letra_raw)
        text_lines = [item.get("l", "") for item in lines]
        return "\n".join(text_lines)
    except (json.JSONDecodeError, TypeError):
        # Si no es JSON válido, devolver como está
        return letra_raw


def main():
    if len(sys.argv) != 3 or sys.argv[1] in ("-h", "--help"):
        print(__doc__)
        sys.exit(0 if sys.argv[1:] in (["-h"], ["--help"]) else 1)

    backup_file = sys.argv[1]
    output_file = sys.argv[2]

    canciones = []

    with open(backup_file, "r", encoding="utf-8") as f:
        for line_num, line in enumerate(f, 1):
            line = line.strip()
            if not line.startswith("INSERT INTO Canciones"):
                continue
            result = parse_insert(line)
            if result is None:
                print(f"[WARN] No se pudo parsear línea {line_num}")
                continue

            letra_texto = convert_letra(result["letra_raw"])

            canciones.append({
                "numero": result["id"],
                "titulo": result["titulo"],
                "letra": letra_texto,
            })

    # Ordenar por numero
    canciones.sort(key=lambda x: x["numero"])

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(canciones, f, ensure_ascii=False, indent=2)

    print(f"OK: {len(canciones)} canciones exportadas a {output_file}")


if __name__ == "__main__":
    main()
