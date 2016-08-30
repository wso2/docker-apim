FROM dockerhub.private.wso2.com/ubuntu:14.04
MAINTAINER lakmal

EXPOSE 80

RUN apt-get update && apt-get install subversion apache2 libapache2-svn apache2-utils -y
RUN mkdir -p /svn/repos
RUN svnadmin create /svn/repos/repo
RUN chown -R www-data:www-data /svn/repos/repo
COPY svn/repo.conf /etc/apache2/sites-available/
RUN a2ensite repo
COPY  svn/svnpasswd /etc/
COPY svn/run_apache.sh /var/www/
RUN chmod 755 /var/www/run_apache.sh

CMD ["/var/www/run_apache.sh"]

