exports.handler = async (event) => {
    var AWS = require('aws-sdk');
    AWS.config.update({
        region: 'us-east-1'
    })
    var s3 = new AWS.S3({apiVersion: '2006-03-01'});
    
    var PizZip = require('pizzip');
    var Docxtemplater = require('docxtemplater');

    var fs = require('fs');
    var path = require('path');
    
    //Load the docx file as a binary
    var content = fs.readFileSync(path.resolve(__dirname, 'es.docx'), 'binary');
    
    var zip = new PizZip(content);

    var doc = new Docxtemplater();
    doc.loadZip(zip);

    //set the templateVariables
    doc.setData({
        firstName: event.firstName,
        lastName: event.lastName,
        fullName: event.fullName,
        patriarchName: event.patriarchName,
        stakeName: event.stake,
        parentage: event.parentage,
        blessingFirstLetter: event.firstLetter,
        blessing: event.blessing,
        memberName: event.memberName,
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
        // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
        throw error;
    }

    // buf is a nodejs buffer
    var buf = doc.getZip()
        .generate({
            type: 'nodebuffer'
        });
    console.log('buffer generated successfully')

    let uploadPromise = s3.upload({
        Bucket: 'patriarchal-files',
        Key: 'test-file.docx',
        Body: buf,
        ContentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    }).promise();
    
    let response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    await uploadPromise.then(data => {
        console.log("Success!", data);
        response.body = JSON.stringify(data)
    }).catch(err => {
        console.log(err)
    })
    return response;
};