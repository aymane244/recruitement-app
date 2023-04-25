<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SoftSkills extends Model
{
    use HasFactory;
/**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'softskills',
        'candidate_id',
        'annonce_id'
    ];
    function annonce(){
        return $this->belongsTo(Annonce::class, 'id', 'annonce_id');
    }
    function candidate(){
        return $this->belongsTo(Candidate::class, 'id', 'candidate_id');
    }
}
