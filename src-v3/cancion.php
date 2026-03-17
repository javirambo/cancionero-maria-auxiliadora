<?php
require_once 'i-start.php';
inicio("Cancionero");

$canciones = json_decode(file_get_contents(__DIR__ . '/canciones.json'), true);

function boldizar($texto) {
    // *texto* → <b>texto</b>
    $texto = preg_replace('/\*([^*]+)\*/', '<b>$1</b>', $texto);
    // saltos de linea → <br>
    $texto = nl2br($texto);
    return $texto;
}

$n = $_REQUEST['n'] ?? '';

if (is_numeric($n)) {
    // Buscar por numero
    $cancion = null;
    foreach ($canciones as $c) {
        if ($c['numero'] == (int)$n) {
            $cancion = $c;
            break;
        }
    }
    if (!$cancion) {
        echo '<div class="container"><p>Canción no encontrada.</p></div>';
        require_once 'i-end.php';
        exit;
    }
    ?>
    <div class="container">
      <h3><?php echo $cancion['numero'] . '. ' . htmlspecialchars($cancion['titulo']) ?></h3>
      <p><?php echo boldizar($cancion['letra']) ?></p>
    </div>
    <nav class="sticky-b text-center">
      <a class="btn btn-warning btn-ssm" href="index.php" role="button">Volver</a>
    </nav>
    <?php
} else {
    // Buscar por texto
    $resultados = [];
    $busqueda = mb_strtolower($n);
    foreach ($canciones as $c) {
        if (mb_stripos($c['titulo'], $busqueda) !== false || mb_stripos($c['letra'], $busqueda) !== false) {
            $resultados[] = $c;
        }
    }
    echo '<div class="container">';
    if (empty($resultados)) {
        echo '<p>NO EXISTEN RESULTADOS</p>';
    } else {
        foreach ($resultados as $c) {
            echo '<b>' . $c['numero'] . ' - ' . htmlspecialchars($c['titulo']) . '</b><br>';
            $preview = htmlspecialchars(mb_substr(strip_tags($c['letra']), 0, 200));
            echo '<small>' . $preview . '...</small>';
            echo '<br><a class="btn btn-sm btn-outline-primary mb-2 mt-1" href="cancion.php?n=' . $c['numero'] . '">Ver letra</a>';
            echo '<hr>';
        }
    }
    echo '</div>';
    echo '<nav class="sticky-b"><a class="btn btn-warning btn-ssm" href="index.php" role="button">Volver</a></nav>';
}

require_once 'i-end.php';
