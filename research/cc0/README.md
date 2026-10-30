# Pulse CC0 music analysis: pilot 1

This is a **measurement pilot**, not an ear-approved remix benchmark. No source audio is committed. Each track's page explicitly identified CC0 1.0 when checked on 2026-10-30. The downloader checks that text again before retrieving audio. Retain the artist, track, source URL, and SHA-256 in `pilot-results.json`. CC0 does not require credit, but source credit is useful for reproducibility.

## Reproduce

Requires Node.js, FFmpeg/FFprobe, curl, and network access:

```sh
node research/cc0/fetch.cjs
node research/cc0/pilot.cjs
```

The pilot decodes each track to 11,025 Hz mono for analysis; audio remains unmodified on disk. It runs the current Pulse BPM, phrase, cut, and join functions, assuming 4/4 and downbeat at zero. This assumption is deliberately exposed: it is not verified by the current detector. `pilot-results.json` contains source URLs and checksums, scores, candidate times, cut shifts, and join flags.

## Initial observations

| Track | Approx. duration | Estimated BPM | BPM confidence | Top 4-bar candidate | Top join flag |
|---|---:|---:|---|---:|---|
| Game BOI 1 (HoliznaCC0) | 2:46 | 90.0 | Tentative | 149.33 s | none |
| Something In the Air (HoliznaCC0) | 2:12 | 78.4 | Tentative | 107.14 s | 8.7 dB level difference |
| Dark Ambient Cave Experience (techtheist) | 14:07 | 164.6 | Tentative | 591.98 s | none |
| Classic (HoliznaCC0) | 2:30 | 60.3 | Tentative | 103.48 s | none |

The ambient file is 14:07, beyond Pulse’s current 10-minute import limit, and is a stress case only; do not count it as an in-app acceptance test.

These are tool outputs, not verified BPM, meter, downbeats, or good cuts. In particular, a steady high BPM on an ambient track can be a periodic texture rather than a musically meaningful beat. A join with no current flag can still have a harmonic clash, chopped tail, or unwanted repetition. The first two top Game BOI 4-bar candidates are 149.33 s and 64.00 s; selecting by score alone makes no assertion about narrative fit.

## Candidate rule set to validate

1. **Do not auto-release on a tentative grid.** Show half/double tempo and downbeat alternatives. Require a creator to approve the grid or explicitly choose free-time cutting.
2. **Score phrase boundaries using both repetition and novelty.** Compare across nonadjacent bars and detect changes at multiple scales. The current energy/zero-crossing/flux summary is only a coarse proxy for timbre; add tonal features before treating it as structure.
3. **Separate structural cuts from seam repair.** Keep beat or phrase entry/exit positions; search only a narrow shared shift for clicks, and retain pre-entry and post-exit handles rather than swallowing meaningful pickups/tails with a fade.
4. **Do not smooth every join by default.** Audition a direct cut, a short fade, and a bridge when available. Flag level, transient, harmony, tail, and phase issues separately. The current 5 dB level flag and 25 ms seam search are provisional constants, not validated perceptual thresholds.
5. **Arrange by role with constraints.** Require an intro/exploration candidate, a build/peak, and a recovery; avoid repeating the same source phrase immediately. Preserve source chronology as one candidate, since high similarity alone can destroy the song's progression.
6. **Explain every suggestion.** Provide candidate times, score components, confidence, and playback A/B. Reject the word “release-ready” until the listening and export tests pass.

## Listening labels needed before changing production weights

For each track, independently annotate the tempo/meter/downbeat or “free time,” 3–5 phrase boundaries, up to three loop bodies, and at least five transitions. Rate each join blind (0 = unusable, 1 = repairable, 2 = usable) and note click, chopped note, timing, level, harmony, or story mismatch. Repeat the ratings with the loop playing three times and in a proposed game arc. A second listener should rate a subset; disagreement is a reason to show options, not to force a single ground truth.

Hold out at least a third of tracks when tuning. Measure top-three boundary acceptance, usable join precision, false “safe” joins, tempo/downbeat error, and creator repair time. Include ambient, live/variable tempo, vocals, and existing seamless loops. Only then assign numeric rule weights or claim improvement.

## References

- [Librosa beat tracking](https://librosa.org/doc/latest/generated/librosa.beat.beat_track.html): onset strength, tempo estimation, beat placement.
- [Librosa music segmentation](https://librosa.org/doc/main/auto_tutorials/03-advanced/plot_segmentation.html): beat-synchronous recurrence and local similarity.
- [Wwise interactive music guide](https://www.audiokinetic.com/download/documents/WwiseProjectAdventure_en.pdf): entry/exit cues, pre/post-entry, and transition rules.
- [Creative Commons CC0 reuse guidance](https://creativecommons.org/reusing-cc-licensed-content/).
