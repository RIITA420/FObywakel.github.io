let deferredPrompt;

// Obsługa beforeinstallprompt, żeby wyświetlić przycisk instalacji
self.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
    showInstallButton();
});

function showInstallButton() {
    const installButton = document.getElementById("install-button");
    if (installButton) {
        installButton.style.display = "block";
        installButton.addEventListener("click", () => {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                console.log(choiceResult.outcome === "accepted" ? "User accepted the install prompt" : "User dismissed the install prompt");
                deferredPrompt = null;
            });
        });
    }
}

// Instalacja Service Workera i cache'owanie plików
self.addEventListener("install", (event) => {
    console.log("Service Worker: Zainstalowany");
    event.waitUntil(
        caches.open("pwa-cache").then((cache) => {
            return cache.addAll([
                "/index.html",
                "/qr.html",
                "/dowodnowy.html",
                "/css/main.css",
                "/js/main.js",
                "/images/icon-192x192.png",
                "/images/icon-512x512.png"
            ]);
        })
    );
});

// Obsługa zapytań – najpierw sprawdzamy cache, potem sieć
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
