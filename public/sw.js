
self.addEventListener('install', function (event) {
	event.waitUntil(
		caches.open('v0').then(function (cache) {
			return cache.addAll(['/index.html', '/looks.css', '/logic.js', '/favicon.png', '/img/notfound.png']);
		})
	);
});

self.addEventListener('fetch', function (event) {
	event.respondWith(
		caches.match(event.request).then(function (cacheResponse) {
			if (cacheResponse !== undefined) return cacheResponse;
			return fetch(event.request).then(function (networkResponse) {
				const clonedResponse = networkResponse.clone();
				caches.open('v0').then(function (cache) {
					cache.put(event.request, clonedResponse);
				});
				return networkResponse;
			}, function (error) {
				console.error(error);
				return caches.match('/img/notfound.png');
			});
		})
	);
});