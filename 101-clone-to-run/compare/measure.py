# Times two real starts on this machine, each cold, as on a new machine, from nothing to a page that answers:
#   the Epic Stack (github.com/epicweb-dev/epic-stack, SQLite), as its docs/getting-started.md says:
#     SKIP_DEPLOYMENT=true npx epicli new epic-app      (deployment to Fly is skipped: neither side deploys)
#     cd epic-app && npm run dev                         (until http://localhost:3000/ answers)
#   the Quillo starter (github.com/quillolang/starter), as its README's "Start" says:
#     git clone --depth 1 --branch v0.8.6 https://github.com/quillolang/starter.git my-app && cd my-app
#     rm -rf .git && git init; sh get-quillo.sh spa; ./run.sh --watch   (until http://127.0.0.1:8080/ answers)
# Cold: an empty npm cache and Playwright browser folder for the first, a fresh clone and Quillo download for the
# second, all in a scratch folder (given first), deleted after. Writes compare/runs.json; the video's numbers come
# from it.   python3 videos/101-clone-to-run/compare/measure.py <scratch dir> [quillo|epic|both]
import json, os, re, shutil, subprocess, sys, time, urllib.request
here = os.path.dirname(os.path.abspath(__file__))
scratch = os.path.abspath(sys.argv[1]); which = sys.argv[2] if len(sys.argv) > 2 else 'both'
out_file = os.path.join(here, 'runs.json')
runs = json.load(open(out_file)) if os.path.exists(out_file) else {}

def sh(cmd, cwd, env=None, timeout=3600):
    t = time.time()
    r = subprocess.run(['sh', '-c', cmd + ' 2>&1'], cwd=cwd, env={**os.environ, **(env or {})}, capture_output=True, text=True, timeout=timeout)
    return {'cmd': cmd, 'secs': round(time.time() - t, 1), 'code': r.returncode, 'out': r.stdout.splitlines()}

def serve(cmd, cwd, url, env=None, limit=600):
    # Starts cmd, and times it until url answers 200; then stops it (its whole process group).
    t = time.time()
    p = subprocess.Popen(['sh', '-c', cmd + ' 2>&1'], cwd=cwd, env={**os.environ, **(env or {})}, stdout=subprocess.PIPE, text=True, start_new_session=True)
    lines, status = [], None
    os.set_blocking(p.stdout.fileno(), False)
    while time.time() - t < limit:
        try:
            for l in iter(p.stdout.readline, ''): lines.append(l.rstrip('\n'))
        except (TypeError, OSError): pass
        try:
            with urllib.request.urlopen(url, timeout=2) as r: status = r.status; body = r.read().decode('utf8', 'replace')
            if status == 200: break
        except Exception: pass
        if p.poll() is not None: break
        time.sleep(0.25)
    secs = round(time.time() - t, 1)
    time.sleep(1)
    try:
        for l in iter(p.stdout.readline, ''): lines.append(l.rstrip('\n'))
    except (TypeError, OSError): pass
    title = re.search(r'<title>([^<]*)</title>', body).group(1) if status == 200 and re.search(r'<title>([^<]*)</title>', body) else None
    os.killpg(p.pid, 15); p.wait(10)
    return {'cmd': cmd, 'secs': secs, 'status': status, 'title': title, 'out': lines}

def du(path):
    return subprocess.run(['du', '-sh', path], capture_output=True, text=True).stdout.split()[0]

machine = {'date': time.strftime('%Y-%m-%d %H:%M'), 'mac': subprocess.run(['sw_vers', '-productVersion'], capture_output=True, text=True).stdout.strip(),
           'cpu': subprocess.run(['sysctl', '-n', 'machdep.cpu.brand_string'], capture_output=True, text=True).stdout.strip(),
           'node': subprocess.run(['node', '--version'], capture_output=True, text=True).stdout.strip(),
           'npm': subprocess.run(['npm', '--version'], capture_output=True, text=True).stdout.strip(),
           'git': subprocess.run(['git', '--version'], capture_output=True, text=True).stdout.strip(), 'load': os.getloadavg()}

if which in ('quillo', 'both'):
    # The starter's README, "Start": the clone, a history of your own, a sample (spa: SQLite, live), then the server.
    d = os.path.join(scratch, 'q'); shutil.rmtree(d, ignore_errors=True); os.makedirs(d)
    r = {'machine': machine}
    r['clone'] = sh('git clone --depth 1 --branch v0.8.6 https://github.com/quillolang/starter.git my-app', d)
    app = os.path.join(d, 'my-app')
    r['init'] = sh('rm -rf .git && git init', app)
    r['get'] = sh('sh get-quillo.sh spa', app)
    r['run'] = serve('./run.sh --watch', app, 'http://127.0.0.1:8080/')
    r['total'] = round(sum(r[k]['secs'] for k in ('clone', 'init', 'get', 'run')), 1)
    r['size_app'] = du(app); r['size_quillo'] = du(os.path.join(app, '.quillo'))
    r['files_app'] = int(subprocess.run(f'find "{app}" -type f -not -path "*/.git/*" -not -path "*/.quillo/*" | wc -l', shell=True, capture_output=True, text=True).stdout)
    r['load_after'] = os.getloadavg()
    runs.setdefault('quillo', []).append(r)
    shutil.rmtree(d, ignore_errors=True)

if which in ('epic', 'both'):
    d = os.path.join(scratch, 'e'); shutil.rmtree(d, ignore_errors=True); os.makedirs(d)
    env = {'npm_config_cache': os.path.join(d, 'npm-cache'), 'PLAYWRIGHT_BROWSERS_PATH': os.path.join(d, 'browsers'), 'SKIP_DEPLOYMENT': 'true', 'CI': ''}
    r = {'machine': machine}
    r['new'] = sh('SKIP_DEPLOYMENT=true npx epicli new epic-app', d, env)
    app = os.path.join(d, 'epic-app')
    r['run'] = serve('npm run dev', app, 'http://localhost:3000/', env)
    r['total'] = round(r['new']['secs'] + r['run']['secs'], 1)
    r['size_app'] = du(app); r['size_node_modules'] = du(os.path.join(app, 'node_modules'))
    r['size_cache'] = du(env['npm_config_cache']); r['size_browsers'] = du(env['PLAYWRIGHT_BROWSERS_PATH']) if os.path.exists(env['PLAYWRIGHT_BROWSERS_PATH']) else '0'
    r['packages'] = int(subprocess.run('npm ls --all --parseable 2>/dev/null | wc -l', shell=True, cwd=app, capture_output=True, text=True, env={**os.environ, **env}).stdout)
    r['load_after'] = os.getloadavg()
    runs.setdefault('epic', []).append(r)
    shutil.rmtree(d, ignore_errors=True)

json.dump(runs, open(out_file, 'w'), indent=1, ensure_ascii=False)
for k in ('quillo', 'epic'):
    for r in runs.get(k, []): print(k, r['machine']['date'], 'total', r['total'], 's', {x: r[x]['secs'] for x in r if isinstance(r[x], dict) and 'secs' in r[x]})
