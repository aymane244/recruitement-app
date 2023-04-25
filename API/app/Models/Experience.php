<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Experience extends Model
{
    use HasFactory;
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'tasks',
        'entreprise',
        'country',
        'city',
        'position',
        'date_begin',
        'date_end',
        'candidate_id',
    ];
    public function candidate(){
        return $this->belongsTo(Candidate::class, 'id', 'candidate_id');
    }
}
