<?php

namespace App\Controllers;

use App\Models\UsuarioModel;
use CodeIgniter\RESTful\ResourceController;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

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

        $model = new UsuarioModel();
        $usuario = $model->where('email', $email)->first();


        if (!$usuario || !password_verify($password, $usuario['senha'])) {
            return $this->failUnauthorized('Credenciais inválidas');
        }

        $issuedAt = time();
        $expire = $issuedAt + 3600; // 1h

        $payload = [
            'iat' => $issuedAt,
            'exp' => $expire,
            'uid' => 1,
            'email' => $email,
        ];

        $jwt = JWT::encode($payload, getenv('JWT_SECRET'), 'HS256');

        return $this->respond(['token' => $jwt], 200);

    }

    public function register()
    {
        $json = $this->request->getJSON(true);

        $email = $json['email'] ?? null;
        $senha = $json['password'] ?? null;

        if (!$email || !$senha) {
            return $this->failValidationErrors('Email e senha são obrigatórios.');
        }

        $model = new \App\Models\UsuarioModel();

        try {
            $existingUser = $model->where('email', $email)->first();
        } catch (\Exception $e) {
            var_dump("o erro deu aqui");
            return $this->failServerError("erro no banco de dados");
        }

        if ($existingUser) {
            return $this->failResourceExists('Email já cadastrado.');
        }

        $hash = password_hash($senha, PASSWORD_BCRYPT);

        $model->insert([
            'email' => $email,
            'senha' => $hash,
        ]);

        $usuarioId = $model->getInsertID();

        $issuedAt = time();
        $expire = $issuedAt + 3600;

        $payload = [
            'iat' => $issuedAt,
            'exp' => $expire,
            'uid' => $usuarioId,
            'email' => $email,
        ];

        $jwt = \Firebase\JWT\JWT::encode($payload, env('JWT_SECRET'), 'HS256');

        return $this->respondCreated(['token' => $jwt]);
    }

    public function verifyToken()
    {
        $authHeader = $this->request->getHeaderLine("Authorization");

        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return $this->fail('Token não enviado.', 401);
        }

        $token = str_replace('Bearer ', '', $authHeader);

        try {
            $decoded = JWT::decode($token, new Key(getenv("JWT_SECRET"), 'HS256'));
            return $this->respond(['status' => 'Autorizado', 'data' => $decoded]);
        } catch (\Exception $e) {
            return $this->fail('Token inválido: ' . $e->getMessage(), 401);
        }
    }
}
