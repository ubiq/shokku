FROM mhart/alpine-node:9

# Create directory
RUN mkdir -p /var/www/api

WORKDIR /var/www/api

COPY . .

# Install dependencies

RUN apk add --no-cache make gcc musl-dev linux-headers git python g++

# Install supervisord
ENV PYTHON_VERSION=2.7.14-r2
ENV PY_PIP_VERSION=9.0.1-r1
ENV SUPERVISOR_VERSION=3.3.1

RUN apk update && apk add -u python=$PYTHON_VERSION py-pip=$PY_PIP_VERSION
RUN pip install supervisor==$SUPERVISOR_VERSION

RUN mkdir -p /etc/supervisor
RUN mkdir -p /var/log/supervisord

COPY ./docker/images/api/supervisord.conf /etc/supervisor/supervisord.conf

# Copy scripts
COPY ./docker/images/api/entrypoint.sh /usr/local/bin/
COPY ./docker/images/api/start-api.sh /usr/local/bin/

# Give permissions to scripts
RUN chmod +x /usr/local/bin/start-api.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Install api dependencies
RUN npm install --global yarn
RUN yarn install

EXPOSE 3000

ENTRYPOINT ["entrypoint.sh"]
