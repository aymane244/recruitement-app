<?php

namespace App\Providers;

// use Illuminate\Support\Facades\Gate;
use Laravel\Sanctum\Sanctum;
use App\Tokens\RecruiterAccessToken;
use App\Tokens\PersonalAccessToken;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\AdminController;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Http\Request;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot(Request $request)
    {
        $this->registerPolicies();
        // if(Auth::attempt(['email' => $request->email, 'password' => $request->password])){
        //     Sanctum::usePersonalAccessTokenModel(PersonalAccessToken::class);
        // }else if(Auth::guard('recruiter')->attempt(['ice' => $request->ice, 'password' => $request->password])){
        //     Sanctum::usePersonalAccessTokenModel(RecruiterAccessToken::class);
        // }
    }
}
