//本地后台环境
fis.
media('rddev').
match('*.{js,css,png}',{
    useHash:false,
    useSprite:false,
    optimizer:null
});

//本地前端环境
fis.
media('fedev').
match('*.{js,css,png}',{
    useHash:false,
    useSprite:false,
    optimizer:null
});

//前端同学开发完自测没问题后，执行此命令
fis.
media('build').
match('*.js',{
    optimizer:fis.plugin('uglify-js'),
    useHash:false,
    useSprite:false
});
