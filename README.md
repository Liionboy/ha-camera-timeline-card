# 📷 Camera Event Timeline Card

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)
[![GitHub release](https://img.shields.io/github/v/release/Liionboy/ha-camera-timeline-card)](https://github.com/Liionboy/ha-camera-timeline-card/releases)
[![License](https://img.shields.io/github/license/Liionboy/ha-camera-timeline-card)](LICENSE)

**Timeline cronologic pentru evenimente de cameră.** Frigate detections, LLM Vision events, snapshot-uri — totul într-un timeline vizual.

## ✨ Features

- Timeline cronologic pentru evenimente
- Frigate detection events
- LLM Vision integration
- Snapshot-uri rapide
- Click-through la detalii
- Visual config editor
- HACS ready

## 📦 Installation

### Option 1: HACS (recommended)

1. Open **HACS** → **Frontend** → ⋮ → **Custom Repositories**
2. Add repository: `Liionboy/ha-camera-timeline-card`
3. Category: **Lovelace** → Click **Add**
4. Find **Camera Event Timeline Card** in HACS → Click **Install**
5. Go to **Settings** → **Dashboards** → **Resources** → **Add**:
   ```
   /hacsfiles/ha-camera-timeline-card/ha-camera-timeline-card.js
   type: JavaScript Module
   ```
6. **Restart Home Assistant** (or clear browser cache with Ctrl+Shift+R)
7. Edit your dashboard → Add card → Search for `ha-camera-timeline-card`

### Option 2: Manual Install

1. Download `ha-camera-timeline-card.js` from [Releases](https://github.com/Liionboy/ha-camera-timeline-card/releases/latest)
2. Copy the file to your Home Assistant `/config/www/` directory
3. Go to **Settings** → **Dashboards** → **Resources** → **Add**:
   ```
   /local/ha-camera-timeline-card.js
   type: JavaScript Module
   ```
4. **Restart Home Assistant** (or clear browser cache)
5. Edit your dashboard → Add card → Search for `ha-camera-timeline-card`

### Option 3: Manual via YAML

Add to your `configuration.yaml`:
```yaml
lovelace:
  resources:
    - url: /local/ha-camera-timeline-card.js
      type: module
```

## ⚙️ Configuration

### Minimal

```yaml
type: custom:ha-camera-timeline-card
```

### Full Configuration

```yaml
type: custom:ha-camera-timeline-card
title: 📷 Camera Timeline
cameras:
  - camera.cameraintrare_snapshots_sub
  - camera.cameraterasa_snapshots_sub
hours_back: 24
show_snapshots: true
```

## 📄 License

MIT
