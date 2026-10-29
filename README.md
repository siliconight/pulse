# Pulse — Tempo Lab

Browser-based music direction and WAV clip preparation by Brannen Graves.

## Run locally on Mac

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
