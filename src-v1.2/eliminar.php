<?php
session_start();
$validUser = $_SESSION["login"] === true;

require_once 'dbconnection.php';

if (!$validUser || empty($_REQUEST['n']) || !is_numeric($_REQUEST['n'])) {
    header("Location: index.php");
    exit;
}

$numero = intval($_REQUEST['n']);
$stmt = $conn->prepare("DELETE FROM Canciones WHERE numero = :numero");
$stmt->execute([':numero' => $numero]);

header("Location: index.php");
exit;
