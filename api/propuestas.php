<?php

require __DIR__ . '/helpers.php';

$iniciales = require __DIR__ . '/data/propuestas-iniciales.php';
$archivo = __DIR__ . '/data/propuestas.json';

function leerNuevas($archivo) {
    if (!file_exists($archivo)) {
        return [];
    }

    $datos = json_decode(file_get_contents($archivo), true);
    return is_array($datos) ? $datos : [];
}

$metodo = $_SERVER['REQUEST_METHOD'];

if ($metodo === 'GET') {
    $propuestas = array_merge($iniciales, leerNuevas($archivo));

    if (isset($_GET['id'])) {
        $id = filter_var($_GET['id'], FILTER_VALIDATE_INT);

        foreach ($propuestas as $propuesta) {
            if ($id !== false && $propuesta['id'] === $id) {
                responder($propuesta);
            }
        }

        responder(['error' => 'Propuesta no encontrada.'], 404);
    }

    responder($propuestas);
}

if ($metodo !== 'POST') {
    responder(['error' => 'Método no permitido.'], 405);
}

$entrada = json_decode(file_get_contents('php://input'), true);

if (!is_array($entrada)) {
    responder(['error' => 'Debes enviar un JSON válido.'], 422);
}

$tema = trim($entrada['tema'] ?? '');
$descripcion = trim($entrada['descripcion'] ?? '');

if (strlen($tema) < 3 || strlen($tema) > 80) {
    responder(['error' => 'El tema debe tener entre 3 y 80 caracteres.'], 422);
}

if (strlen($descripcion) < 10 || strlen($descripcion) > 500) {
    responder(['error' => 'La descripción debe tener entre 10 y 500 caracteres.'], 422);
}

$fp = fopen($archivo, 'c+');

if (!$fp || !flock($fp, LOCK_EX)) {
    responder(['error' => 'No se pudo guardar la propuesta.'], 500);
}

rewind($fp);
$contenido = stream_get_contents($fp);
$nuevas = json_decode($contenido, true);

if (!is_array($nuevas)) {
    $nuevas = [];
}

$ids = array_column(array_merge($iniciales, $nuevas), 'id');
$idNuevo = max($ids ?: [0]) + 1;

$propuesta = [
    'id' => $idNuevo,
    'tema' => $tema,
    'descripcion' => $descripcion,
    'fecha' => date('Y-m-d')
];

$nuevas[] = $propuesta;

rewind($fp);
ftruncate($fp, 0);

$resultado = fwrite(
    $fp,
    json_encode($nuevas, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
);

fflush($fp);
flock($fp, LOCK_UN);
fclose($fp);

if ($resultado === false) {
    responder(['error' => 'No se pudo guardar la propuesta.'], 500);
}

responder($propuesta, 201);
