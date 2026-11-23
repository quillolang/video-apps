// The Tomcat benchmark's servers: Quillo (main.qwe) against a servlet and a JSP page (tomcat/) on Tomcat 11, on one request
// thread, on four, and as Tomcat ships (up to 200 threads); the JVM told the same core count (-XX:ActiveProcessorCount)
// for 1 and 4. Quillo on one process and on four (--instances 4). Java's just-in-time compiler needs time to warm up,
// so each answer gets 10 seconds of warm-up before it's timed (2 for Quillo). The engine is bench-core.mjs.
//   (bench.mjs runs them; run-curl.mjs and the video's shots.mjs start them too)
// TOMCAT_HOME and BENCH_JAVA_HOME name Tomcat and the JDK (else Homebrew's: brew install tomcat).
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { appDir } from './make-db.mjs';   // writes fortunes.db beside main.qwe
import { buildDir, detached, quilloSetting } from './bench-core.mjs';

export const here = path.dirname(fileURLToPath(import.meta.url)), build = buildDir(here, 'v207');
// The JDK: BENCH_JAVA_HOME, else the one Homebrew's Tomcat runs on (openjdk, Java 27 here), else JAVA_HOME.
const tomcat = process.env.TOMCAT_HOME || '/opt/homebrew/opt/tomcat/libexec';
const java = process.env.BENCH_JAVA_HOME || (fs.existsSync('/opt/homebrew/opt/openjdk/bin/java') ? '/opt/homebrew/opt/openjdk' : process.env.JAVA_HOME);

// The webapp, assembled in the build folder: the compiled servlet, the JSP, and the jars (get-jars.sh).
const webapp = path.join(build, 'webapp'), inf = path.join(webapp, 'WEB-INF');
fs.rmSync(webapp, { recursive: true, force: true });
fs.mkdirSync(path.join(inf, 'classes'), { recursive: true });
execFileSync('sh', [path.join(here, 'get-jars.sh'), path.join(build, 'lib')], { stdio: 'inherit' });
fs.cpSync(path.join(build, 'lib'), path.join(inf, 'lib'), { recursive: true });
fs.copyFileSync(path.join(here, 'tomcat/WEB-INF/fortunes.jsp'), path.join(inf, 'fortunes.jsp'));
const sources = fs.readdirSync(path.join(here, 'tomcat/src/bench')).map((f) => path.join(here, 'tomcat/src/bench', f));
execFileSync(path.join(java, 'bin/javac'), ['--release', '21', '-cp', path.join(tomcat, 'lib/servlet-api.jar'), '-d', path.join(inf, 'classes'), ...sources], { stdio: 'inherit' });

let n = 0;
const tomcatSetting = (threads) => ({
  key: `tomcat-${threads || 'default'}`, name: 'tomcat', procs: threads, warm: 10,
  start: (port) => {
    // A Tomcat of its own (CATALINA_BASE) for this run: its port, its thread count, the app as ROOT, no access log.
    const base = path.join(build, `base-${++n}`);
    fs.rmSync(base, { recursive: true, force: true });
    for (const d of ['conf', 'logs', 'temp', 'work', 'webapps']) fs.mkdirSync(path.join(base, d), { recursive: true });
    fs.copyFileSync(path.join(tomcat, 'conf/web.xml'), path.join(base, 'conf/web.xml'));
    fs.writeFileSync(path.join(base, 'conf/server.xml'), `<Server port="-1" shutdown="SHUTDOWN">
  <Service name="Catalina">
    <Connector port="${port}" address="127.0.0.1" protocol="HTTP/1.1" maxKeepAliveRequests="-1"${threads ? ` maxThreads="${threads}" minSpareThreads="${threads}"` : ''}/>
    <Engine name="Catalina" defaultHost="localhost">
      <Host name="localhost" appBase="webapps" unpackWARs="false" autoDeploy="false">
        <Context path="" docBase="${webapp}"/>
      </Host>
    </Engine>
  </Service>
</Server>
`);
    const opts = [`-Dbench.db=${path.join(appDir, 'fortunes.db')}`, ...(threads ? [`-XX:ActiveProcessorCount=${threads}`] : [])].join(' ');
    return [detached(path.join(tomcat, 'bin/catalina.sh'), ['run'], { env: { ...process.env, JAVA_HOME: java, CATALINA_HOME: tomcat, CATALINA_BASE: base, CATALINA_OPTS: opts } })];
  },
});
export const settings = [quilloSetting(appDir, 1), quilloSetting(appDir, 4), tomcatSetting(1), tomcatSetting(4), tomcatSetting(0)];
export { appDir };
