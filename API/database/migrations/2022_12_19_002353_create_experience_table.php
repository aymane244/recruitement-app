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
    public function up(){
        Schema::create('experiences', function (Blueprint $table) {
            $table->id();
            $table->string('tasks');
            $table->string('entreprise');
            // $table->string('years_experience');
            $table->string('experience_country');
            $table->string('experience_city');
            $table->string('position');
            $table->string('date_begin');
            $table->string('date_end');
            $table->foreignId('candidate_id')
                ->constrained()
                ->onUpdate('cascade')
                ->onDelete('cascade');
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
        Schema::dropIfExists('experience');
    }
};
