<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CandidateAnswers extends Model
{
    use HasFactory;

    protected $table = "candidates_answers";

    function candidate(){
        return $this->belongsTo(Candidate::class, 'id', 'candidate_id');
    }
    function quize(){
        return $this->belongsTo(Quiz::class, 'id', 'quize_id');
    }
}
