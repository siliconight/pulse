# Pulse — Tempo Lab

Browser-based music direction and WAV clip preparation by Brannen Graves.

## Download and open

Download **pulse-mac.zip** or **pulse-windows.zip** from [Releases](https://github.com/siliconight/pulse/releases), extract the entire folder, then double-click **Start Pulse**. The release ZIPs are separate from GitHub's automatic Source code downloads.

The launcher bundles everything it needs. Users do not install Node.js, Python, or Go. Pulse opens in the default browser at http://127.0.0.1:48761 and runs offline. Keep the launcher window open; finish recording and download your work before choosing **Stop Pulse** in the browser. Closing only the browser tab does not stop the launcher. Starting it again reopens an existing session.

Mac target: Big Sur 11 or newer, Intel and Apple Silicon. Windows target: Windows 10/11 x64. These are unsigned builds; OS security prompts may appear. Only open downloaded software you trust. On Mac, right-click Open or Privacy & Security may be needed. Browser and audio compatibility require real-device testing; Chrome is the initial test browser. This package does not include a browser.

Your presets stay in this browser's local storage. This local address has separate storage from the hosted app and the development server; use direction JSON export/import to move presets. Downloads follow browser settings. Keep the extracted folder together.

## Run from source

Install Node.js (includes npm), then run from this folder:

```sh
npm start
```

Open http://localhost:8000 in Chrome. Keep the tab visible during playback and recording. Localhost supports the audio worklet used for recording. No npm packages or build step are required.

## Use

Load a WAV or try the demo. Enter its recorded BPM. Choose Scene & emotion for tempo directions, game presets, and emotion layers, or Prepare audio clips for beat-grid cuts and WAV exports. BPM detection and editable time signatures are available in clip preparation.

Downed / Bleeding Out slows the music and heartbeat over 10 seconds, then holds. Revive returns to normal over four seconds. The BPM must be accurate; repeating an entire track does not guarantee a seamless join.

Record WAV take captures a performed scene in real time, up to 120 seconds. Ordinary clip exports use the original source tempo. Downloads go to the browser's configured download folder. Audio is processed locally; direction JSON does not contain audio.

## Check

```sh
npm test
```

Tests use Node's built-in assertions, with no external dependencies. Automated tests do not replace listening tests or Mac/browser compatibility checks.

## Layout

- `dist/`: directly served HTML, JavaScript, audio workers, and DSP helpers. These are the source files; do not ignore this folder.
- `tests/`: Node-based checks for timing, meter, BPM detection, clip assets, and generated effects.
- `scripts/`: local development server and test runner.
- `.openai/hosting.json`: existing hosted-site identity and static directory. It is not a credential. Preserve it when updating that deployment.

## Current limits

This is a browser prototype, not a Logic Audio Unit or a native Godot audio engine. Pitch preservation depends on the browser. Playback scheduling and recorded takes are not sample-accurate mastering. Game presets are editable directions, not live game-event integrations. Separate generated layers are not certified seamless loops.

## Source and hosting

Intended GitHub repository: https://github.com/siliconight/pulse

The existing hosted app uses a separate hosting-managed Git repository. Pushing to GitHub does not automatically update that site; deployment automation is not configured here.

A license has not yet been selected for this repository.

## Build portable packages (maintainers)

Install Go **1.24.13** and Python 3, then run:

```sh
go test ./...
python3 scripts/package.py
```

This creates `releases/pulse-mac.zip`, `releases/pulse-windows.zip`, and `SHA256SUMS.txt`. The Go executable embeds `dist/`; build again after changing the web app. The Mac package chooses its Intel or Apple Silicon binary automatically.

Go 1.24 is the last Go series supporting macOS 11. This is a legacy compatibility toolchain and needs a security/support review before broader distribution. The launcher binds only to loopback, rejects unexpected Host headers, and requires same-origin authenticated shutdown requests. It exposes no upload or arbitrary file-write endpoint.

## Publish a release

Push this source to your repository. Match `package.json` version to the tag:

```sh
git tag v0.2.0
git push origin main
git push origin v0.2.0
```

GitHub Actions runs Node and Go tests on Linux, Mac, and Windows, builds the ZIPs, and creates a **draft release**. Download its assets and check first launch, WAV loading, BPM detection, Downed/Revive, recording, exports, stop/relaunch, and paths containing spaces on actual Mac and Windows machines. Big Sur itself is not covered by the hosted CI runners. Publish the draft after those checks. You can also run the workflow manually to get downloadable build artifacts without creating a release.

Signing, native installers, automatic updates, and native file dialogs are deferred. This portable release does not change the hosted app.
