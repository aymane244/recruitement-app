<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    use HasFactory;

    protected $table = "quizes";

    public function annonce(){
        return $this->belongsTo(Annonce::class, 'id', 'annonce_id');
    }

    public function questions(){
        return $this->hasMany(Questions::class, 'id');
    }

    public function candidateQuiz(){
        return $this->hasMany(QuizeCandidates::class, 'id');
    }

    public function candidateAnswers(){
        return $this->hasMany(CandidateAnswers::class, 'id');
    }
}
