<?php

namespace App\Controllers;

use App\Models\UsuarioModel;
use CodeIgniter\RESTful\ResourceController;
use Firebase\JWT\JWT;

class Auth extends ResourceController
{
    public function login()
    {
        $json = $this->request->getJSON();

        $email = $json->email ?? null;
        $password = $json->password ?? null;

        if (!$email && !$password) {
            return $this->fail('Campos email e password necessarios', 400);
        }

        if (!preg_match('/^[\w\.-]+@[\w\.-]+\.\w{2,}$/', $email)) {
            return $this->failValidationErrors('O e-mail fornecido é inválido.');
        }

        $model = new UsuarioModel();
        $usuario = $model->where('email', $email)->first();


        if (!$usuario || !password_verify($password, $usuario['senha'])) {
            return $this->failUnauthorized('Credenciais inválidas');
        }

        $issuedAt = time();
        $expire = $issuedAt + 259200;

        $payload = [
            'iat' => $issuedAt,
            'exp' => $expire,
            'uid' => $usuario['id'],
            'email' => $email,
        ];

        $jwt = JWT::encode($payload, env('JWT_SECRET'), 'HS256');

        return $this->respond(['token' => $jwt], 200);

    }

    public function register()
    {
        $json = $this->request->getJSON();

        $email = $json->email ?? null;
        $password = $json->password ?? null;

        if (!$email || !$password) {
            return $this->failValidationErrors('Email e senha são obrigatórios.');
        }

        if (!preg_match('/^[\w\.-]+@[\w\.-]+\.\w{2,}$/', $email)) {
            return $this->failValidationErrors('O e-mail fornecido é inválido.');
        }

        $model = new \App\Models\UsuarioModel();

        try {
            $existingUser = $model->where('email', $email)->first();
        } catch (\Exception $e) {
            return $this->failServerError("erro no banco de dados");
        }

        if ($existingUser) {
            return $this->failResourceExists('Email já cadastrado.');
        }

        $hash = password_hash($password, PASSWORD_BCRYPT);

        $model->insert([
            'email' => $email,
            'senha' => $hash,
        ]);

        $usuarioId = $model->getInsertID();

        $issuedAt = time();
        $expire = $issuedAt + 259200;

        $payload = [
            'iat' => $issuedAt,
            'exp' => $expire,
            'uid' => $usuarioId,
            'email' => $email,
        ];

        $jwt = \Firebase\JWT\JWT::encode($payload, env('JWT_SECRET'), 'HS256');

        return $this->respondCreated(['token' => $jwt]);
    }

}
