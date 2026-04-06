<?php
//--------------------------------------------------
// ESTE ES EL INDICE DE TODAS LAS CANCIONES,
// QUE SE MUESTRA AL INICIAR LA PAGINA CON INDEX.PHP
//--------------------------------------------------

require_once 'dbconnection.php';

// busco las canciones de un grupo (o todas)
$sql = 'SELECT numero,titulo FROM Canciones';
$grupo = $_REQUEST['g'];
if (!empty($grupo))
  $sql .= (" WHERE Grupo='" . $grupo . "'");
logSql("cancion:", $sql);

print '<div class="indice">';
foreach ($conn->query($sql) as $row) {
  print '<p>' . $row["numero"] . '. <a href="cancion.php?n='. $row["numero"] .'">' . $row["titulo"] . "</a></p>";
}
print '</div>';
