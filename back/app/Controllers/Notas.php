<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\NotasModel;
use App\Models\PastaModel;

class Notas extends ResourceController
{
    public function __construct()
    {
        $this->model = new NotasModel();
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
        $usuario = $this->getUsuarioFromToken();
        $pastaId = $this->request->getGet('pasta_id');
        $page = (int) $this->request->getGet('page') ?: 1;
        $limit = (int) $this->request->getGet('limit') ?: 10;

        if (!$usuario) {
            return $this->failUnauthorized();
        }

        $query = $this->model->where('usuario_id', $usuario['uid']);

        if (!empty($pastaId)) {
            $query->where('pasta_id', $pastaId);
        }

        $total = $query->countAllResults(false);

        $notas = $query->paginate($limit, 'default', $page);
        return $this->respond([
           'notas' => $notas,
           'pagina' => $page,
           'limite' => $limit,
           'total' => $total,
           'total_paginas' => ceil($total / $limit),
         ]);
    }

    public function create()
    {
        $pastaModel = new PastaModel();
        $usuario = $this->getUsuarioFromToken();
        $data = $this->request->getJSON(true);

        $data['usuario_id'] = $usuario['uid'];

        if (isset($data['pasta_id'])) {
            $pasta = $pastaModel
                ->where('id', $data['pasta_id'])
                ->where('usuario_id', $usuario['uid']) // valida que a pasta é do usuário
                ->first();

            if (!$pasta) {
                return $this->failUnauthorized('Pasta não encontrada ou não pertence ao usuário.');
            }
        }

        if (!isset($data['titulo']) || !isset($data['conteudo'])) {
            return $this->failValidationErrors('Campos obrigatórios: titulo e conteudo.');
        }

        if (!$this->model->insert($data)) {
            return $this->failServerError('Erro ao criar nota.');
        }

        return $this->respondCreated(['id' => $this->model->getInsertID()]);
    }

    public function show($id = null)
    {
        $usuario = $this->getUsuarioFromToken();
        $nota = $this->model->find($id);

        if (!$nota || $nota['usuario_id'] != $usuario['uid']) {
            return $this->failNotFound('Nota não encontrada ou acesso negado.');
        }
        return $this->respond($nota);
    }

    public function update($id = null)
    {
        $usuario = $this->getUsuarioFromToken();
        $nota = $this->model->find($id);

        if (!$nota || $nota['usuario_id'] != $usuario['uid']) {
            return $this->failNotFound('Nota não encontrada ou acesso negado.');
        }

        $data = $this->request->getJSON(true);
        $data['usuario_id'] = $usuario['uid'];
        $this->model->update($id, $data);
        return $this->respond(['message' => 'Nota atualizada.']);
    }

    public function delete($id = null)
    {
        $usuario = $this->getUsuarioFromToken();
        $nota = $this->model->find($id);

        if (!$nota || $nota['usuario_id'] != $usuario['uid']) {
            return $this->failNotFound('Nota não encontrada ou acesso negado.');
        }

        $this->model->delete($id);
        return $this->respondDeleted(['message' => 'Nota deletada.']);
    }

}
