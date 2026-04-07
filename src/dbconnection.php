<?php
require_once 'dbconfig.php';

error_reporting(E_ALL);
ini_set('error_reporting', E_ALL);
ini_set('display_errors', false);

// --------------------------------------------------------------------
try {
    $conn = new PDO("mysql:host=$servername;dbname=$database", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $pe) {
    die("Could not connect to the database $database :" . $pe->getMessage());
}

// --------------------------------------------------------------------
function logSql($title, $sql)
{
    if (empty($_SESSION["login"])) return;
    echo <<<HTML


<!-- {$title} {$sql}
-->


HTML;
}

// --------------------------------------------------------------------
// primera parte *estribillo* resto
function boldizar($string = "")
{
    $chars =  str_split($string);
    $result = "";
    $first = true;
    foreach ($chars as $ch) {
        if ($ch == "*" && $first) {
            $result .= "<b>";
            $first = false;
        } else if ($ch == "*" && !$first) {
            $result .= "</b>";
            $first = true;
        } else {
            $result .= $ch;
        }
    }
    return str_replace(array("\r\n", "\r"), "<br>", $result);
}
//--------------------------------------------------------------------
// busco la cancion
function buscarCancion($numero)
{
    global $conn;
    $stmt = $conn->prepare('SELECT numero,titulo,letra,grupo,extras FROM Canciones WHERE numero = :numero');
    $stmt->execute([':numero' => $numero]);

    $array = array(
        "numero" => $numero,
        "titulo" => "",
        "grupo" => "",
        "letra" => "",
        "extras" => ""
    );

    foreach ($stmt as $row) {
        $array["grupo"] = $row["grupo"];
        $array["titulo"] = html_entity_decode($row["titulo"], ENT_QUOTES, 'UTF-8');
        $array["extras"] = $row["extras"];
        $array["letra"] = boldizar(html_entity_decode($row["letra"], ENT_QUOTES, 'UTF-8'));
    }
    return $array;
}
//--------------------------------------------------------------------
// busco el texto dentro de todas las canciones:
function buscarCancionPorTexto($text)
{
    global $conn;

    // normalizo entidades HTML en MySQL con REPLACE para comparar sin acentos
    $entidades = array(
        '&aacute;'=>'a', '&eacute;'=>'e', '&iacute;'=>'i', '&oacute;'=>'o',
        '&uacute;'=>'u', '&ntilde;'=>'n', '&uuml;'=>'u', '&ldquo;'=>'"', '&rdquo;'=>'"',
        '&Aacute;'=>'A', '&Eacute;'=>'E', '&Iacute;'=>'I', '&Oacute;'=>'O',
        '&Uacute;'=>'U', '&Ntilde;'=>'N', '&Uuml;'=>'U'
    );
    // construyo REPLACE anidados para titulo y letra
    $tituloExpr = 'titulo';
    $letraExpr = 'letra';
    foreach ($entidades as $ent => $char) {
        $tituloExpr = "REPLACE($tituloExpr, '$ent', '$char')";
        $letraExpr = "REPLACE($letraExpr, '$ent', '$char')";
    }
    $like = '%' . $text . '%';
    $sql = "SELECT numero,titulo,letra FROM Canciones WHERE $tituloExpr LIKE :t OR $letraExpr LIKE :l";
    $stmt = $conn->prepare($sql);
    $stmt->execute([':t' => $like, ':l' => $like]);

    $canciones = array();
    foreach ($stmt as $row) {
        $cancion = array(
            "numero" => $row["numero"],
            "titulo" => html_entity_decode($row["titulo"], ENT_QUOTES, 'UTF-8'),
            "letra" => boldizar(html_entity_decode($row["letra"], ENT_QUOTES, 'UTF-8'))
        );
        array_push($canciones, $cancion);
    }
    return $canciones;
}
//--------------------------------------------------------------------
// titulo personalizado del domingo:
function getTituloDomingo() {
  global $conn;
  $stmt = $conn->prepare("SELECT Valor FROM Configuraciones WHERE Clave = :clave");
  $stmt->execute([':clave' => 'domingo_titulo']);
  $titulo = "Misa de hoy";
  foreach ($stmt as $row)
    $titulo = $row['Valor'];
  return $titulo;
}
//--------------------------------------------------------------------
function setTituloDomingo($titulo) {
  global $conn;
  $titulo = trim($titulo);
  if ($titulo === '') $titulo = 'Misa de hoy';
  $stmt = $conn->prepare("REPLACE Configuraciones SET Clave='domingo_titulo', Valor = :valor");
  $stmt->execute([':valor' => $titulo]);
}
//--------------------------------------------------------------------
function setOrdenDomingo($orden) {
  global $conn;
  $str = trim($orden);
  $stmt = $conn->prepare("REPLACE Configuraciones SET Clave='domingo', Valor = :valor");
  $stmt->execute([':valor' => $str]);
}
//--------------------------------------------------------------------
// lista de canciones del domingo:
function getListaDomingo() {
  global $conn;
  $stmt = $conn->prepare("SELECT Valor FROM Configuraciones WHERE Clave = :clave");
  $stmt->execute([':clave' => 'domingo']);
  $lista = "";
  foreach ($stmt as $row)
  	$lista = explode(" ", $row['Valor']);
  return $lista;
}
//--------------------------------------------------------------------
//--graba una cancion o string de canciones (separados por espacios)
function addCancionDomingo($canciones) {
  global $conn;
  // merge
  $str = implode(" ", getListaDomingo())." ".$canciones;
  // dejo solo separacion con espacios
  $str = str_replace(array(',', '-', '/'), ' ', $str);
  // quito doble espacios
  $str = trim(preg_replace('/( ){2,}/u', ' ', $str));
  // transformo a array sin repetidos
  $cans = array_unique(explode(" ", $str));
  // vuelvo a string
  $str = implode(" ", $cans);
  $stmt = $conn->prepare("REPLACE Configuraciones SET Clave='domingo', Valor = :valor");
  $stmt->execute([':valor' => $str]);
}
//--------------------------------------------------------------------
// elimina una cancion de la lista del domingo:
function delCancionDomingo($item) {
  global $conn;
  $lista = getListaDomingo();
  $str = implode(" ", array_diff($lista, array($item)));
  $stmt = $conn->prepare("REPLACE Configuraciones SET Clave='domingo', Valor = :valor");
  $stmt->execute([':valor' => $str]);
}
//--------------------------------------------------------------------
// lista de grupos existentes:
function getGrupos() {
  global $conn;
  $sql = 'SELECT grupo FROM Canciones GROUP BY grupo ORDER BY grupo';
  $grupos = array();
  foreach ($conn->query($sql) as $row) {
    $grupos[] = $row["grupo"];
  }
  return $grupos;
}
//--------------------------------------------------------------------
