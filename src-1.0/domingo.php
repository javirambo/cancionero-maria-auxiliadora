<?php
session_start();
$validUser = $_SESSION["login"] === true;

require_once 'dbconnection.php';
require_once 'i-start.php';
inicio("Cancionero de Domingo");

//--el form envia para guardar la lista:
if (!empty($_GET['add']))
  addCancionDomingo($_GET['add']);

//--se elimina una cancion de la lista? (parametro 'del')
if (!empty($_GET['del']))
  delCancionDomingo($_GET['del']);

// busco las canciones del domingo:
$lista = getListaDomingo();
print '<div class="container">';
?>
<h3 class="dom">Domingo</h3>
<div class="c1">
  <?php
  foreach ($lista as $nro) {
    $result = buscarCancion($nro); ?>
    <p>
      <a class="btn btn-primary c3" href="cancion.php?d=1&n=<?php echo $result["numero"] ?>" role="button"><?php echo $result["numero"] . '. ' . $result["titulo"]; ?> </a>
      <?php if ($validUser) { ?>
        <a class="btn btn-danger btn-sm borrar" href="domingo.php?del=<?php echo $result["numero"] ?>" role="button">X</a>
      <?php } ?>
    </p>
  <?php } ?>
</div>
<?php if ($validUser) { ?>
  <div class="f1">
    <form action="domingo.php" method="get">
      <input class="form-control" type="number" name="add" placeholder="Agregar canciones">
      <button type="submit" class="btn btn-danger mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5z" />
        </svg>
      </button>
    </form>
  </div>
<?php } ?>
<br>
<br>
<br>
<br>
<div class="btnctr"><a class="btn btn-warning" href="index.php" role="button">Volver</a></div>
</div>
<?php
print '</div>';
require_once 'i-end.php';
