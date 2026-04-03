<?php
require_once 'dbconnection.php';

$sql = 'SELECT grupo FROM Canciones GROUP BY grupo';

print '<div class="grupos">';
foreach ($conn->query($sql) as $row) {
  print '<a class="btn btn-primary" href="index.php?g=' .$row["grupo"]. '" role="button">' . $row["grupo"] . '</a>';
}
print '<a class="btn btn-warning" href="index.php" role="button">Todas</a>';
print '</div>';
