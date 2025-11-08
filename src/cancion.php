<?php
session_start();
$validUser = $_SESSION["login"] === true;

require_once 'dbconnection.php';
require_once 'i-start.php';
inicio("Cancionero");

// busco la cancion (viene asi: https://iset57.edu.ar/cancionero/cancion.php?n=56)    
// le agrego poder buscar por texto dentro de una cancion, 
// y buscará el texto en todas las canciones.
require_once 'dbconnection.php';
if(is_numeric($_REQUEST['n']))
  // es un numero de cancion:
  $result = buscarCancion($_REQUEST['n']);
else{
  // es un texto a buscar:
  $result = buscarCancionPorTexto($_REQUEST['n']);
  if(empty($result))
    echo "NO EXISTEN RESULTADOS";
  else{
    logSql("", $result);
    foreach ($result as $cancion) {
      echo '<b>'.$cancion["numero"].' - '.$cancion["titulo"].'</b><br>';
      echo '<small>'.$cancion["letra"].'</small>';
      echo '<hr>';
    }
  }
  die;
}
print '<div class="container">';
?>
<h3><?php echo $result['numero'] . '. ' . $result['titulo'] ?></h3>
<?php if(!empty($result['extras'] && $validUser)){
  print '<h5 class="extras">' . $result['extras'] . '</h5>';
}?>
<p><?php echo $result['letra'] ?></p>
<?php
// donde lleva el boton "volver"?
$url = $_REQUEST['d'] == '1' ? 'domingo.php' : 'index.php';
?>
<nav class="sticky-b">
  <a class="btn btn-warning btn-ssm" href="<?php echo $url ?>" role="button">Volver</a>
  <?php if ($validUser) { ?>
    <a class="btn btn-success btn-ssm btnedit" href="modificar.php?n=<?php echo $result['numero'] ?>" role="button">Modificar</a>
    <a class="btn btn-danger btn-ssm btnedit" onclick="validar()" role="button">Eliminar</a>
  <?php } ?>
</nav>
<script>
  function validar(){
    if(confirm("Elimina la canción?"))
    {
      //falta terminar
    }
  }
</script>
<?php
print '</div>';
require_once 'i-end.php';
