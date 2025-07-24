<?php

namespace App\Http\Controllers;

use App\Http\Requests\AgentRequest;
use App\Models\User;
use App\Models\Agent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class AgentController extends Controller
{
    public function __construct()
    {
        if (Auth::guard('sanctum')->user()->role !== 'admin') {
            abort(403, 'Unauthorized');
        }
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $agents = Agent::with(['user' => function ($query) {
            $query->select('id', 'nom', 'prenom', 'email', 'role');
        }])->get();

        return response()->json([
            'data' => $agents,
            'message' => 'Liste des agents récupérée avec succès',
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(AgentRequest $request)
    {
        $user = DB::transaction(function () use ($request) {
            $user = User::create([
                'nom' => $request->nom,
                'prenom' => $request->prenom,
                'email' => $request->email,
                'telephone' => $request->telephone,
                'adresse' => $request->adresse,
                'password' => Hash::make($request->password),
                'role' => 'agent',
            ]);

            Agent::create([
                'user_id' => $user->id,
            ]);

            return $user;
        });

        return response()->json([
            'data' => $user->load('agent'),
            'message' => 'Agent créé avec succès',
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $agent = Agent::with(['user' => function ($query) {
            $query->select('id', 'nom', 'prenom', 'email', 'role');
        }])->findOrFail($id);

        return response()->json([
            'data' => $agent,
            'message' => 'Détails de l\'agent récupérés avec succès',
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(AgentRequest $request, string $id)
    {
        $agent = Agent::findOrFail($id);

        $user = DB::transaction(function () use ($request, $agent) {
            $user = $agent->user;
            $user->update([
                'nom' => $request->nom,
                'prenom' => $request->prenom,
                'email' => $request->email,
                'telephone' => $request->telephone,
                'adresse' => $request->adresse,
                'password' => $request->password ? Hash::make($request->password) : $user->password,
            ]);

            return $user;
        });

        return response()->json([
            'data' => $user->load('agent'),
            'message' => 'Agent mis à jour avec succès',
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $agent = Agent::findOrFail($id);

        DB::transaction(function () use ($agent) {
            $agent->user->delete();
            $agent->delete();
        });

        return response()->json([
            'message' => 'Agent supprimé avec succès',
        ], 200);
    }
}
