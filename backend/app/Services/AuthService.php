<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function register(array $data): User
    {
        $data['password'] = Hash::make($data['password']);
        $user = User::create($data);

        event(new Registered($user));

        return $user;
    }

   public function login(array $data): User
{
    $field = filter_var($data['login'], FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

    $credentials = [
        $field => $data['login'],
        'password' => $data['password'],
    ];

    if (!Auth::attempt($credentials)) {
        throw ValidationException::withMessages([
            'login' => ['As credenciais fornecidas estão incorretas.'],
        ]);
    }

    return Auth::user();
}

    public function createToken(User $user): string
    {
        return $user->createToken('auth_token')->plainTextToken;
    }

    public function logout(User $user): void
    {
        $user->tokens()->delete();
    }
}