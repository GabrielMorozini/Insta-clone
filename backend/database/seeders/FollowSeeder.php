<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FollowSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::pluck('id');

        $follows = [];

        foreach ($users as $userId) {
            // cada usuário segue um número aleatório de outros (nunca a si mesmo)
            $possibleToFollow = $users->reject(fn ($id) => $id === $userId);

            $following = $possibleToFollow->random(
                rand(0, min(8, $possibleToFollow->count()))
            );

            foreach ($following as $followingId) {
                $follows[] = [
                    'follower_id' => $userId,
                    'following_id' => $followingId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        // insertOrIgnore evita duplicar seguidas repetidas e respeita o unique constraint
        DB::table('follows')->insertOrIgnore($follows);
    }
}