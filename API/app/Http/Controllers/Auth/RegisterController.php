<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use App\Models\User;
use Illuminate\Foundation\Auth\RegistersUsers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class RegisterController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Register Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users as well as their
    | validation and creation. By default this controller uses a trait to
    | provide this functionality without requiring any additional code.
    |
    */

    use RegistersUsers;

    /**
     * Where to redirect users after registration.
     *
     * @var string
     */
    protected $redirectTo = RouteServiceProvider::HOME;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest');
    }

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        $validator = Validator::make($data, [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'image' => ['nullable', 'image'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);
        return response()->json([
            'status'=> 400,
            'message_errors'=> $validator->messages()
        ]);
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return \App\Models\User
     */
    protected function create(Request $request)
    {
        $admin = new User;
            if($request->hasFile('image')){
                $file = $request->file('image');
                $filename = $file->getClientOriginalName();
                $filepath = $request->file('image')->storeAs('admin', $filename, 'public');
                $admin->image = $filepath;
            }
            $admin->first_name = $request->input('first_name');
            $admin->last_name = $request->input('last_name');
            $admin->email = $request->input('email');
            $admin->password = $request->input('password');
            $admin->save();
            return response()->json([
                "status" => 200,
                "message" => "You have been successfully registered",
            ]);
    }
}
