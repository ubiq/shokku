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

# Install s3cmd

ENV S3CMD_VERSION 1.6.1

RUN wget https://github.com/s3tools/s3cmd/releases/download/v${S3CMD_VERSION}/s3cmd-${S3CMD_VERSION}.tar.gz && \
  tar xzf s3cmd-${S3CMD_VERSION}.tar.gz && \
  rm s3cmd-${S3CMD_VERSION}.tar.gz && \
  cd s3cmd-${S3CMD_VERSION} && \
  python setup.py install && \
  mv s3cmd /usr/local/bin && \
  chmod +x /usr/local/bin/s3cmd && \ 
  cd .. && \
  rm -rf /var/cache/apk/* /tmp/s3cmd-${S3CMD_VERSION} /tmp/s3cmd-${S3CMD_VERSION}.tar.gz s3cmd-${S3CMD_VERSION} && \
  mkdir -p /etc/s3cmd/

COPY ./s3cfg /etc/s3cmd/s3cfg

# Copy scripts
COPY ./entrypoint.sh /usr/local/bin/
COPY ./start-gubiq.sh /usr/local/bin/
COPY ./env-secrets-expand.sh /usr/local/bin/
COPY ./backup.sh /usr/local/bin/
COPY ./recover-blockchain.sh /usr/local/bin/

RUN chmod +x /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/start-gubiq.sh
RUN chmod +x /usr/local/bin/env-secrets-expand.sh
RUN chmod +x /usr/local/bin/backup.sh
RUN chmod +x /usr/local/bin/recover-blockchain.sh

EXPOSE 8588

ENTRYPOINT ["entrypoint.sh"]