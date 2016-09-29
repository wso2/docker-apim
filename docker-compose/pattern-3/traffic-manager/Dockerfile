FROM dockerhub.private.wso2.com/wso2am:2.0.0

COPY pattern-3/traffic-manager/carbon/ /mnt/wso2-artifacts

COPY artifacts/mysql-connector-java-5.1.34-bin.jar /mnt/wso2-artifacts/repository/components/lib/

RUN rm -r /mnt/wso2am-2.0.0/repository/deployment/server/webapps/*
RUN rm -r /mnt/wso2am-2.0.0/repository/deployment/server/jaggeryapps/*