exports.handler = async (event) => {
    var AWS = require('aws-sdk');
    AWS.config.update({
        region: 'us-east-1'
    })
    var s3 = new AWS.S3({
        apiVersion: '2006-03-01'
    });

    var PizZip = require('pizzip');
    var Docxtemplater = require('docxtemplater');

    var fs = require('fs');
    var path = require('path');

    //Load the docx file as a binary
    var content = fs.readFileSync(path.resolve(__dirname, `${event.template}.docx`), 'binary');

    var zip = new PizZip(content);

    var doc = new Docxtemplater();
    doc.loadZip(zip);

    //set the templateVariables
    doc.setData({
        firstName: event.firstName,
        lastName: event.lastName,
        fullName: event.fullName,
        patriarchName: event.patriarch,
        stakeName: event.stake,
        parentage: event.parentage,
        blessingFirstLetter: event.blessingFirstLetter,
        blessing: event.blessing,
        memberTitle: event.memberTitle,
        blessingDate: event.blessingDate
    });

    try {
        doc.render()
        console.log("render was successful")
    } catch (error) {
        var e = {
            message: error.message,
            name: error.name,
            stack: error.stack,
            properties: error.properties,
        }
        console.log(JSON.stringify({
            error: e
        }));
        throw error;
    }

    // buf is a nodejs buffer
    var buf = doc.getZip()
        .generate({
            type: 'nodebuffer'
        });
    console.log('buffer generated successfully')

    //TODO- convert to pdf
    let time = new Date().getTime()

    let uploadPromise = s3.upload({
        ACL: 'public-read',
        Bucket: 'patriarchal-files',
        Key: `${event.firstName}${event.lastName}-${time}.docx`,
        Body: buf,
        ContentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    }).promise();

    let response

    await uploadPromise.then(data => {
        console.log("Success!", data);
        response = {
            statusCode: 200,
            body: JSON.stringify(data)
        }
    }).catch(err => {
        console.log(err)
    })
    return response;
};