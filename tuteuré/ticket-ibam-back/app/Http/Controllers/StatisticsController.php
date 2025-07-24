<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\Agent;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatisticsController extends Controller
{
    public function index()
    {
        try {
            // Total tickets
            $totalTickets = Ticket::count();
            
            // Average wait time (simplified calculation)
            $averageWaitTime = 15; // Default average wait time in minutes
            
            // Active agents (all agents are considered active)
            $activeAgents = Agent::count();
            
            // Total agencies (assuming you have an Agency model)
            $totalAgencies = DB::table('agencies')->count() ?? 0;
            
            return response()->json([
                'totalTickets' => $totalTickets,
                'averageWaitTime' => round($averageWaitTime, 1),
                'activeAgents' => $activeAgents,
                'totalAgencies' => $totalAgencies
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'totalTickets' => 0,
                'averageWaitTime' => 0,
                'activeAgents' => 0,
                'totalAgencies' => 0
            ]);
        }
    }
}
