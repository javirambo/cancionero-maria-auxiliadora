<?php
session_start();
$validUser = $_SESSION["login"] === true;

require_once 'dbconnection.php';
require_once 'i-start.php';

// busco la cancion (viene asi: https://iset57.edu.ar/cancionero/cancion.php?n=56)
// le agrego poder buscar por texto dentro de una cancion,
// y buscará el texto en todas las canciones.
if(is_numeric($_REQUEST['n'])){
  // es un numero de cancion:
  $result = buscarCancion($_REQUEST['n']);
  inicio("Cancionero", $result['numero']);
}else{
  inicio("Cancionero", 0);
  // es un texto a buscar:
  $result = buscarCancionPorTexto($_REQUEST['n']);
  if(empty($result))
    echo "NO EXISTEN RESULTADOS";
  else{
    echo '<div class="container" style="margin-top:30px">';
    foreach ($result as $cancion) {
      echo '<a href="cancion.php?n='.htmlspecialchars($cancion["numero"]).'"><b>'.htmlspecialchars($cancion["numero"]).' - '.htmlspecialchars($cancion["titulo"]).'</b></a><br>';
      echo '<small>'.$cancion["letra"].'</small>';
      echo '<hr>';
    }
    echo '</div>';
  }
  require_once 'buscar.php';
  require_once 'i-end.php';
  die;
}
print '<div class="container">';
if (!empty($_GET['saved'])) {
  echo '<div class="alert alert-success" role="alert">Canción ' . htmlspecialchars($result['numero']) . ' modificada correctamente!</div>';
}
?>
<h3><?php echo htmlspecialchars($result['numero']) . '. ' . htmlspecialchars($result['titulo']) ?></h3>
<?php if(!empty($result['extras'] && $validUser)){
  print '<h5 class="extras">' . htmlspecialchars($result['extras']) . '</h5>';
}?>
<p><?php echo $result['letra'] ?></p>
<?php
print '</div>';
require_once 'buscar.php';
require_once 'i-end.php';
