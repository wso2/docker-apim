UPDATE IDN_OPENID_USER_RPS
SET USER_NAME = `pseudonym`
WHERE USER_NAME = `username`
      AND TENANT_ID = `tenant_id`