<?php
//--------------------------------------------------
// ESTE ES EL INDICE DE TODAS LAS CANCIONES,
// QUE SE MUESTRA AL INICIAR LA PAGINA CON INDEX.PHP
//--------------------------------------------------

require_once 'dbconnection.php';

// busco las canciones de un grupo (o todas)
$grupo = isset($_GET['g']) ? $_GET['g'] : '';
if (!empty($grupo)) {
  $stmt = $conn->prepare('SELECT numero,titulo FROM Canciones WHERE Grupo = :grupo');
  $stmt->execute([':grupo' => $grupo]);
} else {
  $stmt = $conn->query('SELECT numero,titulo FROM Canciones');
}

print '<div class="indice">';
foreach ($stmt as $row) {
  print '<p>' . htmlspecialchars($row["numero"]) . '. <a href="cancion.php?n='. htmlspecialchars($row["numero"]) .'">' . htmlspecialchars($row["titulo"]) . "</a></p>";
}
print '</div>';
