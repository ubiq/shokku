FROM shokku/api:1.0.0

WORKDIR /var/www/api

RUN npm install

COPY ./docker/images/api/start-api-dev.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/start-api-dev.sh

EXPOSE 3000

ENTRYPOINT ["start-api-dev.sh"]