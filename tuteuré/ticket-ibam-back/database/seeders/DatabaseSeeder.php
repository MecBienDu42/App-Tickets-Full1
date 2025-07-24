<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Agent;
use App\Models\User;
use App\Models\Client;
use App\Models\Ticket;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Créer l'administrateur
        $admin = User::create([
            'nom' => 'admin',
            'prenom' => 'admin',
            'role' => 'admin',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('password01'),
        ]);

        Admin::create([
            'user_id' => $admin->id
        ]);

        // Créer les agents
        $agent = User::create([
            'nom' => 'agent',
            'prenom' => 'agent',
            'role' => 'agent',
            'email' => 'agent@gmail.com',
            'password' => Hash::make('password01'),
        ]);

        $agent1 = Agent::create([
            'user_id' => $agent->id
        ]);

        $agent2 = User::create([
            'nom' => 'agent2',
            'prenom' => 'agent2',
            'role' => 'agent',
            'email' => 'agent2@gmail.com',
            'password' => Hash::make('password01'),
        ]);

        $agent2 = Agent::create([
            'user_id' => $agent2->id
        ]);

        // Créer 40 tickets
        $ticketDistribution = [
            'ONEA' => 15,
            'SONABEL' => 15,
            'BANQUE' => 10,
        ];

        $statuses = [
            'en_attente' => 25,
            'en_cours' => 10,
            'annule' => 3,
            'utilise' => 2,
        ];

        // Coordonnées de base (Ouagadougou, Burkina Faso)
        $baseLatitude = 12.3714;
        $baseLongitude = -1.5197;

        $statusIndex = 0;
        $statusKeys = array_keys($statuses);
        $currentStatusCounts = array_fill_keys($statusKeys, 0);

        foreach ($ticketDistribution as $type => $count) {
            for ($i = 0; $i < $count; $i++) {
                // Créer un client avec des coordonnées aléatoires
                $client = Client::create([
                    'latitude' => $baseLatitude + (rand(-100, 100) / 10000), // Variation de ±0.01 degré
                    'longitude' => $baseLongitude + (rand(-100, 100) / 10000),
                ]);

                // Choisir un statut en respectant les limites
                while ($currentStatusCounts[$statusKeys[$statusIndex]] >= $statuses[$statusKeys[$statusIndex]]) {
                    $statusIndex = ($statusIndex + 1) % count($statusKeys);
                }
                $status = $statusKeys[$statusIndex];
                $currentStatusCounts[$status]++;

                // Assigner un agent pour les statuts en_cours et utilise
                $agentId = null;
                if (in_array($status, ['en_cours', 'utilise'])) {
                    $agentId = rand(0, 1) ? $agent1->id : $agent2->id;
                }

                // Créer le ticket dans une transaction
                $ticket = DB::transaction(function () use ($type, $client, $status, $agentId) {
                    return Ticket::createWithTicketNumber([
                        'type' => $type,
                        'statut' => $status,
                        'client_id' => $client->id,
                        'agent_id' => $agentId,
                        'date_creation' => Carbon::today(),
                    ]);
                });

                // Passer au statut suivant
                $statusIndex = ($statusIndex + 1) % count($statusKeys);
            }
        }
    }
}
