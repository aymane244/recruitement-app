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
        Schema::create('candidates', function (Blueprint $table) {
            $table->id();
            $table->string("fname");
            $table->string("lname");
            $table->string("email");
            $table->string("cin");
            $table->string("gender");
            $table->string("birthday");
            $table->string("phone");
            $table->text("candidate_adress");
            $table->string("photo")->nullable();
            $table->string("candidate_city");
            $table->string("password");
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
        Schema::dropIfExists('candidates');
    }
};
