Nuzlocke Gauntlet - homescreen kit
==================================

Put every file in this zip at the ROOT of the repo, alongside each other.
index.html replaces NuzlockeTrackerWithSound.html - delete the old one.

  index.html               your tracker, with the icon + offline hooks added
  manifest.webmanifest     name, icons, standalone display
  sw.js                    service worker, gives offline access
  apple-touch-icon.png     180x180, the icon iOS uses
  icon-192.png             android / manifest
  icon-512.png             android / manifest, splash
  icon-maskable-512.png    android adaptive icon

Then: Settings > Pages > Deploy from a branch > main > / (root) > Save.
Open https://noxanimusvicta.github.io/Nuzlocke-Tracker/ in Safari,
Share > Add to Home Screen.

To update later: edit index.html in the repo and push. The service worker
fetches the page fresh whenever you have signal, so the app picks it up on
the next launch. If it ever feels stuck on an old copy, bump the CACHE
string at the top of sw.js.
