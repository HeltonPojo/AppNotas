<?php

namespace App\Models;

use CodeIgniter\Model;

class PastaModel extends Model
{
    protected $table = 'Pastas';
    protected $primaryKey = 'id';
    protected $allowedFields = ['nome', 'usuario_id'];
    protected $returnType = 'array';
}
