<?php
session_start();
$validUser = $_SESSION["login"] === true;

require_once 'dbconnection.php';

// verifico antes de generar HTML para poder redirigir:
$stmt = $conn->prepare("SELECT Titulo FROM Canciones WHERE Numero = :numero");
$stmt->execute([':numero' => $_POST['numero']]);
$existeCancion = $stmt->rowCount() == 1;

$letra = htmlentities($_POST['letra'], ENT_QUOTES, 'UTF-8');
$titulo = htmlentities($_POST['titulo'], ENT_QUOTES, 'UTF-8');
$grupo = htmlentities($_POST['grupo'], ENT_QUOTES, 'UTF-8');

// si es update exitoso, redirigir a la cancion:
if (!empty($titulo) && !empty($letra) && !empty($_POST['update']) && $existeCancion) {
  $stmt = $conn->prepare("REPLACE `Canciones` SET `Numero` = :numero, `Titulo` = :titulo, `Letra` = :letra, `Grupo` = :grupo");
  $stmt->execute([':numero' => $_POST['numero'], ':titulo' => $titulo, ':letra' => $letra, ':grupo' => $grupo]);

  header("Location: cancion.php?n=" . intval($_POST['numero']) . "&saved=1");
  exit;
}

// para los demas casos, mostrar pagina normal:
require_once 'i-start.php';
inicio("Grabar Cancionero");

print '<div class="container">';

if (empty($titulo)) {
  echo '<h2>La canción no tiene título. Coloque un título a la canción</h2>';
} elseif (empty($letra)) {
  echo '<h2>La canción no tiene letra. Trate de ingresar la letra</h2>';
} elseif ($existeCancion) {
  echo '<h2>La canción ' . htmlspecialchars($_POST['numero']) . ' ya existe!</h2>';
  echo 'Intente con otro número o con el número asignado automáticamente.';
} else {
  $stmt = $conn->prepare("INSERT INTO `Canciones` (`Numero`, `Titulo`, `Letra`, `Grupo`) VALUES (:numero, :titulo, :letra, :grupo)");
  $stmt->execute([':numero' => $_POST['numero'], ':titulo' => $titulo, ':letra' => $letra, ':grupo' => $grupo]);

  echo "<h2>Canción " . htmlspecialchars($_POST['numero']) . " guardada!</h2>";
}

print '</div>';
require_once 'buscar.php';
require_once 'i-end.php';
