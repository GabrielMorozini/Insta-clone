<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LikeSeeder extends Seeder
{
    public function run(): void
    {
        $userIds = User::pluck('id');
        $postIds = Post::pluck('id');

        $likes = [];

        foreach ($postIds as $postId) {
            // cada post recebe likes de um número aleatório de usuários
            $likers = $userIds->random(rand(0, min(10, $userIds->count())));

            foreach ($likers as $userId) {
                $likes[] = [
                    'user_id' => $userId,
                    'post_id' => $postId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        // insertOrIgnore evita erro de duplicidade se houver unique constraint (user_id, post_id)
        DB::table('likes')->insertOrIgnore($likes);
    }
}