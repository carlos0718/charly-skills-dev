# Arquitecturas — árboles de carpetas por tipo y tamaño

Este archivo lo usa `/new-project` en el paso P4 para proponer y crear la estructura del proyecto.

## Cómo elegir (regla del mentor)

> El tamaño de la arquitectura debe **igualar** el tamaño del proyecto. Una landing con HTML+CSS+JS no necesita Clean Architecture. Una app empresarial multi-equipo no se sostiene en una carpeta `components/` plana.

Si el usuario duda, recomendá con justificación corta basada en el alcance que describió en P1.

## CÓDIGO

### Mini — HTML/CSS/JS estático, landing, demo

Cuándo: 1 página, sin estado complejo, sin backend, sin build (o build mínimo).

```
<project>/
├── index.html
├── styles/
│   └── style.css
├── scripts/
│   └── main.js
├── assets/
│   ├── images/
│   └── fonts/
├── CLAUDE.md
├── README.md
└── TODO.md
```

### Chico — SPA simple (1–2 features)

Cuándo: SPA con pocas pantallas, sin estado global pesado.

```
<project>/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── utils/
│   ├── styles/
│   └── main.tsx
├── public/
├── tests/
├── CLAUDE.md
├── README.md
└── TODO.md
```

### Mediano — Feature-based (recomendado para casi todo)

Cuándo: varias features independientes, estado compartido, equipo chico.

```
<project>/
├── src/
│   ├── features/
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── api/
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   └── dashboard/
│   │       └── ...
│   ├── shared/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── types/
│   ├── app/
│   │   ├── router.tsx
│   │   └── providers.tsx
│   └── main.tsx
├── public/
├── tests/
├── CLAUDE.md
├── README.md
└── TODO.md
```

### Grande — Clean / Hexagonal

Cuándo: dominio complejo, multi-equipo, tests pesados, necesidad de aislar la lógica de negocio del framework.

```
<project>/
├── src/
│   ├── domain/
│   │   ├── entities/
│   │   ├── value-objects/
│   │   └── repositories/        ← interfaces
│   ├── application/
│   │   ├── use-cases/
│   │   ├── services/
│   │   └── ports/
│   ├── infrastructure/
│   │   ├── persistence/         ← implementaciones de repositories
│   │   ├── http/
│   │   ├── messaging/
│   │   └── external-services/
│   ├── presentation/
│   │   ├── components/          ← si hay UI
│   │   ├── controllers/         ← si es API
│   │   └── views/
│   └── main.ts
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/
├── CLAUDE.md
├── README.md
└── TODO.md
```

### Libre

El usuario describe la estructura que quiere y la skill la crea. Sin opinión.

## CREATIVO

### Video ad / motion piece

Cuándo: cualquier producción de video con AI o motion design.

```
<project>/
├── 01-brief/
│   ├── BRIEF.md
│   └── client-references/       ← assets que mandó el cliente
├── 02-references/
│   ├── moodboard/               ← screenshots, key visuals
│   └── inspiration.md
├── 03-prompts/
│   └── prompts.md               ← plantilla por bloques (STYLE/BACKGROUND/FRAMING/OUTPUT)
├── 04-raw-frames/
│   ├── hero/                    ← outputs de AI image
│   ├── ingredients/
│   └── transitions/
├── 05-clips/
│   ├── runway/                  ← outputs de AI video por tool
│   ├── kling/
│   └── selects/                 ← los que pasaron el filtro
├── 06-edit/
│   ├── <project>.prproj         ← Premiere
│   ├── <project>.drp            ← DaVinci
│   └── <project>.aep            ← After Effects
├── 07-exports/
│   ├── 9x16/                    ← TikTok, Reels, Shorts
│   ├── 1x1/                     ← feed cuadrado
│   └── 16x9/                    ← YouTube, web
├── STORYBOARD.md
├── CLAUDE.md
├── README.md
└── TODO.md
```

### Social content batch (semanal, recurrente)

Cuándo: producción seriada (un Reel por semana, threads, etc.).

```
<project>/
├── templates/
│   ├── BRIEF.template.md
│   └── prompts.template.md
├── episodes/
│   ├── 2026-W22-tema1/
│   │   ├── BRIEF.md
│   │   ├── prompts.md
│   │   ├── raw-frames/
│   │   ├── clips/
│   │   ├── edit/
│   │   └── exports/
│   └── 2026-W23-tema2/
├── shared-assets/
│   ├── logos/
│   ├── fonts/
│   └── music/
├── CLAUDE.md
├── README.md
└── TODO.md
```

### Branding visual / key visuals

Cuándo: producción de assets estáticos sin video.

```
<project>/
├── brief/
├── references/
├── prompts/
├── outputs/
│   ├── round-1/
│   ├── round-2/
│   └── final/
├── delivery/
│   ├── png/
│   ├── jpg/
│   └── tiff/
├── CLAUDE.md
├── README.md
└── TODO.md
```

## HÍBRIDO

### Landing con animación 3D

Cuándo: web con un objeto 3D, animación scroll-driven, o efectos avanzados.

```
<project>/
├── src/
│   ├── components/
│   ├── scenes/                  ← componentes R3F
│   ├── shaders/                 ← .glsl o strings GLSL
│   ├── hooks/
│   ├── styles/
│   └── main.tsx
├── public/
│   ├── models/                  ← .glb, .gltf
│   ├── textures/                ← .hdr, .ktx2, .webp
│   └── lottie/                  ← .json de Lottie
├── assets-raw/                  ← .blend, .c4d, archivos fuente
├── references/                  ← inspiración visual
├── tests/
├── CLAUDE.md
├── README.md
└── TODO.md
```

### Web inmersiva (multi-escena)

Cuándo: portfolio inmersivo, sitio con varias escenas 3D coreografiadas.

```
<project>/
├── src/
│   ├── scenes/
│   │   ├── intro/
│   │   ├── about/
│   │   └── work/
│   ├── components/
│   ├── shaders/
│   ├── hooks/
│   ├── choreography/            ← Theatre.js timelines
│   └── main.tsx
├── public/
│   ├── models/
│   ├── textures/
│   └── audio/
├── assets-raw/
├── references/
├── CLAUDE.md
├── README.md
└── TODO.md
```

## APRENDIZAJE (`/learning-roadmap`)

```
<learning-project>/
├── ROADMAP.md                   ← concept map Mermaid + fases
├── exercises/
│   ├── 01-<nombre>.md
│   ├── 02-<nombre>.md
│   └── README.md
├── notes.md
├── resources.md                 ← docs + canales YT + términos de búsqueda
├── checkins.md
└── CLAUDE.md
```
