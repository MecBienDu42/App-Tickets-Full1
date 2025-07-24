<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Models\Agent;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthentificationController extends Controller
{
    //
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Identifiants incorrects.'],
            ]);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'message' => 'Connexion réussie',
        ], 200);
    }


    public function register(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'role' => 'required|in:agent,admin',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'role' => $request->role,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        if ($request->role === 'agent') {
            $agent = new Agent();
            $agent->user_id = $user->id;
            $agent->save();
        } elseif ($request->role === 'admin') {
            $admin = new Admin();
            $admin->user_id = $user->id;
            $admin->save();
        }

        return response()->json([
            'data' => $user,
            'message' => 'Utilisateur créé avec succès',
        ], 201);
    }

    public function deconnexion(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json(['message' => 'Déconnexion réussie']);
    }

    public function profile(Request $request)
    {
        return response()->json([
            'user' => $request->user(),
            'message' => 'Profil récupéré avec succès',
        ], 200);
    }

    public function updateProfile(Request $request)
    {
        try {
            // Basic validation rules
            $rules = [
                'nom' => 'required|string|max:255',
                'prenom' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email,' . $request->user()->id,
            ];
            
            // Check if password is being changed (not empty and not null)
            $isChangingPassword = $request->has('password') && !empty($request->password) && trim($request->password) !== '';
            
            // Add password validation only if password is being changed
            if ($isChangingPassword) {
                $rules['current_password'] = 'required|string';
                $rules['password'] = 'required|string|min:8';
                $rules['password_confirmation'] = 'required|string|same:password';
            }
            
            // Validate the request
            $validated = $request->validate($rules);
            
            $user = $request->user();

            // Update basic info
            $user->nom = $validated['nom'];
            $user->prenom = $validated['prenom'];
            $user->email = $validated['email'];

            // Update password if provided
            if ($isChangingPassword) {
                // Verify current password
                if (!$request->current_password || !Hash::check($request->current_password, $user->password)) {
                    return response()->json([
                        'message' => 'Le mot de passe actuel est incorrect',
                        'errors' => [
                            'current_password' => ['Le mot de passe actuel est incorrect']
                        ]
                    ], 422);
                }
                $user->password = Hash::make($validated['password']);
            }

            $user->save();

            return response()->json([
                'user' => $user,
                'message' => 'Profil mis à jour avec succès',
            ], 200);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la mise à jour du profil',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
