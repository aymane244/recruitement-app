<?php
namespace App\Tokens;
use Laravel\Sanctum\PersonalAccessToken as SanctumPersonalAccessToken;
 
class PersonalAccessToken extends SanctumPersonalAccessToken
{
    protected $connection = 'mysql';
}