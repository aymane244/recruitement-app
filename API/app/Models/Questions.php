<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Questions extends Model
{
    use HasFactory;

    function quiz(){
        return $this->belongsTo(Quiz::class, 'id', 'quize_id');
    }
}
