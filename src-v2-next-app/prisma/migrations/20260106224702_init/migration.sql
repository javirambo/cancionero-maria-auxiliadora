-- CreateTable
CREATE TABLE "Canciones" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "letra" TEXT NOT NULL,
    "grupo" TEXT,
    "extras" TEXT
);

-- CreateTable
CREATE TABLE "Configuraciones" (
    "clave" TEXT NOT NULL PRIMARY KEY,
    "valor" TEXT NOT NULL
);
