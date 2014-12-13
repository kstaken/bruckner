FROM ubuntu:14.04
MAINTAINER v0.1

RUN apt-get update && \
    apt-get install -y curl htop unzip vim wget && \
    apt-get install -y --force-yes python-software-properties software-properties-common python && \
    add-apt-repository ppa:chris-lea/node.js && \    
    echo "deb http://us.archive.ubuntu.com/ubuntu/ trusty universe" >> /etc/apt/sources.list && \
    apt-get update && \
    apt-get install -y nodejs supervisor build-essential && \
    mkdir -p /app/bin /app/data /app/code /app/config && \
    apt-get clean && \
    echo

RUN cd /tmp && \
    curl -L  https://github.com/coreos/etcd/releases/download/v0.4.6/etcd-v0.4.6-linux-amd64.tar.gz -o etcd-v0.4.6-linux-amd64.tar.gz && \
    tar xvzf etcd-v0.4.6-linux-amd64.tar.gz && \
    mv etcd-v0.4.6-linux-amd64/etcd /app/bin && \
    mv etcd-v0.4.6-linux-amd64/etcdctl /app/bin && \
    rm /tmp/etcd-v0.4.6-linux-amd64.tar.gz && \
    rm -rf /tmp/etcd-v0.4.6-linux-amd64

RUN cd /tmp && \
    curl -L  https://github.com/downloads/bitly/nsq/nsq-0.2.15.linux-amd64.tar.gz -o nsq-0.2.15.linux-amd64.tar.gz && \
    tar xvzf nsq-0.2.15.linux-amd64.tar.gz && \
    mv nsq-0.2.15.linux-amd64/bin/* /app/bin && \
    rm /tmp/nsq-0.2.15.linux-amd64.tar.gz && \
    rm -rf /tmp/nsq-0.2.15.linux-amd64

ADD config.js /app/config/config.js

ADD . /app/code

RUN cd /app/code && \
    npm install

VOLUME ["/app/config", "/app/local", "/app/data"]




