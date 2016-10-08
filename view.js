function getPageScrollOffset() {
    var x = document.documentElement.scrollLeft || document.body.scrollLeft;
    var y = document.documentElement.scrollTop || document.body.scrollTop;
    return {
        left: x,
        top: y
    }
}

function getElementCoordinateInViewport(node) {
    var cor = node.getBoundingClientRect();
    var left = cor.left;
    var top = cor.top;
    var bottom = cor.bottom;
    var right = cor.right;
    var width = right - left;
    var height = bottom - top;
    return {
        left: left,
        right: right,
        top: top,
        bottom: bottom,
        width: width,
        height: height
    }
}

function isVisible(node) {

}

function getViewportSizeWithScrollBar() {
    if (window.innerWidth){
    	return {
		    width: window.innerWidth,
		    height: window.innerHeight
		};
    }

    return {
        width: document.documentElement.clientWidth||document.body.clientWidth,
        height: document.documentElement.clientHeight||document.body.clientHeight
    };
}
