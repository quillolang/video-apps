// The PHP benchmark's servers: Quillo (main.qwe) against plain PHP (php/) served two ways, each with one worker and with four:
// php-fpm behind nginx, as most PHP is served (each request starts fresh; OPcache keeps the compiled code), and
// FrankenPHP in worker mode (the program stays loaded between requests, as Quillo's does). Both with OPcache and its
// JIT on, files never checked for changes; the setups are quillo-benchmarks' (server/run.cjs). Engine: bench-core.mjs.
//   (bench.mjs runs them; run-curl.mjs and the video's shots.mjs start them too)
// PHP_FPM, NGINX and FRANKENPHP name the programs (else php-fpm, nginx and frankenphp on the PATH; inside
// quillo-videos, FrankenPHP 1.14.0 in .cache/dl-bench).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { appDir } from './make-db.mjs';   // writes fortunes.db beside main.qwe
import { buildDir, detached, quilloSetting } from './bench-core.mjs';

export const here = path.dirname(fileURLToPath(import.meta.url)), build = buildDir(here, 'v205'), php = path.join(here, 'php');
const own = path.resolve(here, '../../../.cache/dl-bench/franken/frankenphp');
const franken = process.env.FRANKENPHP || (fs.existsSync(own) ? own : 'frankenphp');
const opcache = { 'opcache.enable': '1', 'opcache.jit': 'tracing', 'opcache.jit_buffer_size': '64M', 'opcache.validate_timestamps': '0' };
// php-fpm's Unix socket path must stay under macOS's 104 bytes: its folder goes under the system's temp folder.
const conf = () => fs.mkdtempSync(path.join(os.tmpdir(), 'qb-'));

const fpm = (procs) => ({
  key: `fpm-${procs}`, name: 'fpm', procs,
  start: (port) => {
    const dir = conf(), sock = path.join(dir, 'fpm.sock');
    fs.writeFileSync(path.join(dir, 'fpm.conf'), ['[global]', `pid = ${dir}/fpm.pid`, `error_log = ${dir}/fpm.log`, 'daemonize = no',
      '[www]', `listen = ${sock}`, 'listen.backlog = 4096', 'pm = static', `pm.max_children = ${procs}`, 'pm.max_requests = 0', ''].join('\n'));
    fs.writeFileSync(path.join(dir, 'nginx.conf'), `worker_processes ${procs};
pid ${dir}/nginx.pid;
error_log ${dir}/nginx.log warn;
events { worker_connections 4096; }
http {
  access_log off;
  keepalive_requests 10000000;
  client_body_temp_path ${dir}/body; proxy_temp_path ${dir}/proxy; fastcgi_temp_path ${dir}/fastcgi;
  uwsgi_temp_path ${dir}/uwsgi; scgi_temp_path ${dir}/scgi;
  server {
    listen 127.0.0.1:${port} backlog=4096;
    location / {
      fastcgi_param SCRIPT_FILENAME ${php}/index.php;
      fastcgi_param REQUEST_METHOD $request_method;
      fastcgi_param REQUEST_URI $request_uri;
      fastcgi_param QUERY_STRING $query_string;
      fastcgi_param SERVER_PROTOCOL $server_protocol;
      fastcgi_pass unix:${sock};
    }
  }
}
`);
    const ini = Object.entries(opcache).flatMap(([k, v]) => ['-d', `${k}=${v}`]);
    return [detached(process.env.PHP_FPM || 'php-fpm', ['-p', dir, '-y', path.join(dir, 'fpm.conf'), ...ini]),
            detached(process.env.NGINX || 'nginx', ['-p', dir, '-c', path.join(dir, 'nginx.conf'), '-g', 'daemon off;'])];
  },
});
const frankenphp = (procs) => ({
  key: `franken-${procs}`, name: 'franken', procs,
  start: (port) => {
    const dir = conf();
    fs.writeFileSync(path.join(dir, 'Caddyfile'), `{
  admin off
  auto_https off
  persist_config off
  frankenphp {
    num_threads ${procs}
${Object.entries(opcache).map(([k, v]) => `    php_ini ${k} ${v}`).join('\n')}
  }
}
http://127.0.0.1:${port} {
  php_server {
    root ${php}
    worker {
      file ${php}/worker.php
      num ${procs}
      match *
    }
  }
}
`);
    return [detached(franken, ['run', '--config', path.join(dir, 'Caddyfile')], { env: { ...process.env, GOMAXPROCS: String(procs), XDG_DATA_HOME: dir, XDG_CONFIG_HOME: dir } })];
  },
});
export const settings = [quilloSetting(appDir, 1), quilloSetting(appDir, 4), fpm(1), fpm(4), frankenphp(1), frankenphp(4)];
export { appDir };
