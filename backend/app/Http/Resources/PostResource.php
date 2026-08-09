<?php
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class PostResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'caption' => $this->caption,
            'image_url' => $this->image_path ? Storage::url($this->image_path) : null,
            'media_count' => 1,
            'likes_count' => $this->likes()->count(),
            'comments_count' => $this->comments()->count(),
            'liked_by_me' => $request->user()
                ? $this->likes()->where('users.id', $request->user()->id)->exists()
                : false,
            'created_at' => $this->created_at,
            'user' => [
                'id' => $this->user->id,
                'username' => $this->user->username,
                'name' => $this->user->name,
                'profile_photo' => $this->user->profile_photo ? Storage::url($this->user->profile_photo) : null,
            ],
        ];
    }
}