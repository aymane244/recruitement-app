<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Certificate extends Model
{
    use HasFactory;
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'certficates',
        'annonce_id'
    ];

    function annonce(){
        return $this->belongsTo(Annonce::class, 'id', 'annonce_id');
    }
}
