FROM docker.wso2.com/wso2am:2.0.0

COPY pattern-8/gateway-manager/carbon/ /mnt/wso2-artifacts

COPY artifacts/mysql-connector-java-5.1.34-bin.jar /mnt/wso2-artifacts/repository/components/lib/
COPY artifacts/svnkit-all-1.8.7.wso2v1.jar /mnt/wso2/carbon-home/repository/components/dropins/
COPY artifacts/trilead-ssh2-1.0.0-build215.jar /mnt/wso2/carbon-home/repository/components/lib/

RUN rm -r /mnt/wso2am-2.0.0/repository/deployment/server/webapps/*
RUN rm -r /mnt/wso2am-2.0.0/repository/deployment/server/jaggeryapps/*

USER root