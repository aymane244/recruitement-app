<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExperincesYears extends Model
{
    use HasFactory;
    protected $table = "experiences_years";

    public function candidate(){
        return $this->belongsTo(Candidate::class, 'id', 'candidate_id');
    }
}
