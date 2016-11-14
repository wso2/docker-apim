FROM docker.wso2.com/wso2am:2.0.0

COPY pattern-8/publisher/carbon/ /mnt/wso2-artifacts

COPY artifacts/mysql-connector-java-5.1.34-bin.jar /mnt/wso2-artifacts/repository/components/lib/

COPY pattern-8/publisher/carbon/repository/components/api-publisher/configuration /mnt/wso2am-2.0.0/repository/components/api-publisher/

USER root