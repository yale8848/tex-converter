#!/bin/bash
docker run --rm  -p 4100:4100 --name tex-converter -v `pwd`/pm2.json:/pm2.json -v `pwd`/log:/logs  yale8848/tex-converter:v1
