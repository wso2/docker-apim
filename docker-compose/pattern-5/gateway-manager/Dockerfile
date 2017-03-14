FROM docker.wso2.com/wso2am:2.1.0

COPY pattern-5/gateway-manager/carbon/ /mnt/wso2-artifacts

COPY artifacts/mysql-connector-java-5.1.34-bin.jar /mnt/wso2-artifacts/repository/components/lib/
COPY artifacts/svnkit-all-1.8.7.wso2v1.jar /mnt/wso2/carbon-home/repository/components/dropins/
COPY artifacts/trilead-ssh2-1.0.0-build215.jar /mnt/wso2/carbon-home/repository/components/lib/

RUN rm -r /mnt/wso2am-2.1.0/repository/deployment/server/jaggeryapps/*

USER root
RUN adduser --quiet --disabled-password --shell /bin/bash --home /home/rsyncuser --gecos "User" rsyncuser
RUN usermod -aG sudo rsyncuser
RUN adduser rsyncuser sudo
RUN echo "rsyncuser:rsyncuser" | chpasswd

RUN apt-get update && apt-get install -y apt-utils rsync ssh openssh-server supervisor
RUN mkdir -p  /var/run/sshd /var/log/supervisor
COPY pattern-5/supervisor/supervisord-gateway-manager.conf /etc/supervisor/conf.d/supervisord.conf

RUN sed -i 's/PermitRootLogin without-password/PermitRootLogin yes/' /etc/ssh/sshd_config
RUN sed 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd

EXPOSE 22 80
CMD ["/usr/bin/supervisord"]
