var express = require('express')
var bodyParser = require('body-parser')
//path用于操作和得到路径信息：path.parse()
var path = require('path')
var app = express()
//使用session要引入该模块
var session = require('express-session')

//引入路由
var router = require('./routers/router.js')

//开放public和module
//path.join 用于拼接路径
//每个模块中，除了require和exports外还有__dirname,__filename
//__dirname:用来获取当前文件模块所属目录的绝对路径
//__filename:用来获取当前文件绝对路径
//在node中，文件操作路径相对于执行 node 命令所处路径
//文件操作中使用相对路径使用此方法,把相对路径转换为 动态绝对路径
app.use('/public/',express.static(path.join(__dirname,'./public')))
app.use('/node_modules/',express.static(path.join(__dirname,'./node_modules')))

app.engine('html',require('express-art-template'))
//默认为views目录，也可更改
app.set('views',path.join(__dirname,'./views/'))
//配置post请求,模板引擎和body-parser在挂载路由之前
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
//配置session
//当配置好后，就可以通过req.session 来访问和设置session成员
//添加session数据：req.session.foo = 'bar'
//访问session数据：req.session.foo
app.use(session({
	secret:'keyboard cat',
	resave:false,
	saveUninitialized:true
}))
//把路由容器挂载到app服务中
app.use(router)

//配置404中间件,404必须在最后,否则由于是万能中间件，会阻断其他中间件的执行
app.use(function(req,res){
	res.render('404.html')
})

//配置错误处理中间件
app.use(function(err,req,res,next){
	res.status(500).json({
		err_code:500,
		message:err.message
	})
})

app.listen(3000,function(){
	console.log('port 3000 running...')
})