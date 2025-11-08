<?php
print '<nav class="sticky-b">
    <a class="btn btn-secondary btn-ssm" href="domingo.php" role="button">Misa de hoy</a>';
if ($validUser) {
    print '<a class="btn btn-success btn-ssm" href="nueva.php" role="button">Nueva canción</a>
        <a class="btn btn-danger btn-ssm" href="logout.php" role="button">Logout</a>';
} else {
    print '<a class="btn btn-success btn-ssm" href="login.php" role="button">Login</a>';
}
print '</nav>';
