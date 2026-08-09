<?php

namespace App\Services;

use App\Models\Post;

class LikeService
{
    public function store(string $postId, int $userId): Post
    {
        $post = Post::findOrFail($postId);

        if (!$post->likes()->where('users.id', $userId)->exists()) {
            $post->likes()->attach($userId);
        }

        return $post;
    }

    public function destroy(string $postId, int $userId): Post
    {
        $post = Post::findOrFail($postId);

        $post->likes()->detach($userId);

        return $post;
    }
}
