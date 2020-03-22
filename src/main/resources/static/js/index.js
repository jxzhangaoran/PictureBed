$(document).ready(function() {
	//锚点跳转滑动效果
	$("#startuse").click(function() {
		if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
			var $target = $(this.hash);
			$target = $target.length && $target || $('[name=' + this.hash.slice(1) + ']');
			if ($target.length) {
				var targetOffset = $target.offset().top;
				$('html,body').animate({
					scrollTop: targetOffset
				}, 1000);
				return false;
			}
		}
	});

	$("#fileinput").fileinput({
		uploadUrl: 'uploadImage', //上传接口地址
		language: 'zh', //设置语言
		minFileCount: 1, // 最小上传数量
		maxFileCount: 5, // 最大上传数量
		theme: "explorer-fas", //加载主题
		//过滤图片文件类型
		allowedFileTypes: ['image'],
		allowedPreviewTypes: ['image'],
		allowedFileExtensions: ['png', 'jpg'],
		//最大图片10M
		maxFileSize: 10240,
		showUpload: true, //是否显示上传按钮
		showRemove: true, //显示移除按钮
		showPreview: true, //是否显示预览
		showCancel: true, //是否显示文件上传取消按钮。默认为true。只有在AJAX上传过程中，才会启用和显示
		showCaption: true, //是否显示文件标题，默认为true
		uploadAsync: true, //默认异步上传
		autoOrientImage: false,
		layoutTemplates: {
			actionDelete: '', //去除上传预览缩略图中的上传图片
			actionDownload: '' //去除上传预览缩略图中的下载图标
		}
	});
	
	var solved = true;
	
	$('#fileinput').on('filepreupload', function(event, data, previewId, index) {
		var form = data.form,
			files = data.files,
			extra = data.extra,
			response = data.response,
			reader = data.reader;
		console.log(data.files);
			
		if(!solved) {
			return {
				 message: '未知错误，上传失败！'
			};
		}
	});
	
	let md5arr = [];
	$('#fileinput').on('fileloaded', function(event, file, previewId, index, reader) {
		getMD5(file).then(function(md5) {
			console.log(md5arr);
			if (md5arr.indexOf(md5) != -1) {
				layer.alert('请勿上传重复图片！', {
					icon: 2
				},function(index){
					md5arr = [];
					$("#fileinput").fileinput("reset");
					layer.close(index);
					solved = false;
				});
			}
			else {
				md5arr[md5arr.length] = md5;
				solved = true;
			}
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
	
	//清空全部或重置时，清空MD5数组
	$('#fileinput').on('fileclear', function(event) {
		md5arr = [];
		solved = true;
	});
});
