<?php

namespace App\OpenApi;

use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "User",
    properties: [
        new OA\Property(property: "id", type: "integer", example: 1),
        new OA\Property(property: "name", type: "string", example: "Maria Silva"),
        new OA\Property(property: "username", type: "string", example: "maria.silva"),
        new OA\Property(property: "email", type: "string", format: "email", example: "maria@example.com"),
        new OA\Property(property: "avatar_url", type: "string", example: "http://localhost/storage/avatars/foo.jpg"),
        new OA\Property(property: "bio", type: "string", nullable: true, example: "Fotógrafa e viajante."),
        new OA\Property(property: "created_at", type: "string", format: "date-time"),
        new OA\Property(property: "joined_at", type: "string", example: "10/08/2026"),
        new OA\Property(property: "posts_count", type: "integer", nullable: true, example: 12),
        new OA\Property(property: "followers_count", type: "integer", nullable: true, example: 340),
        new OA\Property(property: "following_count", type: "integer", nullable: true, example: 180),
        new OA\Property(property: "is_following", type: "boolean", nullable: true, example: false),
    ]
)]
#[OA\Schema(
    schema: "UserBasic",
    properties: [
        new OA\Property(property: "id", type: "integer"),
        new OA\Property(property: "username", type: "string"),
        new OA\Property(property: "name", type: "string"),
        new OA\Property(property: "profile_photo", type: "string", nullable: true),
    ]
)]
#[OA\Schema(
    schema: "Post",
    properties: [
        new OA\Property(property: "id", type: "integer", example: 10),
        new OA\Property(property: "caption", type: "string", nullable: true, example: "Pôr do sol de hoje 🌅"),
        new OA\Property(property: "image_url", type: "string", nullable: true),
        new OA\Property(property: "media_count", type: "integer", example: 1),
        new OA\Property(property: "likes_count", type: "integer", example: 24),
        new OA\Property(property: "comments_count", type: "integer", example: 3),
        new OA\Property(property: "liked_by_me", type: "boolean", example: false),
        new OA\Property(property: "created_at", type: "string", format: "date-time"),
        new OA\Property(property: "user", ref: "#/components/schemas/UserBasic"),
    ]
)]
#[OA\Schema(
    schema: "Comment",
    properties: [
        new OA\Property(property: "id", type: "integer", example: 5),
        new OA\Property(property: "body", type: "string", example: "Que foto linda!"),
        new OA\Property(property: "user", ref: "#/components/schemas/User"),
        new OA\Property(property: "created_at", type: "string", format: "date-time"),
        new OA\Property(property: "updated_at", type: "string", format: "date-time"),
    ]
)]
#[OA\Schema(
    schema: "Message",
    properties: [
        new OA\Property(property: "message", type: "string"),
    ]
)]


class Schemas
{
    // Classe vazia — só existe para carregar as anotações acima.
}