<?php

namespace App\Http\Controllers;

use App\Http\Resources\PostResource;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Exibe o perfil público de um usuário pelo username.
     */
    public function show(string $username)
    {
        $user = User::where('username', $username)
            ->withCount(['followers', 'following', 'posts'])
            ->firstOrFail();

        return new UserResource($user);
    }

    /**
     * Atualiza os dados do próprio usuário logado (Nome, email, username, bio, senha).
     */
    public function updateMe(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name'     => 'sometimes|string|max:255',
            'username' => ['sometimes', 'string', 'max:255', Rule::unique('users')->ignore($user->id)],
            'email'    => ['sometimes', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'bio'      => 'nullable|string|max:500',
            'password' => 'sometimes|string|min:8',
        ]);

        // O cast 'hashed' definido no Model User criptografa a senha automaticamente se ela for informada
        $user->update($validated);

        return response()->json([
            'message' => 'Perfil atualizado com sucesso!',
            'user'    => new UserResource($user)
        ]);
    }

    /**
     * Faz o upload da foto de perfil (Avatar) do usuário logado.
     */
    public function uploadAvatar(Request $request) {
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = $request->user();

        // Se o usuário já tiver uma foto salva no storage, apaga a antiga
        if ($user->profile_photo && Storage::disk('public')->exists($user->profile_photo)) {
            Storage::disk('public')->delete($user->profile_photo);
        }

        $path = $request->file('avatar')->store('avatars', 'public');

        $user->update(['profile_photo' => $path]);

        return response()->json([
            'message'    => 'Foto de perfil atualizada!',
            'avatar_url' => asset('storage/' . $path)
        ]);
    }

    /**
     * Retorna os posts de um determinado usuário.
     */
    public function posts($id)
    {
        $user = User::findOrFail($id);

        $posts = $user->posts()
            ->with('user')
            ->withCount(['likes', 'comments'])
            ->latest()
            ->paginate(10);

        return PostResource::collection($posts);
    }

    /**
     * Busca usuários pelo nome ou username (mecanismo de pesquisa).
     */
    public function search(Request $request)
    {
        $query = $request->query('q');

        if (!$query) {
            return response()->json([]);
        }

        $users = User::where('name', 'like', "%{$query}%")
            ->orWhere('username', 'like', "%{$query}%")
            ->limit(10)
            ->get();

        return response()->json($users);
    }

    /**
     * Retorna sugestões de usuários para seguir (exclui o próprio usuário e quem ele já segue).
     */
    public function suggestions(Request $request) {
        $currentUser = $request->user();

        // Pega os IDs dos usuários que ele já segue
        $followingIds = $currentUser->following()->pluck('users.id')->toArray();

        // Traz usuários que não sejam ele mesmo nem quem ele já segue
        $suggestions = User::where('id', '!=', $currentUser->id)
            ->whereNotIn('id', $followingIds)
            ->inRandomOrder()
            ->limit(5)
            ->get();

        return response()->json($suggestions);
    }
}