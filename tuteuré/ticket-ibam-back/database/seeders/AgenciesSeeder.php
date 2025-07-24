<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Agency;

class AgenciesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $agencies = [
            [
                'name' => 'Agence Centrale',
                'address' => 'Avenue Léopold Sédar Senghor, Dakar',
                'phone' => '+221 33 123 45 67',
                'latitude' => 14.6937,
                'longitude' => -17.4441,
                'is_active' => true,
            ],
            [
                'name' => 'Agence Plateau',
                'address' => 'Place de l\'Indépendance, Dakar',
                'phone' => '+221 33 987 65 43',
                'latitude' => 14.6928,
                'longitude' => -17.4467,
                'is_active' => true,
            ],
            [
                'name' => 'Agence Almadies',
                'address' => 'Route des Almadies, Dakar',
                'phone' => '+221 33 456 78 90',
                'latitude' => 14.7167,
                'longitude' => -17.4833,
                'is_active' => true,
            ]
        ];

        foreach ($agencies as $agency) {
            Agency::firstOrCreate(
                ['name' => $agency['name']],
                $agency
            );
        }

        $this->command->info('Agencies created successfully!');
    }
}
