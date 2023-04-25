<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('candidates_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('candidate_id')
            ->constrained()
            ->onUpdate('cascade')
            ->onDelete('cascade');
            $table->foreignId('quize_id')
            ->constrained()
            ->onUpdate('cascade')
            ->onDelete('cascade');
            $table->string('candidate_answer');
            // $table->integer('candidate_score');
            $table->string('candidate_question');
            $table->string('correct');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('candidates_answers');
    }
};
