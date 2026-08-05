// UWAGA: ten Service Worker sluzy WYLACZNIE do obslugi powiadomien push.
// Celowo NIE ma tu zadnej logiki 'fetch'/cache - appka mialaby wczesniej
// powazny problem z serwowaniem nieaktualnych wersji strony przez agresywne
// cache'owanie w Service Workerze. Brak obslugi 'fetch' oznacza, ze
// przegladarka zawsze pobiera swieza wersje strony z serwera, a ten plik
// zajmuje sie tylko wyswietlaniem powiadomien.

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { title: 'Utrudnienia ZG', body: event.data ? event.data.text() : '' };
  }

  const title = data.title || 'Utrudnienia ZG';
  const options = {
    body: data.body || '',
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    data: { url: data.url || '/' },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(clients.openWindow(url));
});
