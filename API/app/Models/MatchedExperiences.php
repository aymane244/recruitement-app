<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MatchedExperiences extends Model
{
    use HasFactory;
/**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'matched_experience',
        'candidate_id',
        'annonce_id'
    ];
    public function candidate(){
        return $this->belongsTo(Candidate::class, 'id', 'candidate_id');
    }
    public function annonce(){
        return $this->belongsTo(Annonce::class, 'id', 'candidate_id');
    }
}
