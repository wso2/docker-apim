FROM wso2am-analytics:2.2.0-SNAPSHOT

COPY pattern-3/am-analytics/carbon /home/wso2carbon/wso2am-analytics-2.2.0-SNAPSHOT/

COPY artifacts/mysql-connector-java-5.1.34-bin.jar /home/wso2carbon/wso2am-analytics-2.2.0-SNAPSHOT/repository/components/lib/

USER root
RUN chown -R wso2carbon:wso2 /home/wso2carbon/wso2am-analytics-2.2.0-SNAPSHOT/
RUN chown -R wso2carbon:wso2 /home/wso2carbon/wso2am-analytics-2.2.0-SNAPSHOT/repository/components/lib/

USER root
