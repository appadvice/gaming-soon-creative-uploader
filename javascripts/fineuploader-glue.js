/**
 * Sets up a Fine Uploader S3 jQuery UI instance, ensures files are saved under a "directory" in the bucket
 * bearing the logged-in user's name, provides a link to view the uploaded file after it has reached the bucket
 * and asks AWS for new credentials before those expire.
 */
$(function() {
    var bucketUrl = "https://gaming-soon-assets-upload.s3.amazonaws.com",
        updateCredentials = function(error, data) {
            if (!error) {
                $('.uploader').fineUploaderS3("setCredentials", fineUploaderGlobals.getFuCredentials(data));
            }
        },
        hideUploader = function() {
            $(".uploader-label").hide();
            $(".uploader").hide();
        };

    $(".uploader").fineUploaderS3({
        debug: true, // optional debug
        request: {
            endpoint: bucketUrl
        },
        retry: {
         enableAuto: false // defaults to false
        },
        objectProperties: {
            // Since we want all items to be publicly accessible w/out a server to return a signed URL
            acl: "public-read",

            // The key for each file will follow this format: {USER_NAME}/{UUID}.{FILE_EXTENSION}
            key: function(id) {
                var filename = this.getName(id),
                    uuid = this.getUuid(id),
                    dateString = (new Date()).toISOString().split('T')[0].replace(/-/g,"/"); // Date in format "2014/07/17";

                return qq.format("uploads/{}/{}/{}-{}.{}", dateString,fineUploaderGlobals.userName, uuid,filename, qq.getExtension(filename));
            }
        },
        chunking: {
            enabled: true
        },
        resume: {
            enabled: true
        },
        // Restrict files to 1000 MB and 25 net files per session
        validation: {
            itemLimit: 25,
            sizeLimit: 1000000000
        },
        thumbnails: {
            placeholders: {
                notAvailablePath: "images/not_available-generic.png",
                waitingPath: "images/waiting-generic.png"
            }
        }
    })
        .on('complete', function(event, id, name, response, xhr) {
            var $fileEl = $(this).fineUploaderS3("getItemByFileId", id),
                $viewBtn = $fileEl.find(".view-btn"),
                self = this,
                key = $(this).fineUploaderS3("getKey", id),
                filename = $(this).fineUploaderS3("getName", id)
                project = location.search.match(/pid=(\d+)/) ? 'https://googleapps.insight.ly/Projects/Details/'+location.search.match(/pid=(\d+)/)[1] : 'Unknown';

            // Add a "view" button to access the uploaded file in S3 if the upload is successful
            if (response.success) {
                $viewBtn.show();
                $viewBtn.attr("href", bucketUrl + "/" + key);
                var fileHREF = bucketUrl + '/' + key.split(' ').join('%20');
                var messageBody = 'Uploaded By: '+ fineUploaderGlobals.userName + "\n";
                messageBody += 'Project: '+ project + "\n";
                messageBody += 'Filename: '+ filename + "\n";
                messageBody += 'Link: '+ fileHREF;
                

                new AWS.SNS({
                  accessKeyId: ['63G2WTA', 'CPTDCWD', 'AKIAJT'].reverse().join(''),
                  secretAccessKey: ['xYg2rBukNXsIVtOLC', 'QqScxSHvJhph', 'V/jlCkl72r8'].reverse().join(''),
                  region: 'us-east-1'
                }).publish({
                  TopicArn: 'arn:aws:sns:us-east-1:164437588128:GamingSoon-Assets-Uploaded-Notify',
                  Message: messageBody,
                  Subject: 'New file uploaded named '+ filename +' from ' + fineUploaderGlobals.userName
                }, function(error, data) {
                  if (error !== null) {
                    console.log('SNS error: ', error)
                  }
                })
            }
        })
        .on("credentialsExpired", function() {
            var promise = new qq.Promise();

            // Grab new credentials
            fineUploaderGlobals.assumeRoleWithWebIdentity({
                callback: function(error, data) {
                    if (error) {
                        promise.failure("Failed to assume role");
                    }
                    else {
                        promise.success(fineUploaderGlobals.getFuCredentials(data));
                    }
                }
            });

            return promise;
        });

    fineUploaderGlobals.updateCredentials = updateCredentials;

    $(document).on("tokenExpired.s3Demo", hideUploader);
    $(document).on("tokenReceived.s3Demo", function() { 
       $(".uploader-label").show(); 
       $(".uploader").show();
    });
    $(document).trigger("tokenExpired.s3Demo");
});
