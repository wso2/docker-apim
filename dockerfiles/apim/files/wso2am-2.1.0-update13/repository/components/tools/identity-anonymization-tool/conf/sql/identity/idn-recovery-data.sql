UPDATE IDN_RECOVERY_DATA
SET USER_NAME = `pseudonym`
WHERE USER_NAME = `username`
      AND USER_DOMAIN = `user_store_domain`
      AND TENANT_ID = `tenant_id`