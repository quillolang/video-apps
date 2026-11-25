<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

// Everyone, for good: two counts in the database ("saved", and "synced" for the page kept in sync).
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('counts', function (Blueprint $table) {
            $table->string('name')->primary();
            $table->integer('n')->default(0);
        });
        DB::table('counts')->insert([['name' => 'saved', 'n' => 0], ['name' => 'synced', 'n' => 0]]);
    }

    public function down(): void
    {
        Schema::dropIfExists('counts');
    }
};
