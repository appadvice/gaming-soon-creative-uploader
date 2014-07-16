/**
 * Grabs AWS credentials for an authenticated user.
 */
$(function() {
    var assumeRoleWithWebIdentity = function(params) {
            var sts = new AWS.STS(),
                assumeRoleParams = {};

            fineUploaderGlobals.roleArn = params.roleArn || fineUploaderGlobals.roleArn;
            fineUploaderGlobals.providerId = params.providerId || fineUploaderGlobals.providerId;
            fineUploaderGlobals.idToken = params.idToken || fineUploaderGlobals.idToken;

            assumeRoleParams = {
                RoleArn: fineUploaderGlobals.roleArn,
                RoleSessionName: "web-identity-federation",
                WebIdentityToken: fineUploaderGlobals.idToken
            };

            if (fineUploaderGlobals.providerId) {
                assumeRoleParams.ProviderId = fineUploaderGlobals.providerId;
            }

            sts.assumeRoleWithWebIdentity(assumeRoleParams, params.callback || fineUploaderGlobals.updateCredentials);
        },
        getFuCredentials = function(data) {
            return {
                accessKey: data.Credentials.AccessKeyId,
                secretKey: data.Credentials.SecretAccessKey,
                sessionToken: data.Credentials.SessionToken,
                expiration: data.Credentials.Expiration
            };
        };

    fineUploaderGlobals.assumeRoleWithWebIdentity = assumeRoleWithWebIdentity;
    fineUploaderGlobals.getFuCredentials = getFuCredentials;
}());
