/*
 *  Copyright (c) 2014, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 *  WSO2 Inc. licenses this file to you under the Apache License,
 *  Version 2.0 (the "License"); you may not use this file except
 *  in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing,
 *  software distributed under the License is distributed on an
 *  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 *  KIND, either express or implied.  See the License for the
 *  specific language governing permissions and limitations
 *  under the License.
 */
(function() {
	'use strict';

	var DEFAULT_CLAIM_DIALECT = Packages.org.wso2.carbon.user.core.UserCoreConstants.DEFAULT_CARBON_DIALECT;

	var getClaims = function(dialect) {
		var claims = [];

		var admin = new Packages.org.wso2.carbon.claim.mgt.ClaimAdminService();

		var defaultClaims = admin.getClaimMappingByDialect(dialect).claimMappings;

		for (var i = 0; i < defaultClaims.length; i++) {
			var c = defaultClaims[i].getClaim();

			var claim = {
				claimUri: c.getClaimUri(),
				displayTag: c.getDisplayTag(),
				isRequired: c.isRequired(),
				regex: c.getRegEx(),
				value: c.getValue(),
				displayOrder: c.getDisplayOrder()
			};

			claims.push(claim);
		}

		return claims;
	};


	this.getDefaultClaims = function() {
		if (DEFAULT_CLAIM_DIALECT) {
			return getClaims(DEFAULT_CLAIM_DIALECT);
		} else {
			return [];
		}
	};

	this.getClaims = function (dialect) {
		return getClaims(dialect);
	};
})();