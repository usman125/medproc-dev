var fs = require('fs');
var pdf = require('html-pdf');
var html = fs.readFileSync('./contract-form.html', 'utf8');
var options = { 
  format: 'Letter',
  "border": {
    "top": "0.5in",            // default is 0, units: mm, cm, in, px 
    "right": "0.5in",
    "bottom": "0.5in",
    "left": "0.5in"
  },
 
  // "header": {
  //   "height": "45mm",
  //   "contents": '<div style="text-align: center;">Pitb - eprocurement</div>'
  // },
  "type": "pdf",             // allowed file types: png, jpeg, pdf 
  "quality": "95",

  "footer": {
    "height": "15mm",
    "contents": {
      // first: 'Cover page',
      // 2: 'Second page', // Any page number is working. 1-based index
      default: '<div style="text-align: center;">{{page}}/{{pages}}</div>', // fallback value
      last: '<div style="text-align: center;">Last Page</div>'
    }
  }
};
var contractform =  Math.random();
pdf.create(html, options).toFile('./vendorcontracts/'+contractform+'.pdf', function(err, res) {
  if (err) return console.log(err);
  console.log(res); // { filename: '/app/businesscard.pdf' } 
});