# ------------------------------------------------------------------------
#
# Copyright 2017 WSO2, Inc. (http://wso2.com)
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License

# ------------------------------------------------------------------------

FROM wso2/wso2base:latest
MAINTAINER dev@wso2.org

ENV DEBIAN_FRONTEND noninteractive

# Build time arguments
ARG WSO2_SERVER
ARG WSO2_SERVER_VERSION
ARG WSO2_SERVER_PROFILE
ARG WSO2_ENVIRONMENT
ARG WSO2_DEPLOYMENT_PATTERN
ARG HTTP_PACK_SERVER
ARG PLATFORM

# Carbon server information
ENV WSO2_SERVER=${WSO2_SERVER:-wso2am} \
    WSO2_SERVER_VERSION=${WSO2_SERVER_VERSION:-2.1.0} \
    WSO2_SERVER_PROFILE=${WSO2_SERVER_PROFILE:-default} \
    WSO2_ENVIRONMENT=${WSO2_ENVIRONMENT:-dev} \
    WSO2_DEPLOYMENT_PATTERN=${WSO2_DEPLOYMENT_PATTERN:-1} \
    MODULE_NAME=${MODULE_NAME:-wso2am_runtime} \
    HTTP_PACK_SERVER=${HTTP_PACK_SERVER} \
    PLATFORM=${PLATFORM}

COPY scripts/*.sh /usr/local/bin/

# Execute configuration script
RUN bash /usr/local/bin/image-config.sh

USER root
RUN adduser --quiet --disabled-password --shell /bin/bash --home /home/rsyncuser --gecos "User" rsyncuser
RUN usermod -aG sudo rsyncuser
RUN adduser rsyncuser sudo
RUN echo "rsyncuser:rsyncuser" | chpasswd

RUN apt-get update && apt-get install -y apt-utils rsync ssh openssh-server supervisor
RUN mkdir -p  /var/run/sshd /var/log/supervisor
COPY pattern-3/supervisor/supervisord-gateway-manager.conf /etc/supervisor/conf.d/supervisord.conf

RUN sed -i 's/PermitRootLogin without-password/PermitRootLogin yes/' /etc/ssh/sshd_config
RUN sed 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd

WORKDIR /mnt

# Expose transport ports
EXPOSE 10397 8280 8243 9763 9443 22 80

CMD ["/usr/local/bin/init.sh"]
