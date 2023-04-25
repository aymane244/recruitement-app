<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CoverLetter extends Model
{
    use HasFactory;
    protected $fillable = [
        'letter',
    ];
    function candidat(){
        return $this->hasOne(Candidate::class, 'id', 'candidate_id');
    }
}
