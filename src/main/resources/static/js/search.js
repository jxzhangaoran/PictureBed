$(document).ready(function(){
	$(".searchcontainer").on("click",function(){
		$(".searchbody").addClass("hide");
		$("#" + $(this).attr("data-searchtype")).removeClass("hide");
		//移动端自动滚动页面
		if(window.innerWidth < 992) {
			var $target = $('[name=searchtag]');
			var targetOffset = $target.offset().top;
			$('html,body').animate({
				scrollTop: targetOffset
			}, 500);
		}
	});
	
	$("#donamesearch").on("click",function(){
		doNameSearch();
	});

	$("#picnameinput").on("keypress",function(event){
		if(event.keyCode === 13) {
			doNameSearch();
		}
	});
	
	function doNameSearch() {
		if($("#picnameinput").val().length > 0) {
			activePreload();
			$.ajax({
				url: "findPicByName",
				type: "GET",
				contentType: "text/xml",
				data: "searchname=" + $("#picnameinput").val(),
				dataType: "json",
				success: function(data) {
					appendRes(data, "name");
					deactivePreload();
				}
			});
		}
	}
	
	function activePreload() {
		$("#preload_container").removeClass("hide");
	}
	
	function deactivePreload() {
		$("#preload_container").addClass("hide");
	}

	function appendRes(results, note) {
		$("#resultdiv").html("");

		if(results == null || results.length === 0) {
			layer.alert('抱歉，找不到您想要的图片！', {
				icon: 2
			},function(index){
				layer.close(index);
			});
		}

		for(let i = 0;i < results.length;i++) {
			//根据查询方式不同，图片的描述信息有所不同
			let discribetitle,discribemsg;
			switch(note) {
				case "MD5": 
					discribetitle = "MD5";
					discribemsg = results[i].md5;
					break;
				case "name": 
					discribetitle = "名称";
					discribemsg = results[i].originalname;
					break;
				case "time":
					discribetitle = "上传时间";
					let uploaddatetime = new Date(results[i].uploadtime);
					discribemsg = uploaddatetime.toLocaleDateString() + " " +
						uploaddatetime.toLocaleTimeString();
					break;
			}
			$("#resultdiv").append(
				"<div class='col-md-4'>"+
				"<div class='card mb-4 shadow-sm'>"+
				"<img src='" + results[i].url + "' class='bd-placeholder-img card-img-top' />"+
				"<div class='card-body'>"+
				"<p class='card-text'><a href='" +
				results[i].url + "' target='_blank'>" + results[i].url + "</a></p>"+
				"<hr />" +
				"<p class='card-text'>原图片" + discribetitle + "：<br />" + discribemsg + "</p>"+
				"</div>" +
				"</div>" +
				"</div>"
			);
			//滚动页面
			let $target = $('[name=resulttag]');
			let targetOffset = $target.offset().top;
			$('html,body').animate({
				scrollTop: targetOffset
			}, 500);
		}
	}
	
	$("#fileinput").fileinput({
		uploadUrl: '', //上传接口地址
		language: 'zh', //设置语言
		minFileCount: 1, // 最小上传数量
		maxFileCount: 1, // 最大上传数量
		theme: "explorer-fas", //加载主题
		//过滤图片文件类型
		allowedFileTypes: ['image'],
		allowedPreviewTypes: ['image'],
		allowedFileExtensions: ['png', 'jpg'],
		//最大图片10M
		maxFileSize: 10240,
		showUpload: false, //是否显示上传按钮
		showRemove: true, //显示移除按钮
		showPreview: true, //是否显示预览
		showCancel: false, //是否显示文件上传取消按钮。默认为true。只有在AJAX上传过程中，才会启用和显示
		showCaption: true, //是否显示文件标题，默认为true
		initialCaption: "请选择要搜索的图片...",
		dropZoneTitle: "拖拽至此以搜索...",
		autoOrientImage: false,
		layoutTemplates: {
			actionDelete: '', //去除上传预览缩略图中的上传图片
			actionDownload: '' //去除上传预览缩略图中的下载图标
		}
	});

	$('#fileinput').on('fileloaded', function(event, file, previewId, index, reader) {
		activePreload();
	    getMD5(file).then(function(md5){
			$.ajax({
				url: "findPicByMd5",
				type: "GET",
				contentType: "text/xml",
				data: "searchmd5=" + md5,
				dataType: "json",
				success: function(data) {
					appendRes(data, "MD5");
					deactivePreload();
				}
			});
		});
	});
	
	function getMD5(file) {
		return new Promise(function(resolve, reject) {
			var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
				chunkSize = 2097152, // Read in chunks of 2MB
				chunks = Math.ceil(file.size / chunkSize),
				currentChunk = 0,
				spark = new SparkMD5.ArrayBuffer(),
				fileReader = new FileReader();
	
			fileReader.onerror = function() {
				console.warn('oops, something went wrong.');
			};
			
			function loadNext() {
				var start = currentChunk * chunkSize,
					end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
	
				fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
			}
	
			loadNext();
	
			fileReader.onload = function(e) {
				var res;
				spark.append(e.target.result); // Append array buffer
				currentChunk++;
	
				if (currentChunk < chunks) {
					loadNext();
				} else {
					resolve(spark.end());
				}
			};
		});
	}
	
	laydate.render({
	  elem: '#timeinputpc' ,//指定元素
	  type: 'datetime',
	  range: "~",
	  theme: '#007BFF',
	  calendar: 'true',
	  trigger: 'click'//避免闪退
	});
	
	laydate.render({
	  elem: '#timeinputm1' ,//指定元素
	  type: 'datetime',
	  theme: '#007BFF',
	  calendar: 'true',
	  trigger: 'click'//避免闪退
	});
	
	laydate.render({
	  elem: '#timeinputm2' ,//指定元素
	  type: 'datetime',
	  theme: '#007BFF',
	  calendar: 'true',
	  trigger: 'click'//避免闪退
	});
	
	$("#timemclear").on("click",function(){
		clearTimeInput();
	});
	
	$("#dotimesearch").on("click",function(){
		doTimeSearchPC();
	});
	
	$("#timeinputpc").on("keypress",function(event){
		if(event.keyCode === 13) {
			doTimeSearchPC();
		}
	});
	
	$("#timemsubmit").on("click",function(){
		doTimeSearchMobile();
	});
	
	function doTimeSearchPC() {
		if($("#timeinputpc").val().indexOf("~") > 0) {
			let start = $("#timeinputpc").val().split("~")[0].trim();
			let end = $("#timeinputpc").val().split("~")[1].trim();
			doTimeSearch(start,end);//2020-03-14 15:23:00
		} else {
			layer.alert('您还未输入时间范围或格式错误！请选择范围！', {
				icon: 2
			},function(index){
				layer.close(index);
				
			});
		}
	}
	
	function doTimeSearchMobile() {
		let start = $("#timeinputm1").val().trim();
		let end = $("#timeinputm2").val().trim();
		if(start.length > 0 && end.length > 0) {
			doTimeSearch(start, end);//2020-03-14 15:23:00
		} else {
			layer.alert('请选择搜索的时间范围！', {
				icon: 2
			},function(index){
				layer.close(index);
				
			});
		}
	}
	
	function doTimeSearch(start, end) {
		////2020-03-14 15:23:00 -> 
		let starttimestamp = new Date(start).valueOf();
		let endtimestamp = new Date(end).valueOf();
		/*
		console.log(starttimestamp);
		console.log(endtimestamp);
		*/
		//2,678,400,000 = 1000ms * 60s * 60m * 24h * 31d
		//时间范围最大31天
		let sub = Math.abs(endtimestamp - starttimestamp);
		if(sub > 2678400000) {
			layer.alert('时间范围过大！', {
				icon: 2
			},function(index){
				layer.close(index);
				clearTimeInput();
			});
		} else {
			activePreload();
			//查询后端接口
			$.ajax({
				url: 'findPicByTime',
				type: 'GET',
				data: 'starttime=' + starttimestamp + '&endtime=' + endtimestamp,
				contentType: 'text/xml',
				dataType: 'json',
				success: function(results) {
					appendRes(results, "time");
					deactivePreload();
				}
			});
		}
	}
	
	function clearTimeInput() {
		$("#timeinputm1").val("");
		$("#timeinputm2").val("");
		$("#timeinputpc").val("");
	}
});