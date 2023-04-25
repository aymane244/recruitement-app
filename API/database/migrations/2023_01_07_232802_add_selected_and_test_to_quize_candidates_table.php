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
        Schema::table('quize_candidates', function (Blueprint $table) {
            // $table->string('selected');
            $table->string('test');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('quize_candidates', function (Blueprint $table) {
            // $table->dropColumn('selected');
            $table->dropColumn('test');
        });
    }
};