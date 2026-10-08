Run locally (fetch() needs a server, not file://):
  cd gamesite && python3 -m http.server 8000
  then open http://localhost:8000

Add a game: append an object to games.json with id, title, category, color,
description, and an "iframe" string (escape quotes as \").
