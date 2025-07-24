<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

echo "=== DIAGNOSTIC LOGIN ===\n\n";

// 1. Vérifier les utilisateurs
echo "1. Utilisateurs dans la base de données:\n";
$users = User::all(['email', 'role']);
foreach ($users as $user) {
    echo "   - {$user->email} ({$user->role})\n";
}
echo "   Total: " . $users->count() . " utilisateurs\n\n";

// 2. Tester la validation du mot de passe
echo "2. Test de validation du mot de passe:\n";
$testUser = User::where('email', 'admin@test.com')->first();
if ($testUser) {
    $passwordCheck = Hash::check('password', $testUser->password);
    echo "   - Utilisateur admin@test.com trouvé: OUI\n";
    echo "   - Mot de passe 'password' valide: " . ($passwordCheck ? 'OUI' : 'NON') . "\n";
} else {
    echo "   - Utilisateur admin@test.com: NON TROUVÉ\n";
}

// 3. Tester la création de token
echo "\n3. Test de création de token:\n";
if ($testUser) {
    try {
        $token = $testUser->createToken('test-token')->plainTextToken;
        echo "   - Token créé avec succès: " . substr($token, 0, 20) . "...\n";
    } catch (Exception $e) {
        echo "   - Erreur création token: " . $e->getMessage() . "\n";
    }
} else {
    echo "   - Impossible de tester (utilisateur non trouvé)\n";
}

echo "\n=== FIN DIAGNOSTIC ===\n";
