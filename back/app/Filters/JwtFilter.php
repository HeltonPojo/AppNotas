<?php

namespace App\Filters;

use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\Filters\FilterInterface;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JwtFilter implements FilterInterface
{
    public function before(RequestInterface $req, $arrgs = null)
    {
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            return response(200);
        }
        $authHeader = $req->getHeaderLine('Authorization');
        if (!$authHeader) {
            return response()->setJSON(['error' => "Token não encontrado"])->setStatusCode(401);
        }

        $token = explode(' ', $authHeader)[1];

        try {
            $decoded = JWT::decode($token, new Key(env('JWT_SECRET'), 'HS256'));
        } catch (\Exception $e) {
            // var_dump($e);
            return response()->setJSON(['error' => "Token invalido"])->setStatusCode(401);
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
    }
}
