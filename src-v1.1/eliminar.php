<?php
session_start();
$validUser = $_SESSION["login"] === true;

require_once 'dbconnection.php';

if (!$validUser || empty($_REQUEST['n']) || !is_numeric($_REQUEST['n'])) {
    header("Location: index.php");
    exit;
}

$numero = intval($_REQUEST['n']);
$sql = "DELETE FROM Canciones WHERE numero = " . $numero;
$conn->exec($sql);

header("Location: index.php");
exit;