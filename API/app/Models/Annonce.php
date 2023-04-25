<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Annonce extends Model
{
    use HasFactory;
    
    public function softSkills(){
        return $this->hasMany(SoftSkills::class, 'id');
    }
    public function certificate(){
        return $this->hasMany(Certificate::class, 'id');
    }
    public function hardSkills(){
        return $this->hasMany(HardSkills::class, 'id');
    }
    public function languages(){
        return $this->hasMany(Language::class, 'id');
    }
    public function recruiter(){
        return $this->belongsTo(Recruiter::class, 'id', 'recruiter_id');
    }
    public function quiz(){
        return $this->hasOne(Quiz::class, 'id');
    }
    public function matchedSoftSkills(){
        return $this->hasMany(MatchedSoftSkills::class, 'id');
    }
    public function matchedHardSkills(){
        return $this->hasMany(MatchedHardSkills::class, 'id');
    }
    public function matchedLanguages(){
        return $this->hasMany(matchedLanguages::class, 'id');
    }
}
