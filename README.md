# Pulse — Tempo Lab

**Shape one piece of music around the moment.** Pulse lets composers, directors, and game teams try tempo changes, emotional effects, and event-ready loops using a finished WAV. Hear an idea, adjust it, and take the audio or direction with you.

By Brannen Graves.

## For creators

### Get Pulse

Download [Pulse for Mac or Windows](https://github.com/siliconight/pulse/releases), unzip the download, and double-click **Start Pulse**. It opens in your browser and works locally, without an account or internet connection. Choose **Stop Pulse** when you're done. If Releases is empty, the first downloadable release has not been published yet.

The Mac package targets macOS Big Sur 11 or newer on Intel and Apple Silicon. The Windows package targets Windows 10/11 x64. These first packages are unsigned, so your computer may ask you to approve opening them. For Mac, try right-click → Open; on Windows, review the SmartScreen prompt. Keep the extracted folder together.

### Start with a track

1. Drop in a WAV or use the demo. Enter the BPM it was recorded at. If you don't know it, use **Detect BPM** in Prepare audio clips and listen to confirm the estimate.
2. In **Scene & emotion**, choose a starting point: Slow heartbeat, Build up, Tension, Menu, Level, Prep, Going Hot, Credits, Cinematic Lo-fi, or Downed / Bleeding Out. Press **Play cue timeline** to hear it.
3. Change the pace, cue timing, and effect controls until the moment feels right. Save your direction in the browser or export a direction JSON to share or back up.
4. Choose **Record WAV take** to capture a performed scene, or go to **Prepare audio clips** to cut beat-aligned loops from the original track.

**Downed / Bleeding Out** gradually slows the music and a double heartbeat over 10 seconds, muffles the highs, and holds that feeling until you choose Revive or Stop. Its Speed, Muffle, and Heartbeat strength controls let you shape the effect.

### What comes out

- **WAV takes** capture performed tempo changes and effects in real time, up to 120 seconds.
- **Clip WAVs** are cuts of your original recording at its original pace. Use the time signature and BPM to suggest lengths, then review the boundaries before exporting.
- **Direction JSON** carries your scene settings and cues for another session or collaborator. It does not contain the audio.

Your browser chooses the download folder. Your music is processed on your computer. Saved directions live in that browser's local storage, so export JSON for a durable copy. A full track repeated end to start may click; listen to the join before using it as a game loop.

Pulse is currently a creative audition and clip preparation tool. It is not yet a Logic plug-in or a live Godot audio engine. Recorded scene takes use browser timing, so check timing and sound quality before final delivery.

## For engineers

### Run the source

Install Node.js, then from the repository root run:

```sh
npm start
```

Open http://localhost:8000. There are no npm dependencies or build steps for local development. The release launcher instead embeds the static `dist/` app in a small Go executable and serves it at http://127.0.0.1:48761. It opens the default browser and adds a Stop Pulse control. It binds to loopback only.

Tests:

```sh
npm test
go test ./...
```

`dist/` contains the application source and audio workers; `tests/` contains timing, meter, BPM, clip, and effect checks; `launcher.go` handles portable local startup; `scripts/package.py` assembles release ZIPs. `.openai/hosting.json` identifies the separate hosted site and is not a credential.

### Build and release

Install Go **1.24.13** and Python 3. Go 1.24 is the last Go series supporting macOS 11.

```sh
python3 scripts/package.py
```

The outputs are `releases/pulse-mac.zip`, `releases/pulse-windows.zip`, and `SHA256SUMS.txt`. The Mac ZIP carries Intel and Apple Silicon executables and selects the right one at launch. The Windows ZIP carries an x64 executable. Runtime users do not need Go, Python, or Node.js.

Push source first, then a version tag matching `package.json` (currently `v0.2.0`). GitHub Actions tests on Linux, Mac, and Windows, builds both packages, and creates a **draft** release. Test WAV loading, playback, effects, recording, export, stop/relaunch, paths with spaces, and OS security prompts on real Mac and Windows devices before publishing. CI does not test Big Sur itself.

The portable release has no native installer, signing, automatic updates, or native file picker. Browser pitch preservation and recording behavior vary by browser. The launcher uses local Host checks and a same-origin shutdown token. Pushing this repo does not automatically deploy the separate hosted site.

A license has not yet been selected for this repository.
