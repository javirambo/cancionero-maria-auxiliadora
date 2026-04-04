<?php
require_once 'dbconfig.php';

error_reporting(E_ALL);
ini_set('error_reporting', E_ALL);
ini_set('display_errors', false); // true para debug

// --------------------------------------------------------------------
try {
    $conn = new PDO("mysql:host=$servername;dbname=$database", $username, $password);
    //echo "Connected to $database at $servername successfully.";
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
function paragrafizar($string = "")
{
    // normalizamos los saltos de línea
    $string = str_replace(array("\r\n", "\r"), "\n", $string);
    // creamos un array de parrafos
    $strParrafos = explode("\n", $string);
    // abrimos tag, deconstruimos el array, cerramos tag
    $string = '<p>' . implode("</p>\n<p>", $strParrafos) . '</p>';
    return $string;
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
    $sql = 'SELECT numero,titulo,letra,grupo,extras FROM Canciones WHERE numero=' . $numero;
    logSql("cancion:", $sql);

    $array = array(
        "numero" => $numero,
        "titulo" => "",
        "grupo" => "",
        "letra" => "",
        "extras" => ""
    );

    foreach ($conn->query($sql) as $row) {
        $array["grupo"] = $row["grupo"];
        $array["titulo"] = $row["titulo"];
        $array["extras"] = $row["extras"];
        //-- reemplazo \n por <br>
        //-- y * por <b>
        $array["letra"] = boldizar($row["letra"]);
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
    $sql = "SELECT numero,titulo,letra FROM Canciones WHERE $tituloExpr LIKE '%$text%' OR $letraExpr LIKE '%$text%'";
    logSql("canciones1:", $sql);

    $canciones = array();
    foreach ($conn->query($sql) as $row) {
        $cancion = array(
            "numero" => $row["numero"],
            "titulo" => $row["titulo"],
            "letra" => boldizar($row["letra"])
        );
        array_push($canciones, $cancion);
    }
    return $canciones;
}
//--------------------------------------------------------------------
// titulo personalizado del domingo:
function getTituloDomingo() {
  global $conn;
  $sql = "SELECT Valor FROM Configuraciones WHERE Clave='domingo_titulo'";
  $titulo = "Misa de hoy";
  foreach ($conn->query($sql) as $row)
    $titulo = $row['Valor'];
  return $titulo;
}
//--------------------------------------------------------------------
function setTituloDomingo($titulo) {
  global $conn;
  $titulo = trim($titulo);
  if ($titulo === '') $titulo = 'Misa de hoy';
  $sql = "REPLACE Configuraciones SET Clave='domingo_titulo', Valor='" . addslashes($titulo) . "'";
  $conn->query($sql);
}
//--------------------------------------------------------------------
function setOrdenDomingo($orden) {
  global $conn;
  $str = trim($orden);
  $sql = "REPLACE Configuraciones SET Clave='domingo', Valor='" . addslashes($str) . "'";
  $conn->query($sql);
}
//--------------------------------------------------------------------
// lista de canciones del domingo:
function getListaDomingo() {
  global $conn;
  $sql = "SELECT Valor FROM Configuraciones where Clave='domingo'";
  $lista = "";
  foreach ($conn->query($sql) as $row)
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
  $sql = "REPLACE Configuraciones SET Clave='domingo', Valor='" . $str . "'";
  $conn->query($sql);
}
//--------------------------------------------------------------------
// elimina una cancion de la lista del domingo:
function delCancionDomingo($item) {
  global $conn;
  $lista = getListaDomingo();
  $str = implode(" ", array_diff($lista, array($item)));  
  $sql = "REPLACE Configuraciones SET Clave='domingo', Valor='" . $str . "'";
  $conn->query($sql);
}
//--------------------------------------------------------------------