<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class CorsController extends ResourceController
{
    public function preflight()
    {
        return $this->response
            ->setHeader('Access-Control-Allow-Origin', 'http://localhost:3001')
            ->setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            ->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
            ->setHeader('Access-Control-Allow-Credentials', 'true')
            ->setStatusCode(200)
            ->setBody('');
    }
}
