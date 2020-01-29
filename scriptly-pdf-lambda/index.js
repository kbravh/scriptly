const AWS = require('aws-sdk')
const log = require('lambda-log')
const fs = require('fs')
const {
  convertTo
} = require('@shelf/aws-lambda-libreoffice')
const s3 = new AWS.S3()

var srcBucket = process.env.S3_BUCKET_INPUT;
var dstBucket = process.env.S3_BUCKET_OUTPUT;

exports.handler = async (event, context) => {

  //destructure the srcKey out of the incoming request
  const {
    srcKey
  } = event;
  log.info(`Data from the event: ${event.bucket}:${event.srcKey}`)

  if(/.*docx$/.test(srcKey)){
    return {
      statusCode: 400,
      err: `Invalid key`
    }
  }
  //the destination file will have the same name with pdf extension
  const dstKey = srcKey.replace(/docx?/, 'pdf');

  // Output input URL for ease of inspection
  log.info("https://s3.console.aws.amazon.com/s3/object/" + srcBucket + "/" + srcKey);

  let response;
  try {
    // get the docx
    let data = await s3.getObject({
      Bucket: srcBucket,
      Key: srcKey
    }).promise();

    // save the docx to file
    fs.writeFileSync('/tmp/document.docx', data.Body)
    log.info('Document saved to /tmp/document.docx')

    // convert the docx
    let pdfPath = await convertTo('document.docx', 'pdf')
    log.info(`PDF path is ${pdfPath}`)

    // read in pdf file
    let pdf = fs.readFileSync(pdfPath)

    // upload the result to s3
    log.debug("uploading to s3 " + dstBucket);
    let uploadPromise = s3.upload({
      ACL: 'public-read',
      Bucket: dstBucket,
      Key: dstKey,
      Body: Buffer.from(pdf),
      ContentType: 'application/pdf'
    }).promise();

    await uploadPromise.then(data => {
      log.info('RESULT: Success ' + dstKey);
      response = {
        statusCode: 200,
        body: JSON.stringify(data)
      }
    })
  } catch (err) {
    log.error(err)
    response = {
      statusCode: 400,
      body: JSON.stringify(err)
    }
  }

  // Return a result
  return response;
}