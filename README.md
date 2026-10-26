# Fablethread

**Your stories, connected.** Fablethread is a Windows writing studio for books. Draft chapters, shape the outline, and keep characters, places, and ideas connected in one quiet workspace.

![Fablethread app icon](public/brand.png)

## Features

- Distraction-free chapter editor with automatic local saving
- Book and chapter word targets
- Four-stage outline: Idea, Draft, Revision, Done
- Visual story map with editable nodes and connections
- Search across chapter titles, summaries, and text
- Focus mode and full-manuscript Markdown export
- Windows installer and portable edition

The app works offline and requires no account. It stores the library in the local application data folder. Existing libraries from the earlier **Nó de Tinta** build are read on first launch and copied into Fablethread's own data folder when saved; the original remains intact. The text you wrote is kept in its original language.

## Run from source

Requires Node.js 20 or later.

```bash
npm install
npm run dev
```

## Verify and package

```bash
npm test
npm run build
npm run dist
```

Windows packages are written to `release/`. This preview release is unsigned.

## Product decisions

The app keeps the local ownership, links, and visual planning people praise in Obsidian while giving book writers a ready-made manuscript and outline. The [research notes](docs/obsidian-research.md) summarize the source feedback.

## License

MIT
