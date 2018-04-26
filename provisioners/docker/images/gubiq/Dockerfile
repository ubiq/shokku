FROM ubiqsmart/gubiq:stable as gubiq

RUN mkdir /gubiq
WORKDIR /gubiq

# Install openssl & cron

RUN apk add --no-cache openssl dcron

RUN mkdir -p /var/log/cron && mkdir -m 0644 -p /var/spool/cron/crontabs && \
    touch /var/log/cron/cron.log && mkdir -m 0644 -p /etc/cron.d

# Install dockerize

ENV DOCKERIZE_VERSION v0.6.0

RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
  && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
  && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

# Install supervisord
ENV PYTHON_VERSION=2.7.14-r2
ENV PY_PIP_VERSION=9.0.1-r1
ENV SUPERVISOR_VERSION=3.3.1

RUN apk update && apk add -u python=$PYTHON_VERSION py-pip=$PY_PIP_VERSION
RUN pip install supervisor==$SUPERVISOR_VERSION

RUN mkdir -p /etc/supervisor
RUN mkdir -p /var/log/supervisord

COPY ./supervisord.tmpl.conf .

# Copy scripts
COPY ./entrypoint.sh /usr/local/bin/
COPY ./start-gubiq.sh /usr/local/bin/

RUN chmod +x /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/start-gubiq.sh

EXPOSE 8588

ENTRYPOINT ["entrypoint.sh"]
