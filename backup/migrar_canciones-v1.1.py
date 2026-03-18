#!/usr/bin/env python3
"""
Convierte el backup JSON de la versión 1.x del cancionero al formato JSON de la versión 3.

El archivo de entrada es el generado por backup.php:
  [{"numero": 1, "titulo": "...", "letra": "...", "grupo": "..."}, ...]

El archivo de salida tiene el mismo formato que el generado por migrar_canciones-v3.py:
  [{"numero": 1, "titulo": "...", "letra": "..."}, ...]

Uso:
    python3 migrar_canciones-v1.1.py <entrada.json> <salida.json>

Ejemplo:
    python3 migrar_canciones-v1.1.py canciones-backup-2026-03-18.json canciones.json
"""

import json
import sys
import html


def main():
    if len(sys.argv) != 3 or sys.argv[1] in ("-h", "--help"):
        print(__doc__)
        sys.exit(0 if sys.argv[1:] in (["-h"], ["--help"]) else 1)

    input_file = sys.argv[1]
    output_file = sys.argv[2]

    with open(input_file, "r", encoding="utf-8") as f:
        source = json.load(f)

    canciones = []
    for c in source:
        canciones.append({
            "numero": int(c["numero"]),
            "titulo": html.unescape(c["titulo"]),
            "letra":  html.unescape(c["letra"]),
        })

    canciones.sort(key=lambda x: x["numero"])

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(canciones, f, ensure_ascii=False, indent=2)

    print(f"OK: {len(canciones)} canciones exportadas a {output_file}")


if __name__ == "__main__":
    main()
