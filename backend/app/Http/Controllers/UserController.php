<?php

    namespace App\Http\Controllers;

    use App\Http\Resources\PostResource;
    use App\Http\Resources\UserResource;
    use App\Models\User;
    use Illuminate\Http\Request;
    use Illuminate\Support\Facades\DB;
    use Illuminate\Support\Facades\Hash;
    use Illuminate\Support\Facades\Storage;
    use Illuminate\Validation\Rule;
    use Illuminate\Validation\ValidationException;

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
         * Deleta permanentemente a conta do usuário logado.
         * Exige a senha atual como confirmação por segurança.
         */
        public function deleteMe(Request $request)
        {
            $user = $request->user();

            $request->validate([
                'password' => 'required|string',
            ]);

            // Confirma a senha antes de deletar qualquer coisa
            if (!Hash::check($request->password, $user->password)) {
                throw ValidationException::withMessages([
                    'password' => ['Senha incorreta.'],
                ]);
            }

            DB::transaction(function () use ($user) {
                // Apaga o avatar do storage, se existir
                if ($user->profile_photo && Storage::disk('public')->exists($user->profile_photo)) {
                    Storage::disk('public')->delete($user->profile_photo);
                }

                // Apaga imagens dos posts do usuário antes de deletar os posts
                foreach ($user->posts as $post) {
                    if ($post->image_path && Storage::disk('public')->exists($post->image_path)) {
                        Storage::disk('public')->delete($post->image_path);
                    }
                }

                // Remove relacionamentos manualmente para garantir consistência
                // mesmo que as migrations não tenham onDelete('cascade')
                $user->posts()->delete();       // posts (e seus likes/comments, se tiver cascade no BD)
                $user->following()->detach();   // quem ele segue
                $user->followers()->detach();   // quem segue ele

                // Revoga todos os tokens de API (Sanctum)
                $user->tokens()->delete();

                // Deleta o usuário
                $user->delete();
            });

            return response()->json([
                'message' => 'Sua conta foi deletada permanentemente. Até a próxima, aventureiro.'
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