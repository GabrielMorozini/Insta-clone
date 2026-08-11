<?php

namespace App\OpenApi\Paths;

use OpenApi\Attributes as OA;

#[OA\Get(
    path: "/api/posts/feed",
    summary: "Feed global de posts",
    tags: ["Posts"],
    security: [["sanctum" => []]],
    responses: [
        new OA\Response(response: 200, description: "OK", content: new OA\JsonContent(type: "array", items: new OA\Items(ref: "#/components/schemas/Post")))
    ]
)]
#[OA\Get(
    path: "/api/users/{userId}/posts",
    summary: "Posts de um usuário",
    tags: ["Posts"],
    security: [["sanctum" => []]],
    parameters: [
        new OA\Parameter(name: "userId", in: "path", required: true, schema: new OA\Schema(type: "string"))
    ],
    responses: [
        new OA\Response(response: 200, description: "OK", content: new OA\JsonContent(type: "array", items: new OA\Items(ref: "#/components/schemas/Post")))
    ]
)]
#[OA\Post(
    path: "/api/posts",
    summary: "Criar post",
    tags: ["Posts"],
    security: [["sanctum" => []]],
    requestBody: new OA\RequestBody(
        required: true,
        content: new OA\MediaType(mediaType: "multipart/form-data", schema: new OA\Schema(ref: "#/components/schemas/Post"))
    ),
    responses: [
        new OA\Response(response: 201, description: "Post criado", content: new OA\JsonContent(ref: "#/components/schemas/Post"))
    ]
)]
#[OA\Get(
    path: "/api/posts/{id}",
    summary: "Exibir post",
    tags: ["Posts"],
    security: [["sanctum" => []]],
    parameters: [
        new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "string"))
    ],
    responses: [
        new OA\Response(response: 200, description: "OK", content: new OA\JsonContent(ref: "#/components/schemas/Post"))
    ]
)]
#[OA\Put(
    path: "/api/posts/{id}",
    summary: "Atualizar post",
    tags: ["Posts"],
    security: [["sanctum" => []]],
    parameters: [
        new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "string"))
    ],
    responses: [
        new OA\Response(response: 200, description: "OK", content: new OA\JsonContent(ref: "#/components/schemas/Post"))
    ]
)]
#[OA\Delete(
    path: "/api/posts/{id}",
    summary: "Excluir post",
    tags: ["Posts"],
    security: [["sanctum" => []]],
    parameters: [
        new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "string"))
    ],
    responses: [
        new OA\Response(response: 200, description: "OK")
    ]
)]
class PostPaths
{
    // Classe vazia — só existe para carregar as anotações acima.
}