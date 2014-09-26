FROM debian:wheezy

# add our user and group first to make sure their IDs get assigned consistently, regardless of whatever dependencies get added
RUN groupadd -r postgres && useradd -r -g postgres postgres

# grab gosu for easy step-down from root
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/* \
  && curl -o /usr/local/bin/gosu -SL 'https://github.com/tianon/gosu/releases/download/1.1/gosu' \
  && chmod +x /usr/local/bin/gosu \
  && apt-get purge -y --auto-remove curl

# make the "en_US.UTF-8" locale so postgres will be utf-8 enabled by default
RUN apt-get update && apt-get install -y locales && rm -rf /var/lib/apt/lists/* \
  && localedef -i en_US -c -f UTF-8 -A /usr/share/locale/locale.alias en_US.UTF-8
ENV LANG en_US.utf8

RUN apt-key adv --keyserver pgp.mit.edu --recv-keys B97B0AFCAA1A47F044F244A07FCC7D46ACCC4CF8

ENV PG_MAJOR 9.3
ENV PG_VERSION 9.3.5-1.pgdg70+1
ENV PATH /usr/lib/postgresql/$PG_MAJOR/bin:$PATH
ENV PGDATA /var/lib/postgresql/data
ENV PORT 80
ENV NODE_VERSION 0.10.32
ENV DATABASE_URL postgres://postgres@localhost

COPY bower.schema /bower.schema
COPY import.schema /import.schema
COPY scripts/startup.sh /startup.sh
COPY . /registry

RUN echo 'deb http://apt.postgresql.org/pub/repos/apt/ wheezy-pgdg main' $PG_MAJOR > /etc/apt/sources.list.d/pgdg.list \
  && apt-get update \
  && apt-get install -y \
    ca-certificates \
    curl \

    postgresql-common \
  && sed -ri 's/#(create_main_cluster) .*$/\1 = false/' /etc/postgresql-common/createcluster.conf \
  && apt-get install -y \
    postgresql-$PG_MAJOR=$PG_VERSION \
    postgresql-contrib-$PG_MAJOR=$PG_VERSION \

  && rm -rf /var/lib/apt/lists/* \

  && mkdir -p /var/run/postgresql \
  && chown -R postgres /var/run/postgresql \
  && gosu postgres initdb \
  && sed -ri "s/^#(listen_addresses\s*=\s*)\S+/\1'*'/" "$PGDATA"/postgresql.conf \
  && { echo; echo 'host all all 0.0.0.0/0 trust'; } >> "$PGDATA"/pg_hba.conf \
  && echo 'ssl = on' >> "$PGDATA"/postgresql.conf \

  && cd /tmp \
  && openssl req -nodes -newkey rsa:2048 -keyout server.key -out server.csr -subj "/CN=$(echo hostname)" \
  && openssl x509 -req -days 3650 -in server.csr -signkey server.key -out server.cert \
  && mv server.cert $PGDATA/server.crt \
  && mv server.key $PGDATA/server.key \
  && rm server* \
  && chmod 600 $PGDATA/server.key \
  && chmod 600 $PGDATA/server.crt \
  && chown -R postgres "$PGDATA" \

  && su postgres -c "/usr/lib/postgresql/9.3/bin/pg_ctl start" \
  && su postgres -c "psql < /bower.schema" \
  && su postgres -c "psql < /bower.schema" \
  && su postgres -c "psql < /import.schema" \

  && gpg --keyserver pgp.mit.edu --recv-keys 7937DFD2AB06298B2293C3187D33FF9D0246406D \
  && curl -SLO "http://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.gz" \
  && curl -SLO "http://nodejs.org/dist/v$NODE_VERSION/SHASUMS256.txt.asc" \
  && gpg --verify SHASUMS256.txt.asc \
  && grep " node-v$NODE_VERSION-linux-x64.tar.gz\$" SHASUMS256.txt.asc | sha256sum -c - \
  && tar -xzf "node-v$NODE_VERSION-linux-x64.tar.gz" -C /usr/local --strip-components=1 \
  && rm "node-v$NODE_VERSION-linux-x64.tar.gz" SHASUMS256.txt.asc \

  && cd /registry \
  && npm install \
  && chmod +x /startup.sh

EXPOSE 80
CMD ["/startup.sh"]
