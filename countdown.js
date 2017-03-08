var WINDOW_WIDTH=1024;
var WINDOW_HEIGHT=768;
var RADIUS=8;
var MARGIN_TOP=60;
var MARGIN_LEFT=30;
const endTime=new Date();
endTime.setTime(endTime.getTime()+3600*1000*24);
var curShowTimeSeconds=0;

var balls=[];
const colors=["#33B5E5","#0099cc","#aa66cc","#9933cc","#99cc00","#669900","#ffbb33","ff8800","ff4444","#cc0000"];

window.onload=function(){
	//播放音乐
	var m=document.createElement("audio");
	m.src="1.mp3";
	m.volume=0.5;
	m.play();
	//自适应处理
	WINDOW_WIDTH=document.documentElement.clientWidth-20;
	WINDOW_HEIGHT=document.documentElement.clientHeight-20;
	MARGIN_LEFT=Math.round(WINDOW_WIDTH/10);
	RADIUS=Math.round(WINDOW_WIDTH*4/5/108)-1;
	MARGIN_TOP=Math.round(WINDOW_HEIGHT/5);

	var canvas=document.getElementById("canvas");
	var context=canvas.getContext("2d");
	var timer;

	canvas.width=WINDOW_WIDTH;
	canvas.height=WINDOW_HEIGHT;
	curShowTimeSeconds=getCurrentShowTimeSeconds();
	timer=setInterval(function(){
			update(context);
		},35);
	//onfocus与onblur是为了消除离开页面返回后的小球堆积问题
	window.onfocus=function(){
		timer=setInterval(function(){
			update(context);
		},35);
	}
	window.onblur=function(){
		clearInterval(timer);
	}

}
//用于更新动画，根据时间及小球位置重新绘制画面
function update(cxt){
	var nextShowTimeSeconds=getCurrentShowTimeSeconds();
	var nextHours=parseInt(nextShowTimeSeconds/3600);
	var nextMinutes=parseInt(nextShowTimeSeconds%3600/60);
	var nextSeconds=parseInt(nextShowTimeSeconds%60);

	var curHours=parseInt(curShowTimeSeconds/3600);
	var curMinutes=parseInt(curShowTimeSeconds%3600/60);
	var curSeconds=parseInt(curShowTimeSeconds%60);

	if(nextSeconds!=curSeconds){
		addBalls(MARGIN_LEFT+93*(RADIUS+1),MARGIN_TOP,parseInt(nextSeconds%10));
		if(parseInt(curSeconds/10)!=parseInt(nextSeconds/10)){
			addBalls(MARGIN_LEFT+78*(RADIUS+1),MARGIN_TOP,parseInt(nextSeconds/10));
			if(parseInt(curMinutes%10)!=parseInt(nextMinutes%10)){
				addBalls(MARGIN_LEFT+54*(RADIUS+1),MARGIN_TOP,parseInt(nextMinutes%10));
				if(parseInt(curMinutes/10)!=parseInt(nextMinutes/10)){
					addBalls(MARGIN_LEFT+39*(RADIUS+1),MARGIN_TOP,parseInt(nextMinutes/10));
					if(parseInt(curHours%10)!=parseInt(nextHours%10)){
						addBalls(MARGIN_LEFT+15*(RADIUS+1),MARGIN_TOP,parseInt(nextHours%10));
						if(parseInt(curHours/10)!=parseInt(nextHours/10)){
							addBalls(MARGIN_LEFT,MARGIN_TOP,parseInt(nextHours/10));
						}
					}
				}
			}
		}

		curShowTimeSeconds=nextShowTimeSeconds;	
	}
	updateBalls();
	render(cxt);
	bgChange(nextHours,nextMinutes,nextSeconds);
}
//通过小时 分钟 秒参数变化来控制页面背景颜色
function bgChange(x,y,z){
	var red=x*10,
	green=y*4,
	blue=z*4;

	document.body.style.background="rgb("+red+","+green+","+blue+")";
}
//更新小球位置，速度等数据，并加入碰撞检测
function updateBalls(){
	var cnt=0;
	for(var i=0;i<balls.length;i++){
		balls[i].x+=balls[i].vx;
		balls[i].y+=balls[i].vy;
		balls[i].vy+=balls[i].g;

		if(balls[i].y>WINDOW_HEIGHT-RADIUS){
			balls[i].y=WINDOW_HEIGHT-RADIUS;
			balls[i].vy=-balls[i].vy*0.75;
		}
		if(balls[i].x>WINDOW_WIDTH-RADIUS){
			balls[i].x=WINDOW_WIDTH-RADIUS;
			balls[i].vx=-balls[i].vx;
		}
		//提升性能，去除已经移动到屏幕之外的小球
		if(balls[i].x+RADIUS>0){
			balls[cnt++]=balls[i];
		}
		// if(balls[i].x+RADIUS<0){
		// 	balls.splice(i,1);
		// }这个方法不正确，因为删除i元素会导致length变化，在下一次遍历时会漏掉元素
	}
	while(balls.length>cnt){
			balls.pop();
	}
}

//获得现在到截止时间的秒数
function getCurrentShowTimeSeconds(){
	var curTime=new Date();
	//倒计时效果模块
	// var ret=endTime.getTime()-curTime.getTime();
	// ret=Math.round(ret/1000);
	// return ret>=0?ret:0;
	//时钟效果模块
	var ret=curTime.getHours()*3600+curTime.getMinutes()*60+curTime.getSeconds();
	return ret;
}

//根据变化后的时间数字生成随机颜色的小球，并加入balls数组
function addBalls(x,y,num){
	for(var i=0;i<digit[num].length;i++){
		for(j=0;j<digit[num][i].length;j++){
			if(digit[num][i][j]==1){
				var aBall={
					x:x+j*2*(RADIUS+1)+(RADIUS+1),
					y:y+i*2*(RADIUS+1)+(RADIUS+1),
					g:1.5+Math.random(),
					vx:Math.pow(-1,Math.ceil(Math.random()*1000))*6,
					vy:-4+Math.random()*2,
					color:colors[Math.floor(Math.random()*colors.length)]
				}
				balls.push(aBall);
			}
		}
	}
}

//更新画面时擦去原有画面并根据时间及小球位置重新绘制画面
function render(cxt){
	cxt.clearRect(0,0,cxt.canvas.width,WINDOW_HEIGHT);
	var hours=parseInt(curShowTimeSeconds/3600);
	var minutes=parseInt(curShowTimeSeconds%3600/60);
	var seconds=parseInt(curShowTimeSeconds%60);

	renderDigit(MARGIN_LEFT,MARGIN_TOP,parseInt(hours/10),cxt);
	renderDigit(MARGIN_LEFT+15*(RADIUS+1),MARGIN_TOP,parseInt(hours%10),cxt);
	renderDigit(MARGIN_LEFT+30*(RADIUS+1),MARGIN_TOP,10,cxt);
	renderDigit(MARGIN_LEFT+39*(RADIUS+1),MARGIN_TOP,parseInt(minutes/10),cxt);
	renderDigit(MARGIN_LEFT+54*(RADIUS+1),MARGIN_TOP,parseInt(minutes%10),cxt);
	renderDigit(MARGIN_LEFT+69*(RADIUS+1),MARGIN_TOP,10,cxt);
	renderDigit(MARGIN_LEFT+78*(RADIUS+1),MARGIN_TOP,parseInt(seconds/10),cxt);
	renderDigit(MARGIN_LEFT+93*(RADIUS+1),MARGIN_TOP,parseInt(seconds%10),cxt);

	for(var i=0;i<balls.length;i++){
		cxt.fillStyle=balls[i].color;
		cxt.beginPath();
		cxt.arc(balls[i].x,balls[i].y,RADIUS,0,2*Math.PI,true);
		cxt.closePath();
		cxt.fill();
	}

}

//根据时间及0 1阵列来画出数字
function renderDigit(x,y,num,cxt){
	cxt.fillStyle="rgb(0,102,153)";

	for(var i=0;i<digit[num].length;i++){
		for(var j=0;j<digit[num][i].length;j++){
			if(digit[num][i][j]===1){
				cxt.beginPath();
				cxt.arc(x+j*2*(RADIUS+1)+(RADIUS+1),y+i*2*(RADIUS+1)+(RADIUS+1),RADIUS,0,2*Math.PI);
				cxt.closePath();
				cxt.fill();
			}
		}
	}
}