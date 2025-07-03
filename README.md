# Génération d'attestations

J'utilise [pdfkit](https://pdfkit.org) ([doc](https://pdfkit.org/docs/guide.pdf))

- adapté depuis https://codepen.io/blikblum/pen/YboVNq?editors=1010
- pdfkit.standalone.js downloaded from: https://github.com/devongovett/pdfkit/releases/download/v0.10.0/pdfkit.standalone.js
- blob-stream.js downloaded from: https://github.com/devongovett/blob-stream/releases/download/v0.1.3/blob-stream.js

En live sur : http://youngfrog.lavnir.be/generateur-attestations/

Les serveurs gesetu n'ont pas activé le CORS. Pour contourner cela on peut :

- avec firefox : ajouter l'extension qui se trouve dans ./firefox_extension_mv2 via about:debugging#/runtime/this-firefox -> Load Temporary Add-On et choisir le fichier manifest.json
- avec chrome : lancer chrome/chromium avec un profil temporaire sans les sécurités : chrome --disable-web-security --user-data-dir=/tmp/devprofile