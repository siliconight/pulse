"""Cross-build self-contained launchers. Requires Go 1.24.x for Big Sur."""
from pathlib import Path
import os, subprocess, zipfile, hashlib, json
root=Path(__file__).resolve().parent.parent
out=root/'releases';out.mkdir(exist_ok=True)
version=json.loads((root/'package.json').read_text())['version']
go=os.environ.get('GO','go')
if not subprocess.check_output([go,'version'],text=True).split()[2].startswith('go1.24.'):
    raise SystemExit('Use Go 1.24.x: newer Go runtimes do not support macOS 11.')
readme=f'''Pulse {version}
Extract this entire ZIP before starting.
Double-click Start Pulse. Your default browser opens the local app.
No Node.js, Python, account, or internet connection is needed to run it.
Keep the launcher window open. Finish recording/downloads, then choose Stop Pulse.
Audio stays in your browser. Downloads use your browser's download folder.
Use Export direction JSON to back up presets; private browsing will not retain them.
Mac: target macOS 11+ (Intel and Apple Silicon). Windows: target Windows 10/11 x64.
These unsigned test releases may show OS security prompts. Only open packages
from a source you trust. On Mac you may need right-click > Open or Privacy & Security.
Keep this folder together. If startup fails, the launcher displays the error.
If your default browser has audio problems, open http://127.0.0.1:48761 in Chrome.
Mac/Windows audio and first-launch behavior still need testing on real machines.
'''
def add(z,name,data,executable=False):
    info=zipfile.ZipInfo(name);info.create_system=3;info.external_attr=(0o100755 if executable else 0o100644)<<16
    z.writestr(info,data,compress_type=zipfile.ZIP_DEFLATED)
for platform,arches in [('mac',['amd64','arm64']),('windows',['amd64'])]:
    target=out/f'pulse-{platform}.zip'
    with zipfile.ZipFile(target,'w') as z:
        add(z,'Pulse/READ-ME.txt',readme)
        for arch in arches:
            binary=out/f'pulse-{platform}-{arch}'
            env={**os.environ,'CGO_ENABLED':'0','GOOS':'darwin' if platform=='mac' else 'windows','GOARCH':arch,'GOTOOLCHAIN':'local'}
            subprocess.run([go,'build','-trimpath','-ldflags=-s -w','-o',str(binary),'.'],cwd=root,env=env,check=True)
            name=f'Pulse/app-files/pulse-{arch}'+('.exe' if platform=='windows' else '')
            add(z,name,binary.read_bytes(),True);binary.unlink()
        if platform=='mac':
            launcher='''#!/bin/bash
cd "$(dirname "$0")" || exit 1
arch="$(uname -m)"
case "$arch" in x86_64) binary=amd64;; arm64) binary=arm64;; *) echo "Unsupported Mac architecture: $arch"; read -r; exit 1;; esac
"./app-files/pulse-$binary"
status=$?
if [ "$status" -ne 0 ]; then echo "Pulse could not start. See the message above. Press Return to close."; read -r; fi
exit "$status"
'''
            add(z,'Pulse/Start Pulse.command',launcher,True)
        else:
            add(z,'Pulse/Start Pulse.bat','@echo off\r\ncd /d "%~dp0"\r\n"app-files\\pulse-amd64.exe"\r\nif errorlevel 1 pause\r\n')
    with zipfile.ZipFile(target) as z: assert z.testzip() is None
checks=''.join(hashlib.sha256(p.read_bytes()).hexdigest()+'  '+p.name+'\n' for p in sorted(out.glob('*.zip')))
(out/'SHA256SUMS.txt').write_text(checks)
print('Packages ready in',out)
