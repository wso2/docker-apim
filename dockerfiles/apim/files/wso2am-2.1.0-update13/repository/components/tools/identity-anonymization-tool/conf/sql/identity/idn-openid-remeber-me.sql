UPDATE IDN_OPENID_REMEMBER_ME
SET USER_NAME = `pseudonym`
WHERE USER_NAME = `username`
      AND TENANT_ID = `tenant_id`