<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\NotasModel;

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
        $search = $this->request->getGet('search');
        $page = (int) $this->request->getGet('page') ?: 1;
        $limit = (int) $this->request->getGet('limit') ?: 10;

        if (!$usuario) {
            return $this->failUnauthorized();
        }

        $query = $this->model->where('usuario_id', $usuario['uid']);

        if (!empty($pastaId)) {
            $query->where('pasta_id', $pastaId);
        }

        if (!empty($search)) {
            $query->groupStart()->like('titulo', $search)->orLike('conteudo', $search)->groupEnd();
        }

        $total = $query->countAllResults(false);

        try {
            $notas = $query->paginate($limit, 'default', $page);
        } catch (\Exception $e) {
            return $this->failServerError();
        }
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
        $usuario = $this->getUsuarioFromToken();
        $data = $this->request->getJSON(true);
        $data['usuario_id'] = $usuario['uid'];

        try {
            $this->model->insert($data);
        } catch (\Exception $e) {
            return $this->failServerError();
        }

        return $this->respondCreated(['id' => $this->model->getInsertID()]);
    }

    public function show($id = null)
    {
        $usuario = $this->getUsuarioFromToken();
        try {
            $nota = $this->model->find($id);

            if (!$nota || $nota['usuario_id'] != $usuario['uid']) {
                return $this->failNotFound('Nota não encontrada ou acesso negado.');
            }
        } catch (\Exception $e) {
            return $this->failServerError();
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
