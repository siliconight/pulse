# Pulse security

Pulse's portable launcher serves embedded assets only on `127.0.0.1:48761`. The browser decodes audio locally. It has no login, cloud upload endpoint, or automatic updater. Import only audio and plans you trust, and review downloads before using them in a game project.

## Release checks

- Download from the project's GitHub Releases page, not a third-party mirror.
- Compare the archive's SHA-256 digest with `SHA256SUMS.txt` attached to the same release. This detects accidental corruption; unsigned checksums on the same page do not independently prove publisher identity.
- Review the source and GitHub Actions run for the tag. Packages are unsigned, so operating-system warnings may appear. Signing and notarization are still future work.
- Keep release creation as a draft until the Mac and Windows packages are tested on real machines.

## Reporting a problem

Use GitHub's private vulnerability reporting if enabled for this repository. Otherwise open an issue that omits exploit details and asks the maintainer for a private contact channel. Do not post working exploit steps or private audio in a public issue.

## Current scope

File sizes, PCM decoding, and imported plan structures have limits and validation. The browser's audio decoder and the operating system's ZIP extraction are outside Pulse's code. Browser security updates remain important. The release workflow currently uses moving major-version tags for GitHub Actions; pin these to reviewed commit SHAs before treating the release pipeline as hardened.
