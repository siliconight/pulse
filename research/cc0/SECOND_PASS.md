# Pulse CC0 research: second pass

Expanded from four to twelve downloaded tracks, with eight additional track pages explicitly marked CC0. The additions include jazz, classical, folk/experimental and vocal material by seven artist identities. This remains an analysis study: there are no listening truth labels and no demonstrated cut-quality improvement yet.

## Experiment: does the estimated tempo agree across a song?

Run `node research/cc0/expand.cjs` with Node, curl and FFmpeg. It verifies each track page's explicit CC0 notice, downloads audio and runs Pulse's estimator on first, middle and last 30-second excerpts. Analysis uses mono PCM at 11025 Hz; the envelope's actual sample rate is passed to the estimator. SHA-256 hashes and source URLs are recorded. Segment estimates are independent and do not prove the actual musical tempo. Two excerpts near each other can overlap in short recordings.

The table shows raw BPM estimates. Spread is max/min minus one, before half/double reconciliation. It is estimator disagreement, not measured tempo drift.

| Track | Start / middle / end BPM | Raw spread | Status |
|---|---|---|---|
| 1 (jazz) | 90.5/90.5/90.4 | 0.1% | analysis only |
| Sonata No. 1 – Movement 1 | 108.2/116.8/60 | 94.7% | decode warning; exclude |
| Cris | none/185.6/127.2 | None% | analysis only |
| Coldness | 180.7/184.7/89 | 107.5% | analysis only |
| Hélice | 145.2/151.7/148.1 | 4.5% | analysis only |
| 4 mei | 190.7/126.8/63 | 202.7% | analysis only |
| Lay down the law | 87.7/90.4/94.6 | 7.9% | analysis only |
| Ua Like No A Like | 73.8/77.7/169.6 | 129.8% | analysis only |

The jazz example is internally consistent around 90.5 BPM; that still does not prove its tempo or downbeat. Several others vary by roughly a factor of two or three. Those ratios must be tested as metrical alternatives before claiming the song speeds up. Cris has no estimate in its opening excerpt. The classical file produced a decoder warning and is excluded from benchmark acceptance conclusions until a clean recording is obtained; its output is retained as diagnostic evidence.

## Experiment: fade shape and correlation

Run `node research/cc0/fade-check.cjs`. A deterministic synthetic signal test measures the midpoint, not an entire musical transition:

- Identical material: linear gains preserve level; equal-power gains add 3.010 dB.
- Independent noise: linear gains reduce RMS by about 3.022 dB; equal-power gains change RMS by about -0.012 dB.
- Opposite polarity copies cancel completely at the midpoint under either curve.

This supports checking phase/correlation and overlap peaks before choosing a fade. It does not justify a universal correlation threshold. Audacity's own manual distinguishes constant-gain fades for correlated audio and constant-power fades for unrelated material: https://www.audacityteam.org/manual/effects/fading/crossfade-tracks/

## Research-informed rules for the remix design

1. Analyze several excerpts before accepting a fixed grid. Compare BPM estimates after testing half/double hypotheses; keep raw disagreement visible. Distinguish “tempo uncertain” from “tempo changes.”
2. Track beat positions and downbeats separately from BPM. A consistent average BPM is insufficient to anchor bar cuts. Return a free-time path when there is no stable beat.
3. Treat the start, middle and end differently. An intro can lack drums while later sections provide enough rhythm to establish the grid.
4. Score every directed A-to-B join independently. Fade direction, tail content and the destination attack matter; a symmetric similarity score is insufficient.
5. Test direct cut, linear fade and equal-power fade, then measure overlap peaks. Penalize cancellation and transient smearing. Offer a bridge or alternate destination when none is acceptable.
6. Maintain separate loop-repeat and arrangement-transition scores. A phrase can repeat well yet make a poor transition to another phrase.
7. Preserve vocals and sustained sounds conservatively. Until vocal/phrase boundary analysis is validated, make strong chops a creator-approved option.
8. Require clean decoding and sample bounds before any musical score is considered. Reject or quarantine problematic inputs in the research benchmark.

The next benchmark needs verified BPM/downbeats, listening labels for phrase boundaries, and blind A/B ratings of joins. Compare against the current Pulse baseline on held-out tracks and artists. Track top-three candidate acceptance, false “safe” joins, correction time and decoded export seams. Confidence labels from different algorithms are not interchangeable probability estimates.

## Primary references

- Track pages and file hashes: expanded-results.json and pilot-results.json.
- Beat and downbeat are distinct inference tasks: https://archives.ismir.net/ismir2021/paper/000033.pdf
- Multi-feature beat candidate agreement: https://essentia.upf.edu/reference/std_BeatTrackerMultiFeature.html
- Rhythm extraction outputs include beat times as well as tempo: https://essentia.upf.edu/tutorial_rhythm_beatdetection.html
- Correlation-sensitive crossfades: https://www.audacityteam.org/manual/effects/fading/crossfade-tracks/

No production weights have been tuned against these unlabelled estimates. No listening approval, automatic mastering, or quality certification is claimed.
