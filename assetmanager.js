function AssetManager(){
    var queue = [];
    var assetManager = this;
    var cache = {};

    this.queueDownload = function(path){
        if(queue.indexOf(path) === -1){
            queue.push(path);
        }
    };

    this.download = function(path, cb){
        if(cache[path]){
            if(cb){
                cb(this.getAsset(path));
            }
        }else{
            this.queueDownload(path);
            var image = new Image();
            var imageLoadedHandler = function(){
                cache[path] = image;
                queue = queue.splice(queue.indexOf(path), 1);
                if(cb){
                    cb(image);
                }
            };
            if(image.addEventListener){
                image.addEventListener("load", imageLoadedHandler, false);
            }else{
                image.attachEvent("onload", imageLoadedHandler);
            }
            image.src = path;
        }
    };

    this.downloadAll = function(cb){
        if(queue.length === 0){
            if(cb){
                cb();
            }
        }else{
            for(var i=0; i<queue.length; ++i){
                assetManager.download(queue[i], function(){
                    if(queue.length === 0 && cb){
                        cb();
                    }
                });
            }
        }
    };

    this.getAsset = function(path){
        return cache[path];
    };
}