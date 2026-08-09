<?php

namespace App\Services;

use App\Models\Post;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;

class PostService
{
    public function feed(int $perPage = 10): LengthAwarePaginator
    {
        return Post::with(['user', 'likes'])
            ->latest()
            ->paginate($perPage);
    }

    public function userPosts(string $userId, int $perPage = 10): LengthAwarePaginator
    {
        return Post::with(['user', 'likes'])
            ->where('user_id', $userId)
            ->latest()
            ->paginate($perPage);
    }

    public function store(array $validated, ?UploadedFile $image, User $user): Post
    {
        $data = [
            'caption' => $validated['caption'] ?? null,
            'user_id' => $user->id,
        ];

        if ($image) {
            $data['image_path'] = $image->store('posts', 'public');
        }

        return Post::create($data);
    }

    public function show(string $id): Post
    {
        return Post::with(['user', 'likes', 'comments'])->findOrFail($id);
    }

    public function update(Post $post, array $validated): Post
    {
        $post->update($validated);
        return $post->load('user');
    }

    public function destroy(Post $post): void
    {
        if ($post->image_path && !str_starts_with($post->image_path, 'http')) {
            Storage::disk('public')->delete($post->image_path);
        }
        $post->delete();
    }
}