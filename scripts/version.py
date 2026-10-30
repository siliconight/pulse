"""Sync visible and embedded app version from package.json before packaging."""
from pathlib import Path
import json,re
root=Path(__file__).resolve().parent.parent
version=json.loads((root/'package.json').read_text())['version']
if not re.fullmatch(r'\d+\.\d+\.\d+',version):raise SystemExit('Invalid version')
(root/'dist/app-version.js').write_text('globalThis.PULSE_VERSION='+json.dumps(version)+';\n')
p=root/'dist/index.html';s=p.read_text();s=re.sub(r'(<span id="appVersion"[^>]*>).*?(</span>)',lambda m:m[1]+'v'+version+m[2],s);p.write_text(s)
