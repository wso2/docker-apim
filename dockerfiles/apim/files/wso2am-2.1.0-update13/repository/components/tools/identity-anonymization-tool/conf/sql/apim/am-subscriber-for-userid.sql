UPDATE AM_SUBSCRIBER
SET USER_ID = `pseudonym`, EMAIL_ADDRESS = `pseudonym`
WHERE USER_ID = `username`
      AND TENANT_ID = `tenant_id`
