import React, { useState } from 'react';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    waitTimePerClient: 5,
    maxTicketsPerDay: 100,
    workingHours: {
      start: '08:00',
      end: '17:00'
    },
    notifications: {
      email: true,
      sms: false,
      push: true
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save settings logic here
    console.log('Settings saved:', settings);
  };

  const handleChange = (section, field, value) => {
    if (section) {
      setSettings({
        ...settings,
        [section]: {
          ...settings[section],
          [field]: value
        }
      });
    } else {
      setSettings({
        ...settings,
        [field]: value
      });
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Paramètres du système</h1>
        <p className="mt-1 text-sm text-gray-600">
          Configurez les paramètres généraux du système de tickets
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* General Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Paramètres généraux</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Temps d'attente par client (minutes)
                </label>
                <input
                  type="number"
                  value={settings.waitTimePerClient}
                  onChange={(e) => handleChange(null, 'waitTimePerClient', parseInt(e.target.value))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Maximum de tickets par jour
                </label>
                <input
                  type="number"
                  value={settings.maxTicketsPerDay}
                  onChange={(e) => handleChange(null, 'maxTicketsPerDay', parseInt(e.target.value))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Heures de travail</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Heure d'ouverture
                </label>
                <input
                  type="time"
                  value={settings.workingHours.start}
                  onChange={(e) => handleChange('workingHours', 'start', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Heure de fermeture
                </label>
                <input
                  type="time"
                  value={settings.workingHours.end}
                  onChange={(e) => handleChange('workingHours', 'end', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.notifications.email}
                  onChange={(e) => handleChange('notifications', 'email', e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Notifications par email
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.notifications.sms}
                  onChange={(e) => handleChange('notifications', 'sms', e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Notifications par SMS
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.notifications.push}
                  onChange={(e) => handleChange('notifications', 'push', e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Notifications push
                </label>
              </div>
            </div>
          </div>

          {/* System Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informations système</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Version</dt>
                  <dd className="text-sm text-gray-900">1.0.0</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Dernière mise à jour</dt>
                  <dd className="text-sm text-gray-900">23 Juillet 2025</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Base de données</dt>
                  <dd className="text-sm text-gray-900">MySQL 8.0</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Serveur</dt>
                  <dd className="text-sm text-gray-900">Laravel 10.x</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-150"
            >
              Sauvegarder les paramètres
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
