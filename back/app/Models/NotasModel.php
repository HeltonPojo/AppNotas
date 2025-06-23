<?php

namespace App\Models;

use CodeIgniter\Model;

class NotasModel extends Model
{
    protected $table = 'Notas';
    protected $primaryKey = 'id';
    protected $allowedFields = ['titulo', 'usuario_id', 'conteudo', 'pasta_id'];
    protected $returnType = 'array';
}
