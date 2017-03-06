var ImageState = {
	"NOTLOADED": 1,
	"LOADING": 2,
	"LOADED": 3
};

function _storeImgMetadata(imgMetadata, autoload){
	imgMetadata.forEach(function(imgMetadatum){
		if(!imgMetadatum.name) throw "Image must have non-empty name";
		if(!imgMetadatum.path) throw "Image must have non-empty path";
		if(this._imgIndex[imgMetadatum.name]) throw "Duplicate image name. Name must be unique.";
		var imgItem = {
			name: imgMetadatum.name,
			img: null,
			state: ImageState.NOTLOADED,
			path: imgMetadatum.path
		};
		this._imgs.push(imgItem);
		this._imgIndex[imgMetadatum.name] = imgItem;
		if(autoload) this.load(imgMetadatum.name);
	}, this);
}

function _validateImgName(name){
	if(!this._imgIndex[name]) throw "Unknown image name";
}

/*
	imgMetadata =
		[
			{name: "img1", path: "myimgs/img1.png"},
			{name: "img2", path: "myimgs/img2.png"},
			{name: "img3", path: "myimgs/img3.png"},
			...
		]
*/
var ImageManager = function(imgMetadata, autoload){
	autoload = autoload != null ? autoload : false;
	this._imgs = [];
	this._imgIndex = {};
	_storeImgMetadata.call(this, imgMetadata, autoload);
};

ImageManager.prototype.get = function(name){
	_validateImgName.call(this, name);
	if(this._imgIndex[name].state == ImageState.LOADED){
		return this._imgIndex[name].img;
	}else if(this._imgIndex[name].state == ImageState.LOADING){
		console.log("WARNING (ImageManager): Attempt to retrieve image \"" + name + "\" but image is still loading.");
	}else{
		throw "Image has not been loaded.";
	}
};

ImageManager.prototype.load = function(name){
	_validateImgName.call(this, name);
	var img = new Image();
	var thisObj = this;
	img.addEventListener("load", function() {
		thisObj._imgIndex[name].img = img;
		thisObj._imgIndex[name].state = ImageState.LOADED;
	}, false);
	img.src = this._imgIndex[name].path;
	this._imgIndex[name].state = ImageState.LOADING;
};

ImageManager.prototype.unload = function(name){
	_validateImgName.call(this, name);
	delete this._imgIndex[name];
	this._imgs = this._imgs.filter(function(imgItem){
		return imgItem.name != name;
	});
};

ImageManager.prototype.allImagesLoaded = function(){
	this._imgs.forEach(function(imgMetaData){
		if(imgMetaData.state !== ImageState.LOADED) return false;
	}, this);
	return true;
};

module.exports = ImageManager;