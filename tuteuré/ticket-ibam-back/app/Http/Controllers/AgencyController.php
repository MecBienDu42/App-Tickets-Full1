<?php

namespace App\Http\Controllers;

use App\Models\Agency;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AgencyController extends Controller
{
    public function index()
    {
        try {
            $agencies = Agency::where('is_active', true)->get();
            return response()->json($agencies);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Unable to fetch agencies'], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:500',
            'phone' => 'required|string|max:20',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            // Mock response - replace with actual database insertion
            $agency = [
                'id' => rand(3, 1000),
                'name' => $request->name,
                'address' => $request->address,
                'phone' => $request->phone,
                'latitude' => $request->latitude,
                'longitude' => $request->longitude,
                'created_at' => now(),
                'updated_at' => now()
            ];

            return response()->json($agency, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Unable to create agency'], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:500',
            'phone' => 'required|string|max:20',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            // Mock response - replace with actual database update
            $agency = [
                'id' => $id,
                'name' => $request->name,
                'address' => $request->address,
                'phone' => $request->phone,
                'latitude' => $request->latitude,
                'longitude' => $request->longitude,
                'updated_at' => now()
            ];

            return response()->json($agency);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Unable to update agency'], 500);
        }
    }

    public function destroy($id)
    {
        try {
            // Mock response - replace with actual database deletion
            return response()->json(['message' => 'Agency deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Unable to delete agency'], 500);
        }
    }
}
