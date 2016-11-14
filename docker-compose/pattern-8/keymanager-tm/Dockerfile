FROM docker.wso2.com/wso2am:2.0.0

COPY pattern-8/keymanager-tm/carbon/ /mnt/wso2-artifacts

COPY artifacts/mysql-connector-java-5.1.34-bin.jar /mnt/wso2-artifacts/repository/components/lib/

RUN rm -r /mnt/wso2am-2.0.0/repository/deployment/server/jaggeryapps/*
#RUN rm -r /mnt/wso2am-2.0.0/repository/deployment/server/webapps/throttle#data#v1.war

USER root