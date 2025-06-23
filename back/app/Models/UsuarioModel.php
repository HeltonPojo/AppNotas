<?php

namespace App\Models;

use CodeIgniter\Model;

class UsuarioModel extends Model
{
    protected $table = 'Usuario';
    protected $primaryKey = 'id';
    protected $allowedFields = ['email', 'senha'];
    protected $returnType = 'array';
}
