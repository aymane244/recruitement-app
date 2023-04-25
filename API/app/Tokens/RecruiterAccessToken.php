<?php
namespace App\Tokens;
use Laravel\Sanctum\PersonalAccessToken as SanctumPersonalAccessToken;
 
class RecruiterAccessToken extends SanctumPersonalAccessToken
{
    protected $connection = 'mysql';
}