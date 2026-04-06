<?php
session_start();
$validUser = $_SESSION["login"] === true;

require_once 'i-start.php';
inicio("Cancionero María Auxiliadora");

print '<div class="container">';
require_once 'indice.php';
print '</div>';

require_once 'buscar.php';

require_once 'i-end.php';
