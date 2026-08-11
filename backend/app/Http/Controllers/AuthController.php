<?php

namespace App\Http\Controllers;

use App\Http\Requests\AuthValidateRequest;
use App\Http\Requests\LoginValidateRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use App\Models\User;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class AuthController extends Controller {
    public function __construct(private AuthService $auth) {

    }

    #[OA\Post(
        path: "/auth/login",
        summary: "Login",
        tags: ["Auth"],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["login", "password"],
                properties: [
                    new OA\Property(property: "login", type: "string", example: "maria.silva"),
                    new OA\Property(property: "password", type: "string", example: "senha123"),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Login realizado com sucesso"),
            new OA\Response(response: 422, description: "Erro de validação"),
        ]
    )]
    public function login(LoginValidateRequest $request)
    {
        $user = $this->auth->login($request->validated());

        return $this->respondWithToken($user);
    }

    public function register(AuthValidateRequest $request)
    {
        $user = $this->auth->register($request->validated());

        return $this->respondWithToken($user);
    }

    public function logout(Request $request)
    {
        $this->auth->logout($request->user());

        return response()->json([
            'message' => 'Logout realizado com sucesso. Token revogado.'
        ], 200);
    }

    public function me(Request $request)
    {
        $user = $request->user()->loadCount(['posts', 'followers', 'following']);

        return new UserResource($user);
    }

    private function respondWithToken(User $user)
    {
        $token = $this->auth->createToken($user);

        return response()->json([
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'user'         => (new UserResource($user))->resolve()
        ]);
    }
}