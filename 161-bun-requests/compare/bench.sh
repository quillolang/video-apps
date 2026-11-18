#!/bin/sh
# Ten seconds of a trail's page, from wrk (4 threads, 100 connections), on the running app at a port: how many answers a
# second, and how long half of them and 99 in 100 of them took.
#   ./bench.sh 8090        ./bench.sh 8080
wrk -t4 -c100 -d10s --latency "http://localhost:${1:?give the port: 8090 for Bun, 8080 for Quillo}/trails/2" | grep -E 'Requests/sec|  50%|  99%|Non-2xx|Socket errors'
