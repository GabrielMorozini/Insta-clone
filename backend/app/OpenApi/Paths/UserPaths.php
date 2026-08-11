<?php

namespace App\OpenApi\Paths;

use OpenApi\Attributes as OA;

#[OA\Get(
    path: "/api/users/{username}",
    summary: "Exibir perfil público de um usuário",
    tags: ["Users"],
    security: [["sanctum" => []]],
    parameters: [
        new OA\Parameter(name: "username", in: "path", required: true, schema: new OA\Schema(type: "string"))
    ],
    responses: [
        new OA\Response(response: 200, description: "OK", content: new OA\JsonContent(ref: "#/components/schemas/User"))
    ]
)]
#[OA\Put(
    path: "/api/users/me",
    summary: "Atualizar dados do próprio usuário",
    tags: ["Users"],
    security: [["sanctum" => []]],
    requestBody: new OA\RequestBody(
        required: false,
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: "name", type: "string"),
                new OA\Property(property: "username", type: "string"),
                new OA\Property(property: "email", type: "string", format: "email"),
                new OA\Property(property: "bio", type: "string", nullable: true),
                new OA\Property(property: "password", type: "string", format: "password"),
            ]
        )
    ),
    responses: [
        new OA\Response(response: 200, description: "Perfil atualizado", content: new OA\JsonContent(ref: "#/components/schemas/User"))
    ]
)]
#[OA\Post(
    path: "/api/users/me/avatar",
    summary: "Upload da foto de perfil",
    tags: ["Users"],
    security: [["sanctum" => []]],
    requestBody: new OA\RequestBody(
        required: true,
        content: new OA\MediaType(
            mediaType: "multipart/form-data",
            schema: new OA\Schema(
                required: ["avatar"],
                properties: [
                    new OA\Property(property: "avatar", type: "string", format: "binary"),
                ]
            )
        )
    ),
    responses: [
        new OA\Response(response: 200, description: "Avatar atualizado")
    ]
)]
#[OA\Delete(
    path: "/api/users/me",
    summary: "Deletar a própria conta",
    tags: ["Users"],
    security: [["sanctum" => []]],
    requestBody: new OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ["password"],
            properties: [
                new OA\Property(property: "password", type: "string", format: "password"),
            ]
        )
    ),
    responses: [
        new OA\Response(response: 200, description: "Conta deletada"),
        new OA\Response(response: 422, description: "Senha incorreta")
    ]
)]
#[OA\Get(
    path: "/api/users/{id}/posts",
    summary: "Listar posts de um usuário",
    tags: ["Users"],
    security: [["sanctum" => []]],
    parameters: [
        new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "string"))
    ],
    responses: [
        new OA\Response(response: 200, description: "OK", content: new OA\JsonContent(type: "array", items: new OA\Items(ref: "#/components/schemas/Post")))
    ]
)]
#[OA\Get(
    path: "/api/users/search",
    summary: "Buscar usuários por nome ou username",
    tags: ["Users"],
    security: [["sanctum" => []]],
    parameters: [
        new OA\Parameter(name: "q", in: "query", required: true, schema: new OA\Schema(type: "string"))
    ],
    responses: [
        new OA\Response(response: 200, description: "OK", content: new OA\JsonContent(type: "array", items: new OA\Items(ref: "#/components/schemas/UserBasic")))
    ]
)]
#[OA\Get(
    path: "/api/users/suggestions",
    summary: "Sugestões de usuários para seguir",
    tags: ["Users"],
    security: [["sanctum" => []]],
    responses: [
        new OA\Response(response: 200, description: "OK", content: new OA\JsonContent(type: "array", items: new OA\Items(ref: "#/components/schemas/UserBasic")))
    ]
)]
class UserPaths
{
    // Classe vazia — só existe para carregar as anotações acima.
}