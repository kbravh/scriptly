var docx = require("@nativedocuments/docx-wasm");
var AWS = require('aws-sdk');
var s3 = new AWS.S3();
var config = require('./configure');
var helper = require('./helper');

const log = require('lambda-log');

const Format = require("@nativedocuments/docx-wasm/formats");

// ND_LICENSE_URL, or ND_DEV_ID and ND_DEV_SECRET are read from environment

//  debug messages?
if (process.env.DEPLOY_ENV !== 'PROD') {
    log.options.debug = true;
}

var srcBucket = process.env.S3_BUCKET_INPUT;

var dstBucket = process.env.S3_BUCKET_OUTPUT;

var INITIALISED = false;


/**
 * Lambda which converts an S3 object.
 * It will be invoked by an API gateway request.
 */
exports.handler = async function (event, context) {

    //destructure the srcKey out of the incoming request
    const {srcKey} = event;
    //the destination file will have the same name with pdf extension
    const dstKey = srcKey.replace(/docx?/, 'pdf');

    if (!srcKey.endsWith('doc') && !srcKey.endsWith('docx')) {
        log.warn('Unsupported file type ' + srcKey);
        return; //return an error
    }

    // Output input URL for ease of inspection
    log.info("https://s3.console.aws.amazon.com/s3/object/" + srcBucket + "/" + srcKey);

    // Compute mimeType
    var mimeType = Format.PDF.toString();

    // initialise engine.
    // This is inside the handler since we need to read memoryLimitInMB from context
    if (!INITIALISED) {
        try {
            config.init(context.memoryLimitInMB);
            INITIALISED = true;
        } catch (e) {
            log.error(e);
            return;
        }
    }

    // Actually execute the steps
    var data;
    try {
        // get the docx
        data = await s3.getObject({
            Bucket: srcBucket,
            Key: srcKey
        }).promise();

        // convert it
        var output = await helper.convert(srcKey, data.Body, outputAs);

        // save the result
        log.debug("uploading to s3 " + dstBucket);
        let uploadPromise = s3.upload({
            ACL: 'public-read',
            Bucket: dstBucket,
            Key: dstKey,
            Body: new Buffer(output) /* arrayBuffer to Buffer  */ ,
            ContentType: mimeType
        }).promise();

        let response;
        await uploadPromise.then(data => {
            log.info('RESULT: Success ' + dstKey); /* Log analysis regex matching */
            response = {
                statusCode: 200,
                body: JSON.stringify(data)
            }
        })

        // Return a result
        return response;

    } catch (e) {

        //const msg = "" + e;
        if (e) log.error(e);

        /* Broken documents saved to dstBucket/BROKEN
         *To get help, please note the contents of the assertion,
         *together with the document which caused it.
         */

        // save broken documents to dstBucket/BROKEN
        var ext = srcKey.substr(srcKey.lastIndexOf('.') + 1);
        var mimeType;
        if (ext == "docx") {
            mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        } else if (ext == "doc") {
            mimeType = Format.DOC.toString();
        } else {
            mimeType = "application/octet-stream";
        }

        dstKey = "BROKEN/" + srcKey + "-" + (new Date).getTime() + "." + ext;
        log.error("RESULT: Failed " + dstKey); /* Log analysis regex matching */

        // save this bug doc
        try {
            await s3.putObject({
                Bucket: dstBucket,
                Key: dstKey,
                Body: new Buffer(data.Body) /* arrayBuffer to Buffer  */ ,
                ContentType: mimeType
            }).promise();
        } catch (putErr) {
            log.error(putErr);
            log.error("Problem saving bug doc " + dstKey);
        }
    }
};