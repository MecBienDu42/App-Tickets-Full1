<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Agent;
use App\Models\Admin;

class TestUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Admin user
        $adminUser = User::firstOrCreate(
            ['email' => 'admin@test.com'],
            [
                'nom' => 'Admin',
                'prenom' => 'Test',
                'email' => 'admin@test.com',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        // Create Admin record
        Admin::firstOrCreate(
            ['user_id' => $adminUser->id],
            ['user_id' => $adminUser->id]
        );

        // Create Agent user
        $agentUser = User::firstOrCreate(
            ['email' => 'agent@test.com'],
            [
                'nom' => 'Agent',
                'prenom' => 'Test',
                'email' => 'agent@test.com',
                'password' => Hash::make('password'),
                'role' => 'agent',
                'email_verified_at' => now(),
            ]
        );

        // Create Agent record
        Agent::firstOrCreate(
            ['user_id' => $agentUser->id],
            [
                'user_id' => $agentUser->id,
            ]
        );

        $this->command->info('Test users created successfully!');
        $this->command->info('Admin: admin@test.com / password');
        $this->command->info('Agent: agent@test.com / password');
    }
}






