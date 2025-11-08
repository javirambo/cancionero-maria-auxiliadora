<?php
session_start();
$errorMsg = "";
$validUser = $_SESSION["login"] === true;
if (isset($_POST["sub"])) {
  $validUser = strcasecmp($_POST["usuario"], "Coro2021") == 0;
  if (!$validUser) $errorMsg = "ACCESO INCORRECTO!";
  else $_SESSION["login"] = true;
}
if ($validUser) {
  header("Location: index.php");
  die();
}

require_once 'i-start.php';
inicio("Modificar canción");
?>
<div class="logi">
  <h3 class="bg-primary text-white ok">Ingreso al Cancionero</h3>
  <form action="" method="post">
    <input class="form-control" type="text" name="usuario" placeholder="clave de acceso">
    <div class="error"><?= $errorMsg ?></div>
    <br>
    <button type="submit" class="btn btn-success mb-2" name="sub">OK</button>
  </form>
</div>
<?php
require_once 'i-end.php';
