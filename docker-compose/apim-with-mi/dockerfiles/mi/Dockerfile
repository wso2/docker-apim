# ------------------------------------------------------------------------
#
# Copyright 2021 WSO2, Inc. (http://wso2.com)
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
#
# ------------------------------------------------------------------------

FROM docker.wso2.com/wso2mi:4.2.0.0
LABEL maintainer="WSO2 Docker Maintainers <dev@wso2.org>"

# copy CAR files to the MI server home
COPY capps ${WSO2_SERVER_HOME}/repository/deployment/server/carbonapps/
