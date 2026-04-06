<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#1a6bbf">
  <title>Cancionero María Auxiliadora</title>
  <link rel="manifest" href="manifest.json">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
  <link rel="stylesheet" href="def.css">
</head>
<body>
<div class="c4" style="position: relative;">
  <a href="index.php" style="text-decoration: none;"><h1 style="color: #1a6bbf; text-align: center; padding: 12px 0 8px 0;">Cancionero María Auxiliadora</h1></a>
  <button onclick="document.getElementById('menu-instalar').classList.toggle('d-none')"
          style="position: absolute; top: 12px; right: 8px; background: none; border: none; font-size: 1.5rem; cursor: pointer;">&#9776;</button>
</div>

<div id="menu-instalar" class="d-none" style="background: #f0f6ff; border: 1px solid #c0d8f0; border-radius: 6px; margin: 8px; padding: 16px;">
  <h5 style="color: #1a6bbf;">&#128242; Instalar en tu celular</h5>
  <p><strong>Android (Chrome):</strong><br>
    Tocá el menú ⋮ → <em>"Instalar app"</em> o <em>"Agregar a pantalla de inicio"</em>
  </p>
  <p><strong>iPhone / iPad (Safari):</strong><br>
    Tocá el botón compartir ↑ → <em>"Añadir a pantalla de inicio"</em><br>
    <small style="color:#888;">⚠️ Debe usarse Safari, no Chrome</small>
  </p>
  <p style="margin-bottom:0;"><strong>PC / Mac (Chrome):</strong><br>
    Hacé clic en el ícono ⊕ que aparece en la barra de direcciones
  </p>
</div>

<?php
$canciones = json_decode(file_get_contents(__DIR__ . '/canciones.json'), true);

function boldizar($texto) {
    $texto = preg_replace('/\*([^*]+)\*/', '<b>$1</b>', $texto);
    return nl2br($texto);
}

$n = $_REQUEST['n'] ?? '';

if ($n !== '') {
    // Vista de canción o resultados de búsqueda
    if (is_numeric($n)) {
        $cancion = null;
        foreach ($canciones as $c) {
            if ($c['numero'] == (int)$n) { $cancion = $c; break; }
        }
        if (!$cancion) {
            echo '<div class="container"><p>Canción no encontrada.</p></div>';
        } else {
            echo '<div class="container">';
            echo '<h3>' . $cancion['numero'] . '. ' . htmlspecialchars($cancion['titulo']) . '</h3>';
            echo '<p>' . boldizar($cancion['letra']) . '</p>';
            echo '</div>';
        }
    } else {
        $busqueda = $n;
        $resultados = array_filter($canciones, function($c) use ($busqueda) {
            return mb_stripos($c['titulo'], $busqueda) !== false || mb_stripos($c['letra'], $busqueda) !== false;
        });
        echo '<div class="container">';
        if (empty($resultados)) {
            echo '<p>NO EXISTEN RESULTADOS</p>';
        } else {
            foreach ($resultados as $c) {
                echo '<b>' . $c['numero'] . ' - ' . htmlspecialchars($c['titulo']) . '</b><br>';
                echo '<small>' . htmlspecialchars(mb_substr($c['letra'], 0, 200)) . '...</small>';
                echo '<br><a class="btn btn-sm btn-outline-primary mb-2 mt-1" href="?n=' . $c['numero'] . '">Ver letra</a>';
                echo '<hr>';
            }
        }
        echo '</div>';
    }
    echo '<nav class="sticky-b text-center"><a class="btn btn-warning btn-ssm" href="index.php" role="button">Volver</a></nav>';

} else {
    // Vista principal: buscador + listado
    ?>
    <div class="container text-center">
      <nav class="sticky-a">
        <form action="index.php" method="get">
          <input type="text" class="form-control" name="n" placeholder="Busque por Número, nombre, letra">
          <button type="submit" class="btn btn-success mt-2">Buscar</button>
        </form>
      </nav>
      <div class="indice">
        <div style="display: inline-block; text-align: left;">
          <?php foreach ($canciones as $c): ?>
            <p><?php echo $c['numero'] . '. <a href="?n=' . $c['numero'] . '">' . htmlspecialchars($c['titulo']) . '</a>' ?></p>
          <?php endforeach; ?>
        </div>
      </div>
    </div>
    <?php
}
?>
<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js');
  }
</script>
</body></html>
