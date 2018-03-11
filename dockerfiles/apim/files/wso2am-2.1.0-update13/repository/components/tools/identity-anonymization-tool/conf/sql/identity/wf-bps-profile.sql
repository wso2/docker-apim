UPDATE WF_BPS_PROFILE
SET USERNAME = `pseudonym`
WHERE USERNAME = `username`
      AND TENANT_ID = `tenant_id`