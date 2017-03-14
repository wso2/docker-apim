FROM docker.wso2.com/wso2am:2.1.0

COPY pattern-4/traffic-manager/carbon/ /mnt/wso2-artifacts

COPY artifacts/mysql-connector-java-5.1.34-bin.jar /mnt/wso2-artifacts/repository/components/lib/

RUN rm -r /mnt/wso2am-2.1.0/repository/deployment/server/webapps/am#sample#calculator#v1.war
RUN rm -r /mnt/wso2am-2.1.0/repository/deployment/server/webapps/am#sample#pizzashack#v1.war
RUN rm -r /mnt/wso2am-2.1.0/repository/deployment/server/webapps/api#am#admin#v0.11.war
RUN rm -r /mnt/wso2am-2.1.0/repository/deployment/server/webapps/api#am#publisher#v0.11.war
RUN rm -r /mnt/wso2am-2.1.0/repository/deployment/server/webapps/api#am#store#v0.11.war
RUN rm -r /mnt/wso2am-2.1.0/repository/deployment/server/webapps/authenticationendpoint.war
RUN rm -r /mnt/wso2am-2.1.0/repository/deployment/server/webapps/client-registration#v0.11.war
RUN rm -r /mnt/wso2am-2.1.0/repository/deployment/server/webapps/oauth2.war
RUN rm -r /mnt/wso2am-2.1.0/repository/deployment/server/webapps/throttle#data#v1.war

RUN rm -r /mnt/wso2am-2.1.0/repository/deployment/server/jaggeryapps/*
