<?php
session_start();
if ($_SESSION["login"] !== true) {
    http_response_code(403);
    exit('Acceso denegado');
}

require_once 'dbconnection.php';

$sql = 'SELECT numero, titulo, letra, grupo FROM Canciones ORDER BY numero';
$canciones = [];
foreach ($conn->query($sql) as $row) {
    $canciones[] = [
        'numero' => (int)$row['numero'],
        'titulo' => $row['titulo'],
        'letra'  => $row['letra'],
        'grupo'  => $row['grupo'],
    ];
}

$filename = 'canciones-backup-' . date('Y-m-d') . '.json';
header('Content-Type: application/json; charset=utf-8');
header('Content-Disposition: attachment; filename="' . $filename . '"');
echo json_encode($canciones, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
