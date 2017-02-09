function start(){
    var difficultNum=0.85;
    var bumbNumX=20;
    var bumbNumY=20;
    var bumbNum=bumbNumX*bumbNumY;//总共炸弹的数量，也是总共方块的数量
    var flagNum=0;//已经被插旗的炸弹的数量
    var booNum=0;//游戏结束时，除了被点击的叉号炸弹，剩下已经炸掉的炸弹的数量
    var askNum=0;//疑似是否是炸弹的方块
    var blankNum=0;//被点开是空白的位置。
    var cell=[];//每个小方块的数组
    var cells=[];//每个小方块的二维数组
    var blankSpace=[];//空白区域数组，统一获取，避免递归
    var Cell=function(){
        this.tate=0; //A是初始状态，B是被插旗状态，C是游戏结束被点叉号状态，D是疑似有炸弹问号状态
        var N=Math.random()<difficultNum?false:true;
        this.isBumb=N; //是否是炸弹 true是,false不是
        this.markNum=0;//记录周围炸弹的数量，如果没有就默认是0
        this.X=0;//第几列
        this.Y=0;//第几行
        this.Z=0;//总共排第几个
        this.blank=true;//是否是空的
        this.beenCleaned=false;//是否class被清除
        this.beenFlag=false;//是否被标记旗子
        this.beenQuestion=false;//是否被标记问号
        // this.isWord=false;
    };
    /********************************给jquery扩展函数****************************************/
    $.fn.extend({
        cellBeside:function(y,x,z){
            $('#app>li:nth-child('+(z+1)+')').on('click',function(){
                //if(!cells[y][x].isWord){
                //    $('#app>li:nth-child('+(z+1)+')'). removeClass();
                //}else{
                checkBlank(cells[y][x]);
                //}
            })
        }
    });

    for(var i= 0;i<bumbNum;i++){
        var cellSon=new Cell();
        cell.push(cellSon);
        cellSon.Z=i;
        /**********设置cells这个二维数组来紧跟每个DOM模块**********/
        cellSon.Y=Math.floor(cellSon.Z/20);
        cellSon.X=cellSon.Z-Math.floor(cellSon.Z/20)*20;
        if(cellSon.X==0){cells[cellSon.Y]=[];}
        cells[cellSon.Y][cellSon.X]=cellSon;
        /*******************************************************/
        $('#app').append('<li class="hidden"></li>');
        if(cellSon.isBumb){
            cellSon.blank=false;
            $('#app>li:last-child').on('click',haveBumb);
        }else{
            $('#app>li:last-child').on('click',donthaveBumb.bind(this,cellSon.Y,cellSon.X,cellSon.Z));
        }

    };
    /***************************需要调用的函数*********************************/
    function haveBumb(){
        $(this).removeClass().addClass('wrong');
        isGameOver();
        console.log('有炸弹',this);
    };
    function donthaveBumb(y,x,z){
        console.log('没炸弹');
        $('#app>li:nth-child('+(z+1)+')').removeClass();
        cells[y][x].beenCleaned=true;
        $('#app>li:nth-child('+(z+1)+')').children().css({'display':'block'})
    };
    function aroundCell(e,callback){
        for(var a=-1;a<2;a++){
            for(var b=-1;b<2;b++){
                if(a!==0||b!==0){
                    if(e.Y+a>=0 && e.X+b>=0 && e.Y+a<=19 && e.X+b<=19){
                        callback(e,e.Y+a,e.X+b, e.Z+1);
                    }
                }
            }
        }
    };
    function checkAround(e){
        aroundCell(e,function(e,y,x,z){
            if(cells[y,x].isBumb)
                return false;
            return true;
        })
    }
    function crossAroundCell(e,callback){
        for(var a=-1;a<2;a++){
            for(var b=-1;b<2;b++){
                if(a!==0||b!==0){
                    if(e.Y+a>=0 && e.X+b>=0 && e.Y+a<=19 && e.X+b<=19 && (Math.abs(a)+Math.abs(b)!==2)){
                        callback(e,e.Y+a,e.X+b, e.Z+1);
                    }
                }
            }
        }
    };
    function checkBlank(e){
        crossAroundCell(e,function(e,y,x,z){
            if(cells[y][x].blank && !cells[y][x].beenCleaned){
                $('#app>li:nth-child('+(y*20+x+1)+')').removeClass();
                cells[y][x].beenCleaned=true;
                checkBlank(cells[y][x]);
            }else if(!cells[y][x].blank && !cells[y][x].beenCleaned && !cells[y][x].isBumb){
                $('#app>li:nth-child('+(y*20+x+1)+')').removeClass();
                $('#app>li:nth-child('+(y*20+x+1)+')').children().css({'display':'block'})
                cells[y][x].beenCleaned=true;
            }
        })
    };
    function isGameOver(){
        $(cell).each(function(i,e){
            if(e.isBumb){
                $('#app>li:nth-child('+(e.Z+1)+')').removeClass().addClass('wrong');
            }
        });
        setTimeout(function(){
            alert('Game Over');
        });
    };
    /*******************************************************************/
    $(cell).each(function(i,e){
        if(e.isBumb){
            aroundCell(e,function(e,y,x){
                //if(!cells[y][x].isWord)
                //cells[y][x].isWord=true;
                cells[y][x].blank=false;
                cells[y][x].markNum+=1;
            })
        }
    });
    $(cell).each(function(i,e){
        if(e.markNum!==0){
            //if(!e.isWord) e.isWord=true;
            aroundCell(e,function(e,x,y,z){
                if($('#app>li:nth-child('+z+')').children().length==0)
                    $('#app>li:nth-child('+z+')').append('<span style="display:none;">'+e.markNum+'</span>');
            })
        }else{
            $('#app>li:nth-child('+ e.Z+1 +')').cellBeside(e.Y, e.X, e.Z);
        }
    });
    console.log(cells);
};
window.onload=start();