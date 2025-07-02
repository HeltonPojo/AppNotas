<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\PastaModel;

class Pastas extends ResourceController
{
    public function __construct()
    {
        $this->model = new PastaModel();
    }

    private function getUsuarioFromToken()
    {
        $authHeader = $this->request->getHeaderLine("Authorization");
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return null;
        }

        $token = str_replace('Bearer ', '', $authHeader);

        try {
            $decoded = \Firebase\JWT\JWT::decode($token, new \Firebase\JWT\Key(env('JWT_SECRET'), 'HS256'));
            return (array) $decoded;
        } catch (\Exception $e) {
            return null;
        }
    }

    public function index()
    {

        // $usuario = $this->request->auth;
        $usuario = $this->getUsuarioFromToken();
        if (!$usuario) {
            return $this->failUnauthorized();
        }

        $res = $this->model->where('usuario_id', $usuario['uid'])->findAll();

        return $this->respond($res);
    }

    public function create()
    {
        $usuario = $this->getUsuarioFromToken();
        if (!$usuario) {
            return $this->failUnauthorized();
        }

        $data = $this->request->getJSON(true);
        $data['usuario_id'] = $usuario['uid'];

        $this->model->insert($data);
        return $this->respondCreated(['id' => $this->model->getInsertID()]);
    }

    public function update($id = null)
    {
        $usuario = $this->getUsuarioFromToken();
        if (!$usuario) {
            return $this->failUnauthorized();
        }

        $pasta = $this->model->find($id);
        if (!$pasta || $pasta['usuario_id'] != $usuario['uid']) {
            return $this->failNotFound("Pasta não encontrada ou acesso negado.");
        }

        $data = $this->request->getJSON(true);
        $this->model->update($id, $data);
        return $this->respond(['message' => 'Atualizada com sucesso']);
    }

    public function delete($id = null)
    {
        $usuario = $this->getUsuarioFromToken();
        if (!$usuario) {
            return $this->failUnauthorized();
        }

        $pasta = $this->model->find($id);
        if (!$pasta || $pasta['usuario_id'] != $usuario['uid']) {
            return $this->failNotFound("Pasta não encontrada ou acesso negado.");
        }
        $this->model->delete($id);

        return $this->respondDeleted(['message' => 'Deletada com sucesso']);
    }
}
