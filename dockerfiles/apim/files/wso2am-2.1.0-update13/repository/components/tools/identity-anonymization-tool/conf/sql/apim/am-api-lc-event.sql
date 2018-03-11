UPDATE AM_API_LC_EVENT
SET USER_ID = `pseudonym`
WHERE USER_ID = `username`
      AND TENANT_ID = `tenant_id`
