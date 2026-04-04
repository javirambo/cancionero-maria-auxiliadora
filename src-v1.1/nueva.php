<?php
session_start();
$validUser = $_SESSION["login"] === true;

require_once 'dbconnection.php';
require_once 'i-start.php';
inicio("Nueva canción");

// busco un numero que no exista (el mayor+1) y lo voy a proponer (pero se puede cambiar) y OJO QUE NO SE REPITA!
$sql = 'SELECT MAX(Numero)+1 FROM Canciones';
$numero = 0;
foreach ($conn->query($sql) as $row)
  $numero = $row[0];

print '<div class="container">';
?>
<div class="ingreso">
  <h3 class="dom">Nueva canción</h3>
  <form action="save.php" method="post">
    <div class="form-group fm">
      <label for="numero">Número</label>
      <input class="form-control" type="number" id="numero" name="numero" value="<?php echo $numero; ?>">
    </div>
    <div class="form-group fm">
      <label for="titulo">Título de la canción</label>
      <input type="text" class="form-control" id="titulo" name="titulo" placeholder="Ingrese el nombre">
    </div>
    <div class="form-group fm">
      <label for="grupo">Tipo de canción</label>
      <input type="text" class="form-control" id="grupo" name="grupo" list="listaGrupos" placeholder="Coloque el tipo">
      <datalist id="listaGrupos">
        <?php
        global $conn;
        $sqlGrupos = 'SELECT grupo FROM Canciones GROUP BY grupo ORDER BY grupo';
        foreach ($conn->query($sqlGrupos) as $row) {
          echo '<option value="' . htmlspecialchars($row["grupo"]) . '">';
        }
        ?>
      </datalist>
    </div>
    <div class="form-group fm">
      <label for="letra">Letra</label>
      <textarea class="form-control" id="letra" name="letra" rows="18" placeholder="Letra de la canción / Puede colocar *para el estribillo* / Separe cada línea con ENTER y cada estrofa con dos ENTERS"></textarea>
    </div>
    <nav class="sticky-b">
      <button type="submit" class="btn btn-danger btn-sm">Guardar</button>
      <a class="btn btn-secondary btn-sm" href="index.php" role="button">Cancelar</a>
    </nav>
  </form>
  <br>
  <br>
</div>
<?php
print '</div>';
require_once 'i-end.php';
