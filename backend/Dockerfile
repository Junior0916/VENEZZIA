FROM alpine:latest

ARG PB_VERSION=0.40.5

RUN apk add --no-cache \
    unzip \
    ca-certificates \
    curl

# Descarga binario oficial de PocketBase para Linux amd64
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/ && rm /tmp/pb.zip

# Copia hooks de Culqi, esquema y migraciones automáticas
COPY ./pb_hooks /pb/pb_hooks
COPY ./pb_migrations /pb/pb_migrations
COPY ./pb_schema.json /pb/pb_schema.json

VOLUME /pb/pb_data

EXPOSE 8090

CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8090"]
