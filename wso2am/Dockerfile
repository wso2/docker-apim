# ------------------------------------------------------------------------
#
# Copyright 2016 WSO2, Inc. (http://wso2.com)
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
ARG HTTP_PACK_SERVER
ARG PLATFORM

# Carbon server information
ENV WSO2_SERVER=${WSO2_SERVER:-wso2am} \
    WSO2_SERVER_VERSION=${WSO2_SERVER_VERSION:-1.9.1} \
    WSO2_SERVER_PROFILE=${WSO2_SERVER_PROFILE:-default} \
    WSO2_ENVIRONMENT=${WSO2_ENVIRONMENT:-dev} \
    HTTP_PACK_SERVER=${HTTP_PACK_SERVER} \
    PLATFORM=${PLATFORM}

COPY scripts/*.sh /usr/local/bin/

# Execute configuration script
RUN bash /usr/local/bin/image-config.sh

USER wso2user
WORKDIR /mnt

# Expose transport ports
EXPOSE 10397 8280 8243 9763 9443

ENTRYPOINT ["/usr/local/bin/init.sh"]
