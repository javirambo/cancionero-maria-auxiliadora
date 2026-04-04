<?php
require_once 'dbconnection.php';
function inicio($titulo, $nroCancion = null){
print '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>'.$titulo.'</title>
  <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
  <link rel="stylesheet" href="def.css?v=4">
  <link rel="manifest" href="manifest.json">
  <link rel="apple-touch-icon" href="icon-192.png">
  <meta name="theme-color" content="#1a6bbf">
</head>
<body>
<script>
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}
</script>
<div class="c4'.($nroCancion !== null ? ' c4-mini' : '').'">
  <a href="index.php"><img src="'.($nroCancion !== null ? 'cancionero-xs.png' : 'cancionero2.png').'" style="width: 100%"></a>
</div>
<div class="menu-wrap'.($nroCancion !== null ? ' menu-wrap-mini' : '').'">
  <button class="hamburger-btn" onclick="document.getElementById(\'hambMenu\').classList.toggle(\'open\')">&#9776;</button>
  <div id="hambMenu" class="hamb-menu">';

global $validUser;
print '<a href="domingo.php" class="hamb-green">'.htmlspecialchars(getTituloDomingo()).'</a>';
if ($validUser) {
    print '<a href="nueva.php">Nueva canción</a>';
    if ($nroCancion !== null) {
        print '<a href="modificar.php?n='.$nroCancion.'">Modificar</a>';
        print '<a href="#" class="hamb-red" onclick="if(confirm(\'Elimina la canción?\')) location.href=\'eliminar.php?n='.$nroCancion.'\'">Eliminar</a>';
    }
    print '<a href="backup.php">Backup</a>
        <a href="logout.php" class="hamb-gray">Logout</a>';
} else {
    print '<a href="login.php">Login</a>';
}

print '<hr class="hamb-sep">';
global $conn;
if ($conn) {
    $sql = 'SELECT grupo FROM Canciones GROUP BY grupo';
    foreach ($conn->query($sql) as $row) {
        print '<a href="index.php?g='.urlencode($row["grupo"]).'" class="hamb-grupo">'.$row["grupo"].'</a>';
    }
    print '<a href="index.php" class="hamb-todas">Todas</a>';
}

print '  </div>
</div>
<script>
document.addEventListener("click", function(e) {
  var menu = document.getElementById("hambMenu");
  var btn = document.querySelector(".hamburger-btn");
  if (menu && btn && !menu.contains(e.target) && !btn.contains(e.target)) {
    menu.classList.remove("open");
  }
});
</script>';
}

