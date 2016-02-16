var request = require('request');
var http = require('http');
var path = require('path');
var cheerio = require('cheerio');
var fs = require('fs');
var url = 'http://www.zhihu.com/question/37787176';
if (fs.exists('images/')) {
	console.log("images文件夹已存在");
}else{
	fs.mkdir('images/',777)
	console.log("images文件夹已生成");
}

http.get(url, function(res){
	var html = '';

	res.on('data', function(data){
		html += data;
	})
    
	res.on('end',function(){
		acquireData(html);
	})
}).on('error', function(){
	console.log('爬取页面错误');
});

function acquireData(data) {
    var $ = cheerio.load(data);  //cheerio解析data

    var Img = $('.zm-editable-content img').toArray();  //将所有的img放到一个数组中
    var len = Img.length;
    for (var i=0; i<len; i=i+2) {
        var imgsrc = Img[i].attribs.src;  //用循环读出数组中每个src地址
        console.log(imgsrc); 
        var filename = parseUrlForFileName(imgsrc);  //生成文件名
        downloadImg(imgsrc,filename,function() {
        	console.log(filename + ' done');
        });              //输出地址
    }
}
function parseUrlForFileName(address) {
	var filename = path.basename(address);
	return filename;
}

var downloadImg = function(uri, filename, callback){
	request.head(uri, function(err, res, body){
    // console.log('content-type:', res.headers['content-type']);  //这里返回图片的类型
    // console.log('content-length:', res.headers['content-length']);  //图片大小
    if (err) {
    	console.log('err: '+ err);
    	return false;
    }
    console.log('res: '+ res);
    request(uri).pipe(fs.createWriteStream('images/'+filename)).on('close', callback);  //调用request的管道来下载到 images文件夹下
});
};