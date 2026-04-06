<?php
session_start();
$validUser = $_SESSION["login"] === true;

require_once 'i-start.php';
inicio("Cancionero María Auxiliadora");

require_once 'buscar.php';

print '<div class="container">';
require_once 'indice.php';
print '<hr>';
require_once 'grupos.php';
print '</div>';

require_once 'bottom.php';
require_once 'i-end.php';
