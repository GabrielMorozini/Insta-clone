<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

class UserFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'username' => fake()->unique()->userName(),
            'email' => fake()->unique()->safeEmail(),
            'birthdate' => fake()->date('Y-m-d', '-16 years'), // garante maior de 16
            'password' => Hash::make('password'),
            'bio' => fake()->boolean(60) ? fake()->sentence(10) : null,
            'profile_photo' => fake()->boolean(70) ? fake()->imageUrl(200, 200, 'people') : null,
            'email_verified_at' => now(),
        ];
    }
}