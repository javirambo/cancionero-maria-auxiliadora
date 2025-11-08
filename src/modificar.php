<?php
session_start();
$validUser = $_SESSION["login"] === true;

require_once 'dbconnection.php';
require_once 'i-start.php';
inicio("Modificar canción");
if (!$validUser) die;

// busco la cancion:
$cancion = buscarCancion($_REQUEST['n']);
$cancion['letra'] = str_replace(array("<br>", "<b>", "</b>"), array("\n", "*", "*"), $cancion['letra']);

print '<div class="container">';
?>
<div class="ingreso">
  <h3 class="dom">Modificar canción</h3>
  <form action="save.php" method="post">
    <div class="form-group fm">
      <label for="numero">Número</label>
      <input class="form-control" type="number" id="numero" name="numero" value="<?php echo $cancion['numero'] ?>">
    </div>
    <div class="form-group fm">
      <label for="titulo">Título de la canción</label>
      <input type="text" class="form-control" id="titulo" name="titulo" value="<?php echo $cancion['titulo'] ?>">
    </div>
    <div class="form-group fm">
      <label for="grupo">Tipo de canción</label>
      <input type="text" class="form-control" id="grupo" name="grupo" value="<?php echo $cancion['grupo'] ?>">
    </div>
    <div class="form-group fm">
      <label for="letra">Letra</label>
      <textarea class="form-control" id="letra" name="letra" rows="18"><?php echo $cancion['letra'] ?></textarea>
    </div>
    <input type="hidden" name="update" value="1">
    <nav class="sticky-b">
      <button type="submit" class="btn btn-danger btn-sm">Guardar</button>
      <a class="btn btn-secondary btn-sm" href="index.php" role="button">Cancelar</a>
    </nav>
  </form>
  <br><br>
</div>
<?php
print '</div>';
require_once 'i-end.php';
