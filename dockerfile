FROM keymetrics/pm2:8-stretch

COPY app.js .
COPY package.json .
COPY pm2.json .
COPY lib lib/
ADD  phantomjs-2.1.1-linux-x86_64.tar /usr/local/bin/
RUN  chmod 777 /usr/local/bin/phantomjs

ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install --registry=https://registry.npm.taobao.org --production

EXPOSE 4100

CMD [ "pm2-runtime", "start", "pm2.json" ]