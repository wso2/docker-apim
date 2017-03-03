FROM docker.wso2.com/wso2am:2.1.0

COPY pattern-6/traffic-manager/carbon/ /mnt/wso2-artifacts

COPY artifacts/mysql-connector-java-5.1.34-bin.jar /mnt/wso2-artifacts/repository/components/lib/

RUN rm -r /mnt/wso2am-2.1.0/repository/deployment/server/webapps/*
RUN rm -r /mnt/wso2am-2.1.0/repository/deployment/server/jaggeryapps/*

RUN rm -r /mnt/wso2am-2.1.0/repository/deployment/server/synapse-configs/default/inbound-endpoints/WebSocketInboundEndpoint.xml

RUN rm /mnt/wso2am-2.1.0/repository/conf/registry.xml
RUN mv /mnt/wso2am-2.1.0/repository/conf/registry_TM.xml /mnt/wso2am-2.1.0/repository/conf/registry.xml

RUN rm /mnt/wso2am-2.1.0/repository/conf/axis2/axis2.xml
RUN mv /mnt/wso2am-2.1.0/repository/conf/axis2/axis2_TM.xml /mnt/wso2am-2.1.0/repository/conf/axis2/axis2.xml