<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\Client;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TicketController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|in:ONEA,SONABEL,BANQUE',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
        ]);

        $client = Client::create([
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
        ]);

        $ticket = Ticket::createWithTicketNumber([
            'type' => $request->type,
            'statut' => 'en_attente',
            'client_id' => $client->id,
        ]);

        return response()->json([
            'data' => $ticket->load('client'),
            'message' => 'Ticket créé avec succès',
        ], 201);
    }


    public function cancel(Request $request, $id)
    {
        $ticket = Ticket::findOrFail($id);

        if (!in_array($ticket->statut, ['en_cours'])) {
            return response()->json(['message' => 'Le ticket ne peut pas être annulé'], 400);
        }

        $ticket->update(['statut' => 'annule']);

        return response()->json([
            'data' => $ticket,
            'message' => 'Ticket annulé avec succès',
        ], 200);
    }

    public function markAsUsed(Request $request, $id)
    {
        $ticket = Ticket::findOrFail($id);

        if (!in_array($ticket->statut, ['en_attente', 'en_cours'])) {
            return response()->json(['message' => 'Le ticket ne peut pas être marqué comme utilisé'], 400);
        }

        if ($ticket->agent_id !== $request->user()->agent->id) {
            return response()->json(['message' => 'Seul l\'agent assigné ou un administrateur peut marquer ce ticket comme utilisé'], 403);
        }

        $ticket->update(['statut' => 'utilise']);

        return response()->json([
            'data' => $ticket,
            'message' => 'Ticket marqué comme utilisé avec succès',
        ], 200);
    }

    public function queue(Request $request)
    {
        $query = Ticket::where('statut', 'en_attente')
            ->whereDate('date_creation', Carbon::today())
            ->with(['client' => function ($query) {
                $query->select('id', 'latitude', 'longitude');
            }])
            ->select('id', 'numero_ticket', 'type', 'client_id', 'date_creation');

        if ($request->user()->role === 'agent') {
            $query->whereNull('agent_id');
        }

        $tickets = $query->get();

        return response()->json([
            'data' => $tickets,
            'message' => 'File d\'attente récupérée',
        ], 200);
    }

    public function assign(Request $request, $id)
    {
        $ticket = Ticket::findOrFail($id);
        if ($ticket->statut !== 'en_attente') {
            return response()->json(['message' => 'Le ticket ne peut pas être assigné'], 400);
        }

        $ticket->update([
            'agent_id' => $request->user()->agent->id,
            'statut' => 'en_cours',
        ]);

        return response()->json([
            'data' => $ticket->load('client'),
            'message' => 'Ticket assigné avec succès',
        ], 200);
    }

    public function show($id)
    {
        $ticket = Ticket::with('client', 'agent')->findOrFail($id);

        return response()->json([
            'data' => $ticket,
            'message' => 'Détails du ticket',
        ], 200);
    }


    public function checkPosition(Request $request)
    {
        $request->validate([
            'numero_ticket' => 'required|string|exists:tickets,numero_ticket',
        ]);

        $ticket = Ticket::where('numero_ticket', $request->numero_ticket)->firstOrFail();

        if ($ticket->statut !== 'en_attente') {
            return response()->json([
                'data' => ['position' => 0],
                'message' => 'Le ticket n\'est pas en attente',
            ], 200);
        }

        $position = Ticket::where('type', $ticket->type)
            ->where('statut', 'en_attente')
            ->whereDate('date_creation', Carbon::today())
            ->where('id', '<', $ticket->id)
            ->count() + 1;

        return response()->json([
            'data' => ['position' => $position, 'numero_ticket' => $ticket->numero_ticket, 'type' => $ticket->type],
            'message' => 'Position dans la file d\'attente récupérée',
        ], 200);
    }

    public function callNext(Request $request)
    {
        $nextTicket = Ticket::where('statut', 'en_attente')
            ->whereDate('date_creation', Carbon::today())
            ->orderBy('id')
            ->first();

        if (!$nextTicket) {
            return response()->json([
                'message' => 'Aucun ticket en attente',
            ], 404);
        }

        $nextTicket->update([
            'statut' => 'en_cours',
            'agent_id' => $request->user()->agent->id ?? null,
        ]);

        return response()->json([
            'data' => $nextTicket->load('client'),
            'message' => 'Prochain ticket appelé avec succès',
        ], 200);
    }

    public function cancelByNumber(Request $request)
    {
        $request->validate([
            'numero_ticket' => 'required|string|exists:tickets,numero_ticket',
        ]);

        $ticket = Ticket::where('numero_ticket', $request->numero_ticket)->firstOrFail();

        if (!in_array($ticket->statut, ['en_attente', 'en_cours'])) {
            return response()->json(['message' => 'Le ticket ne peut pas être annulé'], 400);
        }

        $ticket->update(['statut' => 'annule']);

        return response()->json([
            'data' => $ticket,
            'message' => 'Ticket annulé avec succès',
        ], 200);
    }

    public function calculateTravelTime(Request $request)
    {
        $request->validate([
            'user_lat' => 'required|numeric',
            'user_lng' => 'required|numeric',
            'agency_lat' => 'required|numeric',
            'agency_lng' => 'required|numeric',
        ]);

        // Calculate distance using Haversine formula
        $earthRadius = 6371; // km
        $dLat = deg2rad($request->agency_lat - $request->user_lat);
        $dLng = deg2rad($request->agency_lng - $request->user_lng);
        
        $a = sin($dLat/2) * sin($dLat/2) +
             cos(deg2rad($request->user_lat)) * cos(deg2rad($request->agency_lat)) *
             sin($dLng/2) * sin($dLng/2);
        $c = 2 * atan2(sqrt($a), sqrt(1-$a));
        $distance = $earthRadius * $c;

        // Estimate travel time (assuming average speed of 30 km/h in city)
        $travelTime = ($distance / 30) * 60; // in minutes

        return response()->json([
            'distance' => round($distance, 2),
            'travel_time' => round($travelTime, 0),
        ]);
    }
}
