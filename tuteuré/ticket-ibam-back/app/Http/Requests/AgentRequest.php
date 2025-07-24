<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AgentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->role === 'admin';
    }

    public function rules(): array
    {
        $rules = [
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')],
            'telephone' => 'required|string|max:20',
            'adresse' => 'required|string|max:500',
        ];

        if ($this->isMethod('POST')) {
            $rules['password'] = 'required|string|min:8';
        } else if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
            // Récupérer l'agent par son ID pour obtenir l'user_id
            $agentId = $this->route('agent');
            $agent = \App\Models\Agent::find($agentId);
            
            if ($agent) {
                $rules['email'] = ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($agent->user_id, 'id')];
            }
            // Supprimer la validation 'confirmed' pour le mot de passe car le frontend n'envoie pas password_confirmation
            $rules['password'] = 'nullable|string|min:8';
        }

        return $rules;
    }
}
