// The Tomcat benchmark: Quillo (main.qwe) against a servlet and a JSP page (tomcat/) on Tomcat 11, on one request
// thread, on four, and as Tomcat ships (up to 200 threads); the JVM told the same core count (-XX:ActiveProcessorCount)
// for 1 and 4. Quillo on one process and on four (--instances 4). Java's just-in-time compiler needs time to warm up,
// so each answer gets 10 seconds of warm-up before it's timed (2 for Quillo). The engine is bench-core.mjs.
//   node compare/bench.mjs [seconds=10] [rounds=3] [label=final]
// TOMCAT_HOME and BENCH_JAVA_HOME name Tomcat and the JDK (else Homebrew's: brew install tomcat).
import { bench } from './bench-core.mjs';
import { here, build, settings } from './sides.mjs';

const [secs, rounds, label] = [Number(process.argv[2] || 10), Number(process.argv[3] || 3), process.argv[4] || 'final'];
await bench({ here, build, settings, secs, rounds, label });
