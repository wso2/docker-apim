#!/bin/bash

/etc/init.d/apache2 start && \
tail -F /var/log/apache2/*log
