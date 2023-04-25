<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Education extends Model
{
    use HasFactory;

    protected $table = "educations";
/**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'education_date',
        'certificate',
        'school',
        'candidate_id',
    ];
    public function candidate(){
        return $this->belongsTo(Candidate::class, 'id', 'candidate_id');
    }
}
