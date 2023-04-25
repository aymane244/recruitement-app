<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Candidate extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
    protected $guard = "candidate";
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'cin',
        'fnam',
        'lname',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function experiences(){
        return $this->hasMany(Experience::class, 'id');
    }
    public function quizes(){
        return $this->hasMany(Quiz::class, 'id');
    }
    public function resume(){
        return $this->hasOne(Resume::class, 'id');
    }
    public function educations(){
        return $this->hasMany(Education::class, 'id');
    }
    public function softSkills(){
        return $this->hasMany(SoftSkills::class, 'id');
    }
    public function hardSkills(){
        return $this->hasMany(HardSkills::class, 'id');
    }
    public function languages(){
        return $this->hasMany(Language::class, 'id');
    }
    public function hobbies(){
        return $this->hasMany(Hobbies::class, 'id');
    }
    public function matchedExperiences(){
        return $this->hasMany(MatchedExperiences::class, 'id');
    }
    public function matchedSoftSkills(){
        return $this->hasMany(MatchedSoftSkills::class, 'id');
    }
    public function matchedHardSkills(){
        return $this->hasMany(MatchedHardSkills::class, 'id');
    }
    public function matchedLanguages(){
        return $this->hasMany(MatchedLanguages::class, 'id');
    }
    public function candidateQuiz(){
        return $this->hasMany(QuizeCandidates::class, 'id');
    }
    public function candidateAnswers(){
        return $this->hasMany(CandidateAnswers::class, 'id');
    }
    public function cover_letter(){
        return $this->hasOne(CoverLetter::class, 'id');
    }
    public function experience_year(){
        return $this->hasOne(ExperincesYears::class, 'id');
    }
}
