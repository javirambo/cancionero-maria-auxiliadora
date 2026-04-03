<?php
session_start();
$validUser = $_SESSION["login"] === true;

require_once 'dbconnection.php';
require_once 'i-start.php';
inicio("Grabar Cancionero");
//header('Content-type:text/html; charset=utf-8');

print '<div class="container">';

// verifico que no exista el numero de la cancion:
$result = $conn->query("SELECT Titulo FROM Canciones WHERE Numero='" . $_POST['numero'] . "'");

$letra = htmlentities($_POST['letra'], ENT_QUOTES, 'UTF-8');
$titulo = htmlentities($_POST['titulo'], ENT_QUOTES, 'UTF-8');
$grupo = $_POST['grupo'];

if (empty($titulo)) {
  echo '<h2>La canción no tiene título. Coloque un título a la canción</h2>';
} elseif (empty($letra)) {
  echo '<h2>La canción no tiene letra. Trate de ingresar la letra</h2>';
} elseif (!empty($_POST['update']) && $result->rowCount() == 1) {

  $sql = "REPLACE `Canciones` SET `Numero`='" . $_POST['numero'] . "',`Titulo`='" . $titulo . "',`Letra`='" . $letra . "',`Grupo`='" . $grupo . "'";
  logSql("Update sql:", $sql);
  $conn->query($sql);

  echo "<h2>Canción " . $_POST['numero'] . " modificada correctamente!</h2>";
  echo '<p></p>';
  echo '<p><a class="btn btn-primary" href="index.php" role="button">Volver</a></p>';
} elseif ($result->rowCount() == 1) {

  echo '<h2>La canción ' . $_POST['numero'] . ' ya existe!</h2>';
  echo 'Intente con otro número o con el número asignado automáticamente.';
} else {

  $sql = "INSERT INTO `Canciones` (`Numero`, `Titulo`, `Letra`, `Grupo`) VALUES ('" . $_POST['numero'] . "', '" . $titulo . "', '" . $letra . "', '" . $grupo . "')";
  logSql("insert sql:", $sql);
  $conn->query($sql);

  echo "<h2>Canción " . $_POST['numero'] . " guardada!</h2>";
  echo '<p></p>';
  echo '<p><a class="btn btn-primary" href="index.php" role="button">Volver</a></p>';
}

print '</div>';
require_once 'i-end.php';
