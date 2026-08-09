<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Http\Resources\PostResource;
use App\Models\Post;
use App\Services\PostService;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class PostController extends Controller
{
    use AuthorizesRequests;

    public function __construct(private PostService $postService) {}

    // 🔥 NOVO: Feed global
    public function feed(Request $request)
    {
        $posts = $this->postService->feed($request->query('per_page', 10));

        return PostResource::collection($posts);
    }

    // 🔥 NOVO: Posts de um usuário específico (perfil)
    public function userPosts(Request $request, string $userId)
    {
        $posts = $this->postService->userPosts(
            $userId,
            $request->query('per_page', 10)
        );

        return PostResource::collection($posts);
    }

    public function store(StorePostRequest $request)
    {
        $post = $this->postService->store(
            $request->validated(),
            $request->file('image'),
            $request->user()
        );

        return new PostResource($post);
    }

    public function show(string $id)
    {
        $post = $this->postService->show($id);

        return new PostResource($post);
    }

    public function update(UpdatePostRequest $request, string $id)
    {
        $post = Post::findOrFail($id);
        $this->authorize('update', $post);

        $updatedPost = $this->postService->update($post, $request->validated());

        return new PostResource($updatedPost);
    }

    public function destroy(string $id)
    {
        $post = Post::findOrFail($id);
        $this->authorize('delete', $post);

        $this->postService->destroy($post);

        return response()->json(['message' => 'Post deleted successfully']);
    }
}