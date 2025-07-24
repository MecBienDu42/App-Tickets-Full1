<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Ticket extends Model
{
    protected $fillable = ['numero_ticket', 'date_creation', 'statut', 'type', 'client_id', 'agent_id'];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function agent()
    {
        return $this->belongsTo(Agent::class);
    }

    /**
     * Génère un numéro de ticket unique basé sur la date et le type.
     *
     * @param string $type
     * @return string
     */
    public static function generateTicketNumber($type)
    {
        // Valider le type
        if (!in_array($type, ['ONEA', 'SONABEL', 'BANQUE'])) {
            throw new \InvalidArgumentException('Type de ticket invalide.');
        }

        // Obtenir la date actuelle
        $date = Carbon::today()->format('Ymd');

        // Préfixe basé sur le type
        $prefix = match ($type) {
            'ONEA' => 'O',
            'SONABEL' => 'S',
            'BANQUE' => 'B',
        };

        // Compter les tickets existants pour ce type et cette date
        $count = self::where('type', $type)
            ->whereDate('date_creation', Carbon::today())
            ->count() + 1;

        // Formater le numéro de ticket (ex. O-20250712-001)
        return sprintf('%s-%s-%03d', $prefix, $date, $count);
    }

    /**
     * Créer un nouveau ticket avec un numéro généré automatiquement.
     *
     * @param array $attributes
     * @return static
     */
    public static function createWithTicketNumber(array $attributes)
    {
        $attributes['numero_ticket'] = self::generateTicketNumber($attributes['type']);
        return self::create($attributes);
    }
}
