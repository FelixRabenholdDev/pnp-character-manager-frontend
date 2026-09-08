# pnp-character-manager-frontend

Gemeinsames Angular-Frontend für die Verwaltung von Pen-&-Paper-Charakteren über mehrere Regelwerke
hinweg — Teil des [pnp-character-manager](https://github.com/FelixRabenholdDev/pnp-character-manager)-Projekts.

Aktuell angebunden: [`dnd-backend`](https://github.com/FelixRabenholdDev/dnd-backend) (D&D 5e, 2024).

## Tech-Stack

- Angular 22 (Standalone Components, Signals)
- Angular Material
- RxJS
- TypeScript

## Voraussetzungen

- Node.js 24 LTS
- Angular CLI (`npm install -g @angular/cli`)
- Ein laufendes Backend (siehe [`dnd-backend`](https://github.com/FelixRabenholdDev/dnd-backend))

## Lokal starten

1. Abhängigkeiten installieren:
```bash
npm install
```

2. Entwicklungsserver starten:
```bash
ng serve
```

Die Anwendung läuft danach unter `http://localhost:4200`.

**Wichtig:** Das Backend (`dnd-backend`) muss parallel laufen, inklusive der zugehörigen
PostgreSQL-Instanz — siehe README dort für die Einrichtung.

## Umgebungskonfiguration

Die Backend-URL wird über Angulars Environment-System gesteuert:

- `src/environments/environment.development.ts` — für `ng serve` (lokale Entwicklung)
- `src/environments/environment.ts` — für Produktions-Builds

## Tests ausführen

```bash
ng test
```

## Projektstruktur

```
src/app/
├── core/                         Anwendungsweite Dienste
│   ├── models/                    TypeScript-Interfaces, passend zu den Backend-DTOs
│   ├── services/                  HTTP-Kommunikation mit dem Backend
│   ├── interceptors/              Automatisches Anhängen des JWT an Anfragen
│   └── guards/                    Routen-Schutz für nicht eingeloggte Nutzer
├── features/
│   ├── auth/                      Login
│   └── characters/
│       └── dnd5e/                 D&D-5e-spezifische Komponenten
└── shared/                       Wiederverwendbare UI-Bausteine
```

Die Verschachtelung unter `features/characters/` ist bewusst auf weitere Regelwerke vorbereitet
(künftig z. B. `features/characters/pathfinder/`), ohne diese vorab zu implementieren.