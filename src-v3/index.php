<?php
require_once 'i-start.php';
inicio("Cancionero María Auxiliadora");

$canciones = json_decode(file_get_contents(__DIR__ . '/canciones.json'), true);
?>
<div class="container text-center">
  <nav class="sticky-a">
    <form class="justify-content-center" action="cancion.php" method="get">
      <input type="text" class="form-control" name="n" placeholder="Busque por Número, nombre, letra">
      <button type="submit" class="btn btn-success mt-2">Buscar</button>
    </form>
  </nav>
  <div class="indice">
    <div style="display: inline-block; text-align: left;">
      <?php foreach ($canciones as $c): ?>
        <p><?php echo $c['numero'] . '. <a href="cancion.php?n=' . $c['numero'] . '">' . htmlspecialchars($c['titulo']) . '</a>' ?></p>
      <?php endforeach; ?>
    </div>
  </div>
</div>
<?php require_once 'i-end.php'; ?>
