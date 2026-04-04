<?php
session_start();
$validUser = $_SESSION["login"] === true;

require_once 'dbconnection.php';
require_once 'i-start.php';
inicio("Cancionero de Domingo");

//--guardar titulo editado:
if (!empty($_GET['titulo']) && $validUser)
  setTituloDomingo($_GET['titulo']);

//--guardar nuevo orden:
if (!empty($_GET['orden']) && $validUser)
  setOrdenDomingo($_GET['orden']);

//--el form envia para guardar la lista:
if (!empty($_GET['add']))
  addCancionDomingo($_GET['add']);

//--se elimina una cancion de la lista? (parametro 'del')
if (!empty($_GET['del']))
  delCancionDomingo($_GET['del']);

// busco las canciones del domingo:
$lista = getListaDomingo();
$tituloDomingo = getTituloDomingo();
print '<div class="container">';
?>
<h3 class="dom">
  <span id="domingoTitulo" <?php if ($validUser) { ?>onclick="editarTitulo()" style="cursor:pointer;"<?php } ?>><?php echo htmlspecialchars($tituloDomingo); ?></span>
  <?php if ($validUser) { ?>
    <span id="editBtn" onclick="editarTitulo()" style="cursor:pointer;margin-left:8px;font-size:0.7em;">&#9998;</span>
    <form id="tituloForm" action="domingo.php" method="get" style="display:none;margin-top:5px;">
      <div style="display:flex;gap:5px;align-items:center;">
        <input class="form-control" type="text" name="titulo" value="<?php echo htmlspecialchars($tituloDomingo); ?>" style="flex:1;">
        <button type="submit" class="btn btn-success btn-sm">OK</button>
        <button type="button" class="btn btn-secondary btn-sm" onclick="cancelarEdicion()">X</button>
      </div>
    </form>
  <?php } ?>
</h3>
<script>
function editarTitulo() {
  document.getElementById('domingoTitulo').style.display = 'none';
  document.getElementById('editBtn').style.display = 'none';
  document.getElementById('tituloForm').style.display = 'block';
}
function cancelarEdicion() {
  document.getElementById('domingoTitulo').style.display = '';
  document.getElementById('editBtn').style.display = '';
  document.getElementById('tituloForm').style.display = 'none';
}
</script>
<?php if ($validUser) { ?>
  <div class="f1">
    <form action="domingo.php" method="get">
      <input class="form-control" type="number" name="add" placeholder="Agregar cancion numero">
      <button type="submit" class="btn btn-danger mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5z" />
        </svg>
      </button>
    </form>
  </div>
<?php } ?>
<div class="c1" id="listaCanciones">
  <?php
  foreach ($lista as $nro) {
    $result = buscarCancion($nro); ?>
    <div class="dom-item" data-nro="<?php echo $result["numero"] ?>" <?php if ($validUser) { ?>draggable="true"<?php } ?>>
      <?php if ($validUser) { ?>
        <span class="drag-handle">&#9776;</span>
      <?php } ?>
      <a class="btn btn-primary c3" href="cancion.php?d=1&n=<?php echo $result["numero"] ?>" role="button"><?php echo $result["numero"] . '. ' . $result["titulo"]; ?> </a>
      <?php if ($validUser) { ?>
        <a class="borrar" href="domingo.php?del=<?php echo $result["numero"] ?>">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#dc3545" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H5.5l1-1h3l1 1H13.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
          </svg>
        </a>
      <?php } ?>
    </div>
  <?php } ?>
</div>
<?php if ($validUser) { ?>
<script>
(function() {
  var list = document.getElementById('listaCanciones');
  var dragged = null;
  var touchStartY = 0;
  var placeholder = document.createElement('div');
  placeholder.className = 'dom-item-placeholder';

  // --- Desktop drag & drop ---
  list.addEventListener('dragstart', function(e) {
    var item = e.target.closest('.dom-item');
    if (!item) return;
    dragged = item;
    setTimeout(function() { item.style.opacity = '0.4'; }, 0);
    e.dataTransfer.effectAllowed = 'move';
  });
  list.addEventListener('dragend', function(e) {
    if (dragged) dragged.style.opacity = '';
    dragged = null;
    if (placeholder.parentNode) placeholder.parentNode.removeChild(placeholder);
  });
  list.addEventListener('dragover', function(e) {
    e.preventDefault();
    var target = e.target.closest('.dom-item');
    if (!target || target === dragged || target === placeholder) return;
    var rect = target.getBoundingClientRect();
    var mid = rect.top + rect.height / 2;
    if (e.clientY < mid) {
      list.insertBefore(placeholder, target);
    } else {
      list.insertBefore(placeholder, target.nextSibling);
    }
  });
  list.addEventListener('drop', function(e) {
    e.preventDefault();
    if (dragged && placeholder.parentNode) {
      list.insertBefore(dragged, placeholder);
      placeholder.parentNode.removeChild(placeholder);
      guardarOrden();
    }
  });

  // --- Touch drag & drop (móvil) ---
  list.addEventListener('touchstart', function(e) {
    var handle = e.target.closest('.drag-handle');
    if (!handle) return;
    dragged = handle.closest('.dom-item');
    touchStartY = e.touches[0].clientY;
    dragged.style.opacity = '0.4';
  }, {passive: true});

  list.addEventListener('touchmove', function(e) {
    if (!dragged) return;
    e.preventDefault();
    var touchY = e.touches[0].clientY;
    var items = list.querySelectorAll('.dom-item');
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (item === dragged) continue;
      var rect = item.getBoundingClientRect();
      var mid = rect.top + rect.height / 2;
      if (touchY > rect.top && touchY < rect.bottom) {
        if (touchY < mid) {
          list.insertBefore(dragged, item);
        } else {
          list.insertBefore(dragged, item.nextSibling);
        }
        break;
      }
    }
  }, {passive: false});

  list.addEventListener('touchend', function(e) {
    if (!dragged) return;
    dragged.style.opacity = '';
    guardarOrden();
    dragged = null;
  });

  function guardarOrden() {
    var items = list.querySelectorAll('.dom-item');
    var orden = [];
    for (var i = 0; i < items.length; i++) {
      orden.push(items[i].getAttribute('data-nro'));
    }
    window.location.href = 'domingo.php?orden=' + orden.join(' ');
  }
})();
</script>
<?php } ?>
<br>
<br>
<br>
<br>
<div class="btnctr"><a class="btn btn-warning" href="index.php" role="button">Volver</a></div>
</div>
<?php
print '</div>';
require_once 'i-end.php';
