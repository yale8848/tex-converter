#!/bin/bash
docker run --restart=always -d  -p 4100:4100 --name tex-converter -v `pwd`/pm2.json:/pm2.json -v `pwd`/log:/logs  tex-converter:latest