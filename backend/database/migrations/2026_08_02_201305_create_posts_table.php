<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            
            // Relacionamento com a tabela de usuários (Foreign Key)
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Exemplo de campo de conteúdo do post (ajuste se seu post tiver título, etc.)
            $table->text('content'); 
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Alterado de 'post' para 'posts'
        Schema::dropIfExists('posts');
    }
};