const AttachmentModel = model('attachment');
const UserModel = model('user');
var formidable = require('formidable'),
    fs = require('fs');

exports.attachment = function(req,res,next){
	UserModel.findById(req.body.userId, function (err, user) {
        if (err) {
          res.json(err);
        }
    })
	var form = new formidable.IncomingForm(),
        files = [],
        fields = [],
        uniqueFileName;

  form.uploadDir = './uploads/';

  form
    .on('field', function(field, value) {
      console.log(field, value);
      fields.push([field, value]);
    })
    .on('file', function(field, file) {
      console.log(field, file);
      console.log("File Name--->>>",file.name);
      var newAttachment = new AttachmentModel({
      	filename: file.name
      })
      newAttachment.save(function(err,result){
      	if (err) {
      		res.send(err)
      	}
      	console.log("DB save --->>",result);
      	uniqueFileName = result._id.toString() + '_' + result.filename; 
      	fs.rename(file.path, form.uploadDir + "/" + uniqueFileName);
      	files.push([field, file]);
      	res.json({"FileReference": uniqueFileName});
      })
    })
    .on('end', function() {
      console.log('-> upload done');
     // res.writeHead(200, {'content-type': 'text/plain'});
     // res.write('received fields:\n\n '+util.inspect(fields));
     // res.write('\n\n');
     // res.end('received files:\n\n '+util.inspect(files));
    });
    form.parse(req);
}