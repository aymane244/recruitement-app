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
        Schema::table('matched_languages', function (Blueprint $table) {
            $table->string('read');
            $table->string('written');
            $table->string('spoken');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('matched_languages', function (Blueprint $table) {
            $table->dropColumn('read');
            $table->dropColumn('written');
            $table->dropColumn('spoken');
        });
    }
};
