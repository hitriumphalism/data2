/*!
 * [广告代码]
 * @Author   wanghongxin492@emao.com
 * @DateTime 2016-05-10T14:14:51+0800
 */
(function(document, window, undefined) {
    //内部配置
    var PREFIX_CONTAINER = 'emao-ad';
    var PARAMS_URL = 'http://loc.emao.com/getareabyip'; //cb
    var RESOURCE_URL = 'http://adms.emao.com/fl/getadc'; //线上代码
    // var RESOURCE_URL = '1-2-32.json'; //本地测试代码
    var remote={};

    //工具代码
    var tool = {
        bind: function(fn, ctx) {
            var args = Array.prototype.slice.call(arguments, 2);
            return function() {
                var _args = args.slice();
                _args.push.apply(_args, arguments);
                return fn.apply(ctx, _args);
            }
        },
        listenIt:function(reporter){
            reporter.trigger=tool.trigger;
            reporter._events={};
        },
        on:function(reporter,event,fn){
            reporter.trigger=tool.trigger;
            if(!reporter._events[event]){
                reporter._events[event]=[];
            }
            var events=reporter._events[event]
            events.push(fn);
        },
        trigger:function(event,data){
            var events=this._events[event];
            if(events){
                for(var i=0,l=events.length;i<l;++i){
                    events[i](data);
                }
            }
        },
        uuid: function() {
            return new Date().getTime().toString(16) +'-'+ 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },
        mixin: function(target, source) {
            for (var key in source) {
                if (source.hasOwnProperty(key)) {
                    target[key] = source[key];
                }
            }
            return target;
        },
        creatClass: function(proto, initialize) { //class system
            var f = function() {};
            var _class = function() {
                this.initialize.apply(this, arguments);
            };
            f.prototype = proto;
            var _proto = new f;
            _proto.constructor = _class;
            _proto.initialize = initialize || f;
            _class.prototype = _proto;
            return _class;
        },
        camelCase: function(str) { //first letter upperCase
            return str.replace(/^\w/, function(s) {
                return s.toUpperCase();
            });
        },
        cookie: { // cookie getter setter
            get: function getCookie(name) {
                var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
                if (arr != null) return unescape(arr[2]);
                return null;

            },
            set: function SetCookie(name, value, days) {
                days = days || 30;
                var exp = new Date();
                exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
                document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
            }
        },
        id: function(id) { //find dom by id
            return document.getElementById(id);
        },
        min: function(array) {
            return Math.min.apply(Math, array);
        },
        indexOf: function(array, item) {
            var nativeFn = [].indexOf;
            if (nativeFn) {
                return nativeFn.call(array, item);
            } else {
                for (var i = 0, l = array.length; i < l; ++i) {
                    if (array[i] === item) {
                        return i;
                    }
                }
                return -1;
            }
        },
        map: function(array, fn) { //iterator array or object
            var arr = [],
                tmp;
            if (fn instanceof Function) {
                if (array.length >= 0) {
                    for (var i = 0, l = array.length; i < l; i++) {
                        if ((tmp = fn.call(array[i], array[i], i, array)) !== false) {
                            arr.push(tmp);
                        }
                    }
                } else {
                    for (var i in array) {
                        if (array.hasOwnProperty(i) && ((tmp = fn.call(array[i], array[i], i, array)) !== false)) {
                            arr.push(tmp);
                        }
                    }
                }
                return arr;
            } else {
                return {
                    then: function() { //closure
                        tool.map(array, arguments[0]);
                    }
                }
            }
        },
        compile: function tmpl(str, data) { //compile tmp to function that can output html by data
            var fn =
                new Function("obj",
                    "var p=[],print=function(){p.push.apply(p,arguments);};" +
                    "with(obj){p.push('" +
                    str
                    .replace(/[\r\t\n]/g, " ")
                    .split("<%").join("\t")
                    .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                    .replace(/\t=(.*?)%>/g, "',$1,'")
                    .split("\t").join("');")
                    .split("%>").join("p.push('")
                    .split("\r").join("\\'") + "');}return p.join('');");
            return data ? fn(data) : fn;
        },
        jsonp: function jsonp(url, data, fn, cb, cache) {
            cb = cb || 'cb';
            // data[cb] = tmp + cache?prefix:Math.random();
            data[cb] = data[cb] + (cache ? '' : Math.random());
            data[cb] = data[cb].replace('.', '');
            var arr = [];
            for (var i in data) {
                if (data.hasOwnProperty(i)) {
                    arr.push(i + '=' + encodeURIComponent(data[i]));
                }
            }
            var str = arr.join('&');
            window[data[cb]] = function(json) {
                fn(json);
                oHead.removeChild(oS);
                window[data.cb] = null;
            };
            var oS = document.createElement('script');
            oS.src = url + '?' + str;
            var oHead = document.getElementsByTagName('head')[0];
            oHead.appendChild(oS);
        },
        // ajax: (function() {
        //     function json2url(json, cache) {

        //         if (!cache) {
        //             json.t = (Math.random() + '').replace('.', '');
        //         }
        //         var arr = [];
        //         for (var name in json) {
        //             arr.push(name + "=" + encodeURIComponent(json[name]));
        //         }
        //         return arr.join("&");
        //     }
        //     var createAjax = function() {
        //         function xhr() {
        //             return new XMLHttpRequest();
        //         }

        //         function xobj() {
        //             return new ActiveXObject("Microsoft.XMLHTTP");
        //         }
        //         if (window.XMLHttpRequest) {
        //             return xhr;
        //         } else {
        //             return xobj;
        //         }
        //     }();

        //     function ajax(options) {
        //         options = options || {};
        //         var url = options.url;
        //         var data = options.data || {};
        //         var type = options.type || "get";
        //         var timeout = options.timeout || 0;
        //         var fnSucc = options.success;
        //         var fnFaild = options.error;
        //         var cache = options.cache || false;
        //         var str = json2url(data, cache);
        //         var oAjax = createAjax();
        //         var realUrl = cache ? url : url + "?" + str;
        //         if (type == "get") {
        //             oAjax.open("get", realUrl, true);
        //             oAjax.send();
        //         } else {
        //             oAjax.open("post", url, true);
        //             oAjax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        //             oAjax.send(str);
        //         }
        //         oAjax.onreadystatechange = function() {
        //             if (oAjax.readyState == 4) {
        //                 if (oAjax.status >= 200 && oAjax.status < 300 || oAjax.status == 304) {
        //                     fnSucc && fnSucc(oAjax.responseText);
        //                 } else {
        //                     fnFaild && fnFaild();
        //                 }

        //             }
        //         };
        //         if (timeout) {
        //             setTimeout(function() {
        //                 oAjax.abort();
        //             }, timeout);
        //         }

        //     }
        //     return ajax;
        // }()),

        cssom: {
            getSize: function(node) {
                var width;
                var height;
                var tmp;

                if (node.getBoundingClientRect) {
                    tmp = node.getBoundingClientRect();
                    width = tmp.right - tmp.left;
                    height = tmp.bottom - tmp.top;

                } else {
                    width = node.offsetWidth;
                    height = node.offsetHeight;
                }
                return {
                    width: width,
                    height: height
                }
            },
            getPositionInDocument: function(node) {
                var offsetParent = node.offsetParent;
                var top = 0;
                var left = 0;
                while (offsetParent) {
                    top += node.offsetTop;
                    left += node.offsetLeft;
                    node = offsetParent;
                    offsetParent = node.offsetParent;
                }
                return {
                    left: left,
                    top: top
                };
            },
            getPositionInViewport: function(node) {
                var documentLeft = this.getDocumentLeft();
                var documentTop = this.getDocumentTop();
                var positionInDocument = this.getPositionInDocument(node);
                var leftInViewport = positionInDocument.left - documentLeft;
                var topInViewport = positionInDocument.top - documentTop;
                var size = this.getSize(node);
                return {
                    left: leftInViewport,
                    top: topInViewport,
                    right: leftInViewport + size.width,
                    bottom: topInViewport + size.height
                }
            },
            getDocumentLeft: function() {
                return document.documentElement.scrollLeft || document.body.scrollLeft;
            },
            getDocumentTop: function() {
                return document.documentElement.scrollTop || document.body.scrollTop;
            },
            getViewportWidth: function() {
                var maybeArray = [window.innerWidth,
                    document.documentElement.clientWidth,
                    document.body.clientWidth
                ];
                maybeArray = tool.map(maybeArray, function(i) {
                    i = parseInt(i);
                    if (!(i && i > 0)) return false;
                    return i;
                });
                return tool.min(maybeArray);
            },
            getViewportHeight: function() {
                var maybeArray = [window.innerHeight,
                    document.documentElement.clientHeight,
                    document.body.clientHeight
                ];
                maybeArray = tool.map(maybeArray, function(i) {
                    i = parseInt(i);
                    if (!(i && i > 0)) return false;
                    return i;
                });
                return tool.min(maybeArray);
            },
            isInViewport: function(node) {
                var viewportWidth = this.getViewportWidth();
                var viewportHeight = this.getViewportHeight();
                var positionInViewport = this.getPositionInViewport(node);
                return !(positionInViewport.right <= 0 || positionInViewport.left >= viewportWidth || positionInViewport.bottom <= 0 || positionInViewport.top >= viewportHeight);
            }
        },
        Event: {
            on: function(node, ev, fn) {
                if (window.addEventListener) {
                    return function(node, ev, fn) {
                        node.addEventListener(ev, fn, false);
                    }
                } else if (window.attachEvent) {
                    return function(node, ev, fn) {
                        node.attachEvent('on' + ev, fn);
                    }
                }
            }(),
            off: function(node, ev, fn) {
                if (window.removeEventListener) {
                    return function(node, ev, fn) {
                        node.removeEventListener(ev, fn, false);
                    }
                } else if (window.detachEvent) {
                    return function(node, ev, fn) {
                        node.detachEvent('on' + ev, fn);
                    }
                }
            }()
        }
    };
    //广告业务逻辑
    var cat = {//页面广告初始化投放广告
        _callsOfRender: [], //如果wrapAndrenderAndReport生成时，还没有城市id，那么将闭包压入这个变量。如果生成了就立即执行，不再压入这个变量了。
        _callsOfReport: [], //如果report生成时，还没有省份id，那么将闭包压入这个变量。如果生成了就立即执行，不再压入这个变量了。
        usedCityId: null, //外部值优先，cookie值次之，最后为服务器接口
        set: function(name, value) {
            this[name] = value;
            return this;
        },
        setUsedCityId: function() {
            return (cat.usedCityId = this.external.cityId || tool.cookie.get('city_id') || this.collectRemoteData()), this;
        },
        shouldRender: function() { //解析广告依赖于cityid
            return !!this.usedCityId;
        },
        shouldReport: function() {
            return !!((this.external.provinceId || this.params.provinceId ||tool.cookie.get('province_id') || this.remote.provinceId) && this.usedCityId);
        },
        // getCity: function(wrapThenRenderThenReport, cityId) {
        //     return cityId && wrapThenRenderThenReport(cityId) || this.collectRemoteData(tool.bind(wrapThenRenderThenReport, null, cityId)), this;
        // },
        collectData: function() { //收集数据
            return cat.collectLocalData() || cat.collectRemoteData(), this; //先从本地收集，如果没有再从远程收集
        },
        collectLocalData: function() { //收集本地数据
            var pos=tool.cookie.get('EMADPOS');
            if(pos){
                var posArray=pos.split('@');
                var city=posArray[0];
                var province=posArray[1];
            }
            var params = {
                userId: tool.cookie.get('EMADGUID'),
                cityId: tool.cookie.get('city_id')||city,
                provinceId: tool.cookie.get('province_id')||province
            };
            if(!params.userId){
                params.userId=tool.uuid();
                tool.cookie.set('EMADGUID',params.userId,100000);
            }
            tool.mixin(this.params, params);
            if (params.cityId && params.provinceId) {
                return true;
            }
        },
        collectRemoteData: function() {
            var ifCallRemote = false;
            return function(fn) { //收集远程数据
                if (ifCallRemote) return; //飞哥的jsonp接口只需要请求一次就可以了
                ifCallRemote = true;
                tool.jsonp(PARAMS_URL, { cb: 'fl' },
                    function(remote) {
                        if (remote.code == 0) {
                            var data = {
                                provinceId: remote.data.provinceID,
                                cityId: remote.data.cityID
                            };
                            tool.mixin(cat.remote, data); //将省份和城市存入remote
                            fn && fn();
                            tool.cookie.set('EMADPOS', data.cityId+'@'+data.provinceId); //写入本地
                            cat.cityId = data.cityId; //应该没用的，先留着，之后观察
                            cat.setUsedCityId();
                            tool.map(cat._callsOfRender, function(render) { //如果飞哥的接口慢，那么广告数据已经在_callsOfRender里等待执行了
                                render(data.cityId); //解析出广告并渲染它
                            });
                            tool.map(cat._callsOfReport, function(report) { //用户看到广告后，并且获取到飞哥数据后发送统计请求
                                report();
                            });
                            cat._callsOfRender = []; //执行完清空，避免多次执行//不清空也不会再执行了，但是以防万一
                            cat._callsOfReport = [];
                        }
                    },
                    'cb');
                return;
            }
        }(),
        findContainer: function(str) { //搜索本文档下的所有广告位
            var id;
            var divs = document.getElementsByTagName('div');

            function iterator(item) {
                var id = item.getAttribute('id');
                return (id && id.indexOf(str) > -1) ? id : false;
            }
            return tool.map(divs, iterator);
        },
        Data: tool.creatClass({ // 广告数据类
            getImg: function() { //返回广告的图片
                var data = this.data;
                return data && data.content;
            },
            getData: function(cityId) { //返回广告精准的内容，从小到大，先从城市开始排查，其次，全国，再次默认广告。
                if (this.data) {
                    return this.data;
                }
                var citys = this.resource.city || {};
                for (var key in citys) {
                    if (citys.hasOwnProperty(key)) {
                        var cities = key.split('-');
                        var finded = tool.indexOf(cities, cityId + '');
                        if (finded > -1) {
                            this.data = citys[key].data;
                            return citys[key].data;
                        }
                    }
                }
                if (this.resource.country) {
                    this.data = this.resource.country.data;
                    return this.resource.country.data;
                }
                if (this.resource['default']) {
                    var defaultt = this.resource['default']
                    this.data = defaultt.ifshowdefault == 1 ? defaultt.data : undefined;
                    return this.data;
                }
            },
            getTpl: function() { //返回广告的模板
                var data = this.data;
                return data && (data.hasOwnProperty('adtpl') ? data.adtpl.replace(/\'/g, '"') : this.resource.adtpl.replace(/\'/g, '"'));
            },
            get: function(material) { //读取广告字段
                var ability;
                var data = this.data;
                return (ability = this['get' + tool.camelCase(material)]) ? ability.call(this) : data && data[material];
            }

        }, function(resource, cityId) { //初始化广告数据对象
            this.resource = resource;
            this.getData(cityId);
        }),
        calculateAddressByContainer: function(divId) { //根据广告位计算广告地址
            return divId.replace(PREFIX_CONTAINER + '-', '');
        },
        getContentsByContainer: function(divId) { //根据广告位获取广告内容
            var zid = cat.calculateAddressByContainer(divId);
            var that = this;
            // tool.ajax({ //异步拉广告数据
            //     url: RESOURCE_URL + '?zid=' + encodeURIComponent(zid),
            //     type: 'get',
            //     success: function(resource) {
            //         resource = eval('(' + resource + ')');
            //         if (!resource.hasOwnProperty('zid'))
            //             throw new Error(['没有取到', 'zid:', zid, '的json文件'].join(''));
            //         *
            //          *广告数据的渲染的前置条件是页面的cityId
            //          *来源有同步的外部传参和读取cookie，也有异步的服务器接口
            //          *当页面有可用的cityid时，立即开始渲染流程
            //          *当页面没有可用的cityid时，说明异步服务器接口还没有回传数据，那么把渲染函数和数据封装到闭包里
            //          *压入_callsOfRender数组，等待cityid数据到来时立即执行
            //          *
            //         that.shouldRender() && that.wrapThenRenderThenReport(resource, divId, zid, that.usedCityId) || that._callsOfRender.push(tool.bind(that.wrapThenRenderThenReport, that, resource, divId, zid));
            //     },
            //     error: function(error) {
            //         throw error;
            //     },
            //     cache: true
            // });
            tool.jsonp( //异步拉广告数据
                RESOURCE_URL, {
                    'callback': 'fl' + zid.replace(/\-|\s/g, '_'),
                    'zid': zid
                },
                function(resource) {
                    if (!resource.hasOwnProperty('zid'))
                        throw new Error(['没有取到', 'zid:', zid, '的json文件'].join(''));
                    // *
                    //  *广告数据的渲染的前置条件是页面的cityId
                    //  *来源有同步的外部传参和读取cookie，也有异步的服务器接口
                    //  *当页面有可用的cityid时，立即开始渲染流程
                    //  *当页面没有可用的cityid时，说明异步服务器接口还没有回传数据，那么把渲染函数和数据封装到闭包里
                    //  *压入_callsOfRender数组，等待cityid数据到来时立即执行
                    //  *
                    remote[zid]=resource;
                    remote.trigger(zid,remote[zid]);
                    that.shouldRender() && that.wrapThenRenderThenReport(resource, divId, zid, that.usedCityId) || that._callsOfRender.push(tool.bind(that.wrapThenRenderThenReport, that, resource, divId, zid));
                },
                'callback',
                true //缓存
            );
        },
        wrapThenRenderThenReport: function(resource, divId, zid, cityId) { //可能异步，也可能同步。取决于是否能从外部参数以及本地cookie中读取到城市id，对广告的渲染必须得到这个值后才能进行。如果没有，发起异步请求成功后再执行
            var catFood = new this.Data(resource, cityId); //包装广告数据
            if (!catFood.data) return;
            var aid=catFood.get('aid');
            var search =this.getSearch(zid,aid);
            var render = tool.bind(cat.render, cat, catFood.get('data'), catFood.get('tpl'), divId,tool.bind(this.updateHref,this,divId,search)); //插入到文档
            var request = tool.bind(cat.request, cat, catFood.get('impurl'), catFood.get('impurl3'), search); //向后台报告统计数据

            cat.preload(catFood.get('img'), render, this.asyncOrSyncReport(request)); //先把广告图片加载下来再render，再report;
            return true;
        },
        render: function(data, tpl, target,update) { // 将广告插入文档
            if (!data) return;
            var dom = tool.id(target);
            dom.innerHTML = tool.compile(tpl)(data);
            dom.style.display = 'block';
            update&&update();
            var target = dom.getElementsByTagName('a')[0].children[0];
            return target;
        },
        asyncOrSyncReport: function(report) {
            var that = this;
            return function() {
                if (that.shouldReport()) {
                    report && report();
                } else {
                    that._callsOfReport.push(report);
                }
            }
        },
        preload: function(src, render, request,closeView) { //加载完广告图片后才开始页面的渲染，保证页面的美观。
            var that = this;
            this.loadImg(src, function() {
                var target = render();
                if(closeView){
                    request();
                }else{
                    setTimeout(function() { //交出线程的控制权给ui，ui结束由事件循环按序执行。
                        if (tool.cssom.isInViewport(target)) { //如果在可视区，立刻发起请求。
                            request();
                        } else {
                            that.listeningNodeIsInView(target, request); //如果不在可视区，将request挂载到scrool和resize事件上执行
                        }
                    }, 0);
                }
            });
        },
        listeningNodeIsInView: function(node, cb) { //监听一个对象是否在可视区内
            var Event = tool.Event;
            var cssom = tool.cssom;
            var handdler = function() {
                if (cssom.isInViewport(node)) {
                    cb();
                    Event.off(window, 'scroll', handdler);
                    Event.off(window, 'resize', handdler);
                }
            };
            Event.on(window, 'scroll', handdler);
            Event.on(window, 'resize', handdler);
        },
        request: function(url, url3,search) { // zid，divId，aid绑定到每次请求上，而每次请求的负载的各种统计参数，则由统计对象负责
            var img = new Image();
            this.imp_update(url, search);
            url3 && this.imp_update(url3, ''); //如果有第三方链接，才发送。
        },
        getSearch:function(zid,aid){
            function strategy(item) {
                return item();
            };
            return '?zid=' + zid + '&aid=' + aid + '&' + tool.map(statisticalStrategies, strategy).join('&') + '&t=' + (Math.random() + '').replace('.', '') + (new Date().getTime());
        },
        updateHref:function(divId,search){
            var target = tool.id(divId).getElementsByTagName('a')[0];
            target.setAttribute('href', target['href'] + search.replace(/^\?/, '&'));
        },
        imp_update: function(url, search) {
            var remote = url + search;

            this.loadImg(remote);
        },
        loadImg: function(url, fn) { //浏览器的bug，等函数调用完毕后，可能把图片对象给注销了，而它根本没有来得及发出请求
            //所以把图片对象注册到全局作用域上，等图片下载完毕再清除全局量
            var id = 'img' + (Math.random() + '').replace('.', '');
            var img = window[id] = new Image();
            img.onload = function() {
                fn && fn();
                window[id] = null;
            };
            img.src = url;
        },
        advertise: function() {
            //iterate all ad containers  in this page to get all ad contents
            tool.
            map(this.findContainer(PREFIX_CONTAINER)). //计算出文档所有的广告位
            then(tool.bind(this.getContentsByContainer, this)); //为每个广告位拉广告数据
            return this;
        }
    };
    //动态更新广告位,两者广告统计不一样，cat需要检测可见性，mao点击一次就投放一次
    function update(cityId,zid,ziddata){//不再放入对象里了，为了压缩更加彻底
        var divId=PREFIX_CONTAINER+'-'+zid;
        var catFood= new cat.Data(ziddata,cityId);
        if(!catFood.data)return;
        var aid=catFood.get('aid');
        var search =cat.getSearch(zid,aid);
        var render = tool.bind(cat.render, cat, catFood.get('data'), catFood.get('tpl'), divId,tool.bind(cat.updateHref,this,divId,search));
        var request = tool.bind(cat.request, cat, catFood.get('impurl'), catFood.get('impurl3'),search); //向后台报告统计数据
        cat.preload(catFood.get('img'), render, request,true); //先把广告图片加载下来再render，再report,关闭可见性检测;
    }
    

    //统计策略
    var statisticalStrategies = { //外部参>cookie>remote
        // count: function() {
        //     return ['count','=',1].join('');
        // },
        provinceId: function(province_id) {
            return ['provinceId', '=', province_id||cat.external.provinceId || cat.params.provinceId || cat.remote.provinceId].join('');
        },
        userId: function() {
            return ['userId', '=', cat.params.userId || 0].join('');
        },
        cityId: function(city_id) {
            return ['cityId', '=', city_id ||cat.external.cityId || cat.params.cityId || cat.remote.cityId].join('');
        }
    };
    //为remote添加事件能力
    tool.listenIt(remote);

    //广告逻辑的对外代理，接受外部调用者提供的参数，触发广告业务，且外部只有一次的调用机会;
    var _ma = function() {
        var called = false;
        var init= function(opts) {
            if (called) return;
            called = true; //外部接口开关
            cat.set('external', tool.mixin({}, opts || {})) //外部参数容器
                .set('params', {}) //从cookie里读到的本地值容器
                .set('remote', {}) //口远程读取的外部值容器
                .advertise() //先异步拉广告
                .collectData() //拉广告的空档，先搜集省份id城市id用户id数据;
                .setUsedCityId() //设置cat.cityId
            window._emaoad = afterIniting; //替换外部接口
        };
        var afterIniting={};
        afterIniting.update=function(cityId,zid){
            if(remote[zid]){
                update(cityId,zid,remote[zid]);
            }else{
                tool.on(remote,zid,tool.bind(update,null,cityId,zid));
            }
        };
        return init;
    };
    window._emaoad = _ma();
}(document, window));
