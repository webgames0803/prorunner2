/*
----------------------------------------
------Global variables & Constants------
----------------------------------------
*/
var HOLEFRAMERATE=25;
var PLAYERFRAMERATE=25;

var SCRWIDTH=0;
var HOLESPEED=3;
var PLAYERSPEED=4;

var HOLESIZEMIN=70;
var HOLESIZEMAX=190;

var HOLEDISTMIN=50;
var HOLEDISTMAX=500;

var FLOOR_COLOR="rgb(130,150,225)";
var ROOF_COLOR="rgb(130,150,225)"; 
var PLAYER_COLOR="Lime";

var pcx=300;
var pcy=280;
var rcx=0;
var rcy=0;
var fcx=0;
var fcy=400;
var scrh=500;
var myhole=[];
var myrhole=[];
var rlind=0;
var flind=0;
var myplayer;
var htimer,ptimer;
var scorecntr=0;

var icon=new Image();
var imgidx=1;
var itimer;
var o1timer;
var o2timer;
var obsartimer;
var obsegtimer;
var arrow=new Image();
var eagleimg=new Image();
var eagleflag=0;
var EAGLE_VSPEED=2;

var IsArrow=false;
var IsBird=false;
var Isreward=false;

var blood=new Image();

var fx1=0;
var fx2=2001;
var fimg=new Image();
var rimg=new Image();
var rwimg=new Image();
var mhole=new Image();

var win;
var winanimate;
var winidx=1;

var reward;
var rewardtimer;
var rewcrtimer;

var isbooton=false;
var isshieldon=false;
var bootonscore=0;

var dontmove=0;

var bootbar;
var shieldbar;
var prgsshield=new Image();
var prgsboot=new Image();

var ctx1;
var c1;

var arstart;
var egstart;
var rwstart;

var speedcntr=0;
var barconst=0;
var playerscore=0;

var patcnt=2000;

var ca=false;
var cr=false;
var ce=false;
/*
----------------------------------------
-----Filp b/w roof and floor----------
----------------------------------------
*/
document.addEventListener('keyup', event => 
{
  if (event.code === 'Space')  
  {
   flipPlayer();
  }
})

function MouseClk()
{
  if(document.getElementById("btnstart").disabled == true)
  {
   flipPlayer();
  }
}

function flipPlayer()
{
  if(myplayer.out==false)
  {
    if(myplayer.pos=="floor" && myplayer.y<=3+rcy+(scrh-fcy))
       myplayer.pos="roof";
    else if(myplayer.pos=="roof" && myplayer.y+myplayer.height>=fcy-3)
       myplayer.pos="floor";
 }
}
 
function arrowanimate()
{
 arrows.draw();
 if(
    (((arrows.x-myplayer.x)<myplayer.width && (arrows.x-myplayer.x)>0) || ((myplayer.x-arrows.x)<arrow.width && (arrows.x-myplayer.x)<0))
    && 
    (((myplayer.y-arrows.y)<arrow.height && (myplayer.y-arrows.y)>0)|| ((arrows.y-myplayer.y)<myplayer.height && (myplayer.y-arrows.y)<0))
   )
   {
     
     if(isshieldon==true)
     {
       dontmove=1;
     }
     else
     {
      StopGame();
      EndGame();
      IsArrow=false;
      ctx.drawImage(blood,myplayer.x-70,myplayer.y-70);
     }

   } 
 if(arrows.x+arrow.width<-2)
 {
   ctx.clearRect(arrows.x+12,arrows.y,arrow.width,arrow.height);
   IsArrow=false;
   clearInterval(o1timer);
 }
 
}

function eagleanimate()
{
 eagle.draw();
 if(
    (((eagle.x-myplayer.x)<myplayer.width && (eagle.x-myplayer.x)>0) || ((myplayer.x-eagle.x)<eagleimg.width && (eagle.x-myplayer.x)<0))
    && 
    (((myplayer.y-eagle.y)<eagleimg.height && (myplayer.y-eagle.y)>0)|| ((eagle.y-myplayer.y)<myplayer.height && (myplayer.y-eagle.y)<0))
   )
  {
     if(isshieldon==true)
     {
      var ph=eagleimg.height;
      eagleimg.src="images/spower.png";
      var dh=160-ph;
      if(eagle.y-dh<(rcy+scrh-fcy))
         eagle.y=(rcy+scrh-fcy);
      else
       eagle.y-=dh; 
      
     }
     else
     {
      StopGame();
      EndGame();
      ctx.drawImage(blood,myplayer.x-70,myplayer.y-70);
      IsBird=false;
     }
   }  
 if(eagle.x+eagleimg.width<-2)
 {
   ctx.clearRect(eagle.x+12,eagle.y,eagleimg.width,eagleimg.height);
   IsBird=false;
   clearInterval(o2timer);
 }
 

}

function rewardanimate()
{
 reward.draw();
 if(
    (((reward.x-myplayer.x)<myplayer.width && (reward.x-myplayer.x)>0) || ((myplayer.x-reward.x)<rwimg.width && (reward.x-myplayer.x)<0))
    && 
    (((myplayer.y-reward.y)<rwimg.height && (myplayer.y-reward.y)>0)|| ((reward.y-myplayer.y)<myplayer.height && (myplayer.y-reward.y)<0))
   )
   {
     ctx.clearRect(reward.x+HOLESPEED-2,reward.y,rwimg.width+4,rwimg.height);
     Isreward=false;
     if(reward.type=="shield")
     {
       isshieldon=true;
       shieldbar.over=false;
       shieldbar.colour="Crimson";
       shieldbar.min=scorecntr;
       shieldbar.max=scorecntr+getrange(1300,1600)-barconst;
       shieldbar.setcvalue(scorecntr);
     }
     else
     {
       isbooton=true;
       bootonscore=scorecntr;
       bootbar.over=false;
       bootbar.min=scorecntr;
       bootbar.max=scorecntr+getrange(1200,1500)-(3*barconst);
       bootbar.setcvalue(scorecntr);
     }
     clearInterval(rewardtimer);
   } 
 if(reward.x+rwimg.width<-2)
 {
   ctx.clearRect(reward.x+HOLESPEED-2,reward.y,rwimg.width+4,rwimg.height);
   Isreward=false;
   clearInterval(rewardtimer);
 }


}


function speedcontrol()
{
   if(speedcntr<5)
   {
    barconst+=50;
    HOLESPEED++;
    PLAYERSPEED++;
    speedcntr++;
    EAGLE_VSPEED+=0.5;
   }
}


function changepattern()
{
 if(IsArrow!==true && ca==false)
 {
   clearInterval(obsartimer);
   ca=true;
   obsartimer=setInterval(obsarcreate,getrange(15000,22000));
 }
 if(IsBird!==true && ce==false)
 {
   clearInterval(obsegtimer);
   ce=true;
   obsegtimer=setInterval(obsegcreate,getrange(5000,15000));
 }
 if(Isreward!==true && cr==false)
 {
   clearInterval(rewcrtimer);
   cr=true;
   rewcrtimer=setInterval(rewardcreate,getrange(25000,35000));
 }
}

/*
---------------------------------
-----------Hole Movement---------
---------------------------------
*/
function holeanimate()
{
 scorecntr++;
 if(isshieldon==true)
 {
  shieldbar.setcvalue(scorecntr);
  if(shieldbar.over==true)
    isshieldon=false;
 }
 if(isbooton==true)
 {
  bootbar.setcvalue(scorecntr);
  if(bootbar.over==true)
    isbooton=false;
 }

 if(scorecntr>patcnt && scorecntr<patcnt+500)
 {
  if(cr==false || ce==false || ca==false)
    changepattern();
  if(scorecntr==patcnt+499)
  {
   patcnt+=2000;
   cr=false;
   ce=false;
   ca=false;
  }
 }
  
 if((scorecntr%5000)==0)
   speedcontrol();
  
 ctx.drawImage(fimg,fx1,fcy);
 ctx.drawImage(fimg,fx2,fcy);
 ctx.drawImage(rimg,fx1,rcy);
 ctx.drawImage(rimg,fx2,rcy);
 fx1-=HOLESPEED;
 fx2-=HOLESPEED;
 if(fx1<-2000)
   fx1=2001;
 if(fx2<-2000)
   fx2=2001;
  ctx1.clearRect((SCRWIDTH/2)-50,10,150,70);
  ctx1.fillStyle="white"; 
  ctx1.fillText(scorecntr,(SCRWIDTH/2)-50,40);
  var k=0;
  for(var j=0;j<5;++j)
   {
    myhole[j].draw();
    myrhole[j].draw(); 
    if(myhole[j].x+myhole[j].width<-2)
    {
       k=0;
       if(myhole[flind].x+myhole[flind].width<SCRWIDTH)
         k=SCRWIDTH-(myhole[flind].x+myhole[flind].width); 
       myhole[j].x=myhole[flind].x+myhole[flind].width+getrange(HOLEDISTMIN,HOLEDISTMAX)+k;
       myhole[j].width=getrange(HOLESIZEMIN,HOLESIZEMAX);
       flind=j;
    }
    if(myrhole[j].x+myrhole[j].width<-2)
    {
       k=0;
       if(myrhole[rlind].x+myrhole[rlind].width<SCRWIDTH)
         k=SCRWIDTH-(myrhole[rlind].x+myrhole[rlind].width);
       myrhole[j].x=myrhole[rlind].x+myrhole[rlind].width+getrange(HOLEDISTMIN,HOLEDISTMAX)+k;
       myrhole[j].width=getrange(HOLESIZEMIN,HOLESIZEMAX);
       rlind=j;
    }
     
   }
}
/*
----------------------------------------
----------player movement---------------
----------------------------------------
*/
function playeranimate()
{
  myplayer.animate();
  if(myplayer.out)
    {
     StopGame();     
    }
  if(myplayer.over)
    {
     EndGame();
    }
} 

function StopGame()
{
   clearInterval(htimer);
   clearInterval(itimer);
   clearInterval(o1timer);
   clearInterval(o2timer);
   clearInterval(obsartimer);
   clearInterval(obsegtimer);
   clearInterval(rewardtimer);
   clearInterval(rewcrtimer);
}

function EndGame()
{
     playerscore=scorecntr;
     clearInterval(ptimer);
     barconst=0;
     HOLESPEED=3;
     PLAYERSPEED=4;
     speedcntr=0;
     EAGLE_VSPEED=2;
     patcnt=2000;
     IsBird=false;
     IsArrow=false;
     rlind=0;
     flind=0;
     var ps=document.getElementById("score");
     ps.innerHTML=scorecntr;
     var ts=document.getElementById("tscore");
     var tn=document.getElementById("topscorer");

     if(parseInt(localStorage.getItem("tpscore"))<=parseInt(ps.innerHTML) || localStorage.getItem("tpscore")==null)
     {
           congratulate();
           ts.innerHTML=ps.innerHTML;
           tn.innerHTML=document.getElementById("username").value;
           localStorage.setItem("tpscore",ts.innerHTML);
           localStorage.setItem("tpname",tn.innerHTML);
      }
     document.getElementById("btnstart").disabled = false;
     document.getElementById("btnstart").className="btn";
}


/*
----------------------------------------
-------------Hole object----------------
----------------------------------------
*/
function hole(x,y,width,height,color,bgcolor,type)
{
 this.x=x;
 this.y=y;
 this.width=width;
 this.height=height;
 this.color=color;
 this.bgcolor=bgcolor;
 this.type=type;
 this.draw=function()
  { 
    this.x=this.x-HOLESPEED;
    ctx.fillStyle=this.color;
    ctx.clearRect(this.x,this.y,this.width,this.height);
    if(isbooton==true && this.x+this.width>myplayer.x)
    {
     ctx.fillStyle="rgb(190,220,10)";
     if(this.type=="f")
       ctx.fillRect(this.x,this.y,this.width,10);
     else
       ctx.fillRect(this.x,this.y+this.height-10,this.width,10);
    }
  }
 
}

function congratulate()
{
  winanimate=setInterval(showwin,70);
}

function showwin()
{
 if(winidx!==6)
 {
 win=document.getElementById("cg"+winidx);
 if(winidx!==1)
 {
  ctx.clearRect((SCRWIDTH/2)-425,(scrh/2)-90,1600,200);
 }
 ctx.drawImage(win,SCRWIDTH/2-425,scrh/2-90);
 winidx++;	
 }
 else
 {
  winidx=1;
  clearInterval(winanimate);
 }
}
/*
------------------------------------------
-------------player object----------------
------------------------------------------
*/
function arrowobs(x,y)
{
  this.x=x;
  this.y=y;
  this.sx=0;
  this.draw=function()
   {
     ctx.clearRect(this.x+12,this.y,arrow.width,arrow.height);
     if(dontmove==1)
        ctx.drawImage(mhole,this.x-15,this.y-10); 
     ctx.drawImage(arrow,this.sx,0,200,50,this.x,this.y,200,50);
     if(dontmove==1)
     {
      this.sx+=6;
        if(this.sx>=arrow.width)
       {
       ctx.clearRect(this.x,this.y,300,arrow.height);
       IsArrow=false;
       ctx.clearRect(this.x-15,this.y-10,mhole.width,mhole.height);
       dontmove=0;
       this.sx=0;
       clearInterval(o1timer);
       }
     }
     if(dontmove==0)
      this.x=this.x-12;
   }
}

function rewardobj(x,y,rwtype)
{
  this.x=x;
  this.y=y;
  this.type=rwtype;
  this.draw=function()
   {
     ctx.clearRect(this.x+HOLESPEED,this.y,rwimg.width,rwimg.height);
     ctx.drawImage(rwimg,this.x,this.y);
     this.x=this.x-HOLESPEED;
   }

}

function eagles(x,y)
{
  this.x=x;
  this.y=y;
  this.draw=function()
   {
     this.x=this.x-HOLESPEED;
     if(eagleflag%2==0)
     {
       this.y=this.y-EAGLE_VSPEED;
       ctx.clearRect(this.x+HOLESPEED,this.y+EAGLE_VSPEED,eagleimg.width+20,eagleimg.height);
     }
     else
     {
       this.y=this.y+EAGLE_VSPEED;
       ctx.clearRect(this.x+HOLESPEED,this.y-EAGLE_VSPEED,eagleimg.width+20,eagleimg.height);
     }
     if(this.y<=(scrh-fcy+rcy) || this.y+eagleimg.height>=fcy)
       eagleflag++; 
     ctx.drawImage(eagleimg,this.x,this.y);
   }

}

function playerimagechange()
  {
     if(myplayer.y+myplayer.height==fcy || myplayer.y==(rcy+scrh-fcy))
     {
      if(imgidx==6)
         imgidx=1;
      else
         imgidx++;
     }
     else
       imgidx=5; 
     if(myplayer.pos=="roof")
      icon.src="images/playerf"+imgidx+".png";
     else
      icon.src="images/playerr"+imgidx+".png";   
  }

function player(x,y,width,height,color,bgcolor)
{
 this.x=x;
 this.y=y;
 this.width=width;
 this.height=height;
 this.color=color;
 this.bgcolor=bgcolor;
 this.pos="roof";
 this.out=false;
 this.over=false;
 
 this.draw=function()
  { 
      ctx.drawImage(icon,this.x,this.y);
  }
 this.animate=function()
 { 
    if(this.out==false)
    {
        ctx.clearRect(this.x-1,this.y,this.width+3,this.height);
        if(this.pos=="floor" && this.y>=(rcy+scrh-fcy))
         {
          this.y=this.y-PLAYERSPEED;
          if(this.y<rcy+scrh-fcy)
           this.y=rcy+scrh-fcy;
         }
  
        if(this.pos=="roof" && (this.y+this.height)<=fcy)
        {
           this.y=this.y+PLAYERSPEED;
           if(this.y+this.height>fcy)
             this.y=fcy-this.height;
        }
           this.draw();
        if(this.y+this.height>=fcy-3)
        {
          for (var i=0;i<5;++i)
            {
              if(this.x>myhole[i].x && this.x+this.width<myhole[i].x+myhole[i].width && this.y+this.height>=fcy-3)
               {
                this.out=true;
                break;
               }
            }

        }
        if(this.y<=(3+rcy+scrh-fcy))
        {
            for (var i=0;i<5;++i)
            {
              if(this.x>myrhole[i].x && this.x+this.width<myrhole[i].x+myrhole[i].width && this.y<=(3+rcy+scrh-fcy))
               {
                this.out=true;
                break;
               }
            }
        } 
    } // if-out
    else
    {
       ctx.clearRect(this.x,this.y-1,this.width+2,this.height+2); 
       if(this.pos=="roof") 
         this.y+=3;
       else
         this.y-=3;
       this.draw();
       if(this.y<-80 || this.y>scrh+80)
           this.over=true;
    } // if-else-out

  //this.out=false;//---------uncomment this line to not get out while stepping the holes


   if(isbooton==true && this.out==true)
    this.out=false;
  } //animate
} // player-obj

function progressbar(x,y,width,height,colour,image)
{
 this.x=x;
 this.y=y;
 this.width=width;
 this.iwidth=width;
 this.height=height;
 this.colour=colour;
 this.min=0;
 this.max=0;
 this.over=false;
 this.image=image;
 this.setcvalue=function(cvalue)
 {
  this.width=Math.trunc(this.iwidth-((cvalue-this.min)/(this.max-this.min))*this.iwidth);
  if(this.width<=0)
  {
   this.over=true;
   ctx1.clearRect(this.x-2,this.y,this.iwidth,this.height);
   ctx1.clearRect(this.x-60,this.y-15,this.image.width,this.image.height); 
  }
  else
  {
  ctx1.drawImage(this.image,this.x-60,this.y-15);
  ctx1.fillStyle=this.colour;
  ctx1.clearRect(this.x,this.y,this.iwidth,this.height);
  ctx1.fillRect(this.x,this.y,this.width,this.height);
  }
 }
}
/*
----------------------------------------
-----------Initial screendraw-----------
----------------------------------------
*/
function gamescreendraw()
{

 

 fimg.src="images/floortiles.png";
 rimg.src="images/rooftiles.png";

 c=document.getElementById("canvas");
 c.width = window.innerWidth/1.017;
 SCRWIDTH = c.width;

 c1=document.getElementById("msgcanvas");
 c1.width = window.innerWidth/1.017;

 ctx=c.getContext("2d");
 ctx1=c1.getContext("2d");
 
 ctx.font = "40px Georgia";
 ctx1.font = "40px Georgia";
 document.getElementById("topscorer").innerHTML=localStorage.getItem("tpname");
 document.getElementById("tscore").innerHTML=localStorage.getItem("tpscore");  
 scorecntr=0;
 arrow.src="images/arrow1.png";
 eagleimg.src="images/eagle1.png";
 blood.src="images/blood.png";
 rwimg.src="images/boot1.png";
 mhole.src="images/mhole.png";
 prgsshield.src="images/prgsshield.png";
 prgsboot.src="images/prgsboot.png";
 ctx.drawImage(fimg,fx1,fcy);
 ctx.drawImage(rimg,fx1,rcy); 
 
 var ps=document.getElementById("score");
 ps.innerHTML=playerscore;
 //localStorage.clear();
}

/*
----------------------------------------
-------------start game-----------------
----------------------------------------
*/
function obsarcreate()
{
   if(scorecntr>arstart && IsArrow==false)
   {
     IsArrow=true;
     arrow.src="images/arrow"+getrange(1,8)+".png";
     arrows=new arrowobs(SCRWIDTH+getrange(1000,1200),scrh/2+getrange(-5,+5));
     o1timer=setInterval(arrowanimate,20);
   }
 }

function obsegcreate()
{
  if(scorecntr>egstart && IsBird==false)
   {
    IsBird=true;
    eagleimg.src="images/eagle"+getrange(1,12)+".png";     
    myhole[flind].x+=800;
    myrhole[rlind].x=myhole[flind].x;
    eagle=new eagles(myhole[flind].x-500,fcy-150);
    o2timer=setInterval(eagleanimate,HOLEFRAMERATE);
   }
}


function rewardcreate()
{

 if(scorecntr>rwstart && Isreward==false)
   {
     Isreward=true;
     var i=getrange(0,6);
     if(i%2==0)
     {
       rwimg.src="images/shield.png";
       reward=new rewardobj(SCRWIDTH+getrange(1000,1200),scrh/2+getrange(-5,+5),"shield");
       rewardtimer=setInterval(rewardanimate,HOLEFRAMERATE);
     }
     else
     {
       rwimg.src="images/boot1.png";
       reward=new rewardobj(SCRWIDTH+getrange(1000,1200),scrh/2+getrange(-5,+5),"boot");
       rewardtimer=setInterval(rewardanimate,HOLEFRAMERATE);
     }
   } 

}


function toggleFullScreen(elem)
{
    if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen))
    {
        if (elem.requestFullScreen) {
            elem.requestFullScreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullScreen) {
            elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    }
}


function startgame()
{
 if(document.getElementById("username").value.trim()=="")
    alert("Please enter your name before start the game.!");
 else
 {
   document.getElementById("btnstart").disabled = true;
   document.getElementById("btnstart").className="btnd";
   toggleFullScreen(document.body);
   gamescreendraw();
 
   shieldbar=new progressbar(SCRWIDTH-400,15,350,35,"Crimson",prgsshield);
   bootbar=new progressbar(80,15,350,35,"Blue",prgsboot);
   
   myhole[0]=new hole(SCRWIDTH+getrange(HOLEDISTMIN,HOLEDISTMAX),fcy,getrange(HOLESIZEMIN,HOLESIZEMAX),scrh-fcy,"white",FLOOR_COLOR,"f");
   for(var i=1;i<=4;++i)
       myhole[i]=new hole(myhole[i-1].x+myhole[i-1].width+getrange(HOLEDISTMIN,HOLEDISTMAX),fcy,getrange(HOLESIZEMIN,HOLESIZEMAX),scrh-fcy,"white",FLOOR_COLOR,"f");
 
   myrhole[0]=new hole(SCRWIDTH+getrange(HOLEDISTMIN,HOLEDISTMAX),rcy,getrange(HOLESIZEMIN,HOLESIZEMAX),scrh-fcy,"white",ROOF_COLOR,"r");
   for(var i=1;i<=4;++i)
      myrhole[i]=new hole(myrhole[i-1].x+myrhole[i-1].width+getrange(HOLEDISTMIN,HOLEDISTMAX),rcy,getrange(HOLESIZEMIN,HOLESIZEMAX),scrh-fcy,"white",ROOF_COLOR,"r");
   rlind=4;
   flind=4;
   myplayer=new player(pcx,rcy+(scrh-fcy),50,80,PLAYER_COLOR,"white");
   myplayer.draw();

   arstart=getrange(800,1500);
   egstart=getrange(600,1700);
   rwstart=getrange(300,400);

   obsartimer=setInterval(obsarcreate,getrange(18000,22000));
   obsegtimer=setInterval(obsegcreate,getrange(5000,12000));
   rewcrtimer=setInterval(rewardcreate,getrange(16000,35000));

   htimer=setInterval(holeanimate,HOLEFRAMERATE);
   ptimer=setInterval(playeranimate,PLAYERFRAMERATE);
   itimer=setInterval(playerimagechange,130);
   isbooton=false;
   isshieldon=false;
   Isreward=false;
   IsArrow=false;
   IsBird=false;

 }
}
/*
----------------------------------------
-----------random range giver-----------
----------------------------------------
*/
function getrange(min,max) 
{
    return Math.round(Math.random()*(max-min)+min);
}   
