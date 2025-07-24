<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Ticket;
use App\Models\Client;
use App\Models\Agency;
use Carbon\Carbon;

class TicketsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create some test clients first
        $clients = [
            [
                'nom' => 'Diallo',
                'prenom' => 'Amadou',
                'telephone' => '+221 77 123 45 67',
                'latitude' => 14.6928,
                'longitude' => -17.4467,
            ],
            [
                'nom' => 'Ndiaye',
                'prenom' => 'Fatou',
                'telephone' => '+221 76 987 65 43',
                'latitude' => 14.7167,
                'longitude' => -17.4833,
            ],
            [
                'nom' => 'Fall',
                'prenom' => 'Moussa',
                'telephone' => '+221 78 456 78 90',
                'latitude' => 14.6850,
                'longitude' => -17.4400,
            ],
            [
                'nom' => 'Sarr',
                'prenom' => 'Aissatou',
                'telephone' => '+221 77 321 65 98',
                'latitude' => 14.7000,
                'longitude' => -17.4500,
            ]
        ];

        foreach ($clients as $clientData) {
            Client::firstOrCreate(
                ['telephone' => $clientData['telephone']],
                $clientData
            );
        }

        // Get the first agency
        $agency = Agency::first();
        if (!$agency) {
            $this->command->error('No agencies found. Please run AgenciesSeeder first.');
            return;
        }

        // Create test tickets - UNIQUEMENT BANCAIRES
        $tickets = [
            [
                'numero_ticket' => 'B001',
                'type' => 'BANQUE',
                'statut' => 'en_attente',
                'date_creation' => Carbon::now()->subMinutes(30),
            ],
            [
                'numero_ticket' => 'B002',
                'type' => 'BANQUE',
                'statut' => 'en_attente',
                'date_creation' => Carbon::now()->subMinutes(25),
            ],
            [
                'numero_ticket' => 'B003',
                'type' => 'BANQUE',
                'statut' => 'en_attente',
                'date_creation' => Carbon::now()->subMinutes(20),
            ],
            [
                'numero_ticket' => 'B004',
                'type' => 'BANQUE',
                'statut' => 'en_cours',
                'date_creation' => Carbon::now()->subMinutes(15),
            ],
            [
                'numero_ticket' => 'B005',
                'type' => 'BANQUE',
                'statut' => 'en_attente',
                'date_creation' => Carbon::now()->subMinutes(10),
            ],
            [
                'numero_ticket' => 'B006',
                'type' => 'BANQUE',
                'statut' => 'utilise',
                'date_creation' => Carbon::now()->subMinutes(45),
            ]
        ];

        $clientIds = Client::pluck('id')->toArray();

        foreach ($tickets as $index => $ticketData) {
            $ticketData['client_id'] = $clientIds[$index % count($clientIds)];
            // Remove agence_id as it doesn't exist in the tickets table

            Ticket::firstOrCreate(
                ['numero_ticket' => $ticketData['numero_ticket']],
                $ticketData
            );
        }

        $this->command->info('Test tickets created successfully!');
        $this->command->info('Created ' . count($tickets) . ' tickets with ' . count($clients) . ' clients');
    }
}
