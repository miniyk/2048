//index.js
//获取应用实例

var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    score: 0,
    maxscore: 0,
    startx: 0,
    starty: 0,
    endx: 0,
    endy: 0,
    direction: '',
    numbers: [[2, 0, 0, 0], [0, 2, 0, 0], [0, 0, 0, 0], [0,0, 0, 0]],
    isOver: false,
    animationData: {},
    isAddScore:true,
    addScore:0
  },
  onShow:function(){
  },
  newGame: function () {
    var arr = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    var prevRand=0;
    for (var i = 0; i < 2; i++) {
      var rand=Math.floor(Math.random() * 16);
      if(rand==prevRand){
        rand=Math.floor(Math.random() * 16);
        prevRand=rand;
      }
      var posx=Math.floor(rand/4);
      var posy=Math.floor(rand%4);
      var ranNum=Math.random() < 0.8 ? 2 : 4;
      arr[posx][posy]=ranNum;
    }
    this.setData({numbers: arr,score:0})
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })

    })
    var maxscore = wx.getStorageSync('2048maxscore')
    if(!maxscore) maxscore = 0
    this.setData({
      maxscore:maxscore
      })
  },
  onPullDownRefresh: function () {
    console.log(3);
  },
  tapStart: function (event) {
    this.setData({
      startx: event.touches[0].pageX,
      starty: event.touches[0].pageY
    })
  },
  tapMove: function (event) {
    this.setData({
      endx: event.touches[0].pageX,
      endy: event.touches[0].pageY
    })
  },
  tapEnd: function (event) {
    var heng = (this.data.endx) ? (this.data.endx - this.data.startx) : 0;
    var shu = (this.data.endy) ? (this.data.endy - this.data.starty) : 0;

    if (Math.abs(heng) > 5 || Math.abs(shu) > 5) {
      var direction = (Math.abs(heng) > Math.abs(shu)) ? this.computeDir(1, heng) : this.computeDir(0, shu);
      this.setData({
        startx: 0,
        starty: 0,
        endx: 0,
        endy: 0
      })
      this.mergeAll(direction) && this.randInsert();
    }
    
  },
  randInsert: function () {
    var arr = this.data.numbers
    //随机2或4
    var num = Math.random() < 0.8 ? 2 : 4
    //计算随机位置
    var zeros = [];
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        if (arr[i][j] == 0) {
          zeros.push([i, j]);
        }
      }
    }
    var position = zeros[Math.floor(Math.random() * zeros.length)];
    arr[position[0]][position[1]] = num
    this.setData({
      numbers: arr
    })
    this.checkGame();
  },
  computeDir: function (heng, num) {
    if (heng) return (num > 0) ? 'right' : 'left';
    return (num > 0) ? 'bottom' : 'top';
  },
  mergeAll: function (dir) {
    this.checkGame();
    switch (dir) {
      case 'left':
        return this.mergeleft();
        break;
      case 'right':
        return this.mergeright();
        break;
      case 'top':
        return this.mergetop();
        break;
      case 'bottom':
        return this.mergebottom();
        break;
      default:
    }
  },
  mergeleft: function () {
    var arr = this.data.numbers;
    var len = arr.length;
    var change = false;
    for (var i = 0; i < len; i++) {
      for (var j = 0; j < len - 1; j++) {
        if (arr[i][j] == 0) {
          continue;
        }
        for (var k = 1; k < len - j; k++) {
          if (arr[i][j] != 0 && arr[i][j + k] != 0) {
            if (arr[i][j] != arr[i][j + k])
              break;
            arr[i][j] = arr[i][j] * 2;
            arr[i][j + k] = 0;
            change = true;
            this.addScore(arr[j][i]);
          }
        }
      }
      for (var j = 0; j < 3; j++) {
        if (arr[i][j] == 0) {
          for (var k = 1; k < 4 - j; k++) {
            if (arr[i][j + k] != 0) {
              arr[i][j] = arr[i][j + k];
              arr[i][j + k] = 0;
              change = true;
              break;
            }
          }
        }
      }
    }
    this.setData({ numbers: arr })
    this.storeScore()
    return change
  },
  mergeright: function () {
    var change = false
    var arr = this.data.numbers;
    for (var i = 0; i < 4; i++) {
      //merge first
      for (var j = 3; j > 0; j--) {
        if (arr[i][j] == 0) continue;
        for (var k = 1; k <= j; k++) {
          if (arr[i][j] != 0 && arr[i][j - k] != 0) {
            if (arr[i][j] != arr[i][j - k]) break;
            arr[i][j] = arr[i][j] * 2;
            arr[i][j - k] = 0;
            change = true;
            this.addScore(arr[j][i]);
            break;
          }
        }
      }
      //movemove
      for (var j = 3; j > 0; j--) {
        if (arr[i][j] == 0) {
          for (var k = 1; k <= j; k++) {
            if (arr[i][j - k] != 0) {
              arr[i][j] = arr[i][j - k];
              arr[i][j - k] = 0;
              change = true;
              break;
            }
          }
        }
      }
    }
    this.setData({
      numbers: arr
    })
    this.storeScore()
    return change
  },
  mergebottom: function () {
    var change = false
    var arr = this.data.numbers;

    for (var i = 0; i < 4; i++) {
      //merge first
      for (var j = 3; j > 0; j--) {
        if (arr[j][i] == 0) continue;
        for (var k = 1; k <= j; k++) {
          if (arr[j][i] != 0 && arr[j - k][i] != 0) {
            if (arr[j][i] != arr[j - k][i]) break;
            arr[j][i] = arr[j][i] * 2;
            arr[j - k][i] = 0;
            change = true
            this.addScore(arr[j][i]);
            break;
          }
        }
      }
      //movemove
      for (var j = 3; j > 0; j--) {
        if (arr[j][i] == 0) {
          for (var k = 1; k <= j; k++) {
            if (arr[j - k][i] != 0) {
              arr[j][i] = arr[j - k][i];
              arr[j - k][i] = 0;
              change = true
              break;
            }
          }
        }
      }
    }
    this.setData({
      numbers: arr
    })
    this.storeScore()
    return change
  },
  //上滑
  mergetop: function () {
    var change = false
    var arr = this.data.numbers;

    for (var i = 0; i < 4; i++) {
      //merge first
      for (var j = 0; j < 3; j++) {
        if (arr[j][i] == 0) continue;
        for (var k = 1; k < 4 - j; k++) {
          if (arr[j][i] != 0 && arr[j + k][i] != 0) {
            if (arr[j][i] != arr[j + k][i]) break;
            arr[j][i] = arr[j][i] * 2;
            arr[j + k][i] = 0;
            change = true
            this.addScore(arr[j][i]);
            break;
          }
        }
      }
      //movemove
      for (var j = 0; j < 3; j++) {
        if (arr[j][i] == 0) {
          for (var k = 1; k < 4 - j; k++) {
            if (arr[j + k][i] != 0) {
              arr[j][i] = arr[j + k][i];
              arr[j + k][i] = 0;
              change = true
              break;
            }
          }
        }
      }
    }
    this.setData({
      numbers: arr
    })
    this.storeScore()
    return change
  },
  checkGame: function () {
    var arr = this.data.numbers
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        if (arr[i][j] == 0) return;
      }
    }
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        if (arr[i][j] == arr[i + 1][j] || arr[i][j] == arr[i][j + 1]) return;
      }
    }

    for (var j = 0; j < 3; j++) {
      if (arr[3][j] == arr[3][j + 1]) return;
      if (arr[j][3] == arr[j + 1][3]) return;
    }
    this.setData({
      isOver: true,
    })
  },
  storeScore: function () {
    if (this.data.maxscore < this.data.score) {
      this.setData({
        maxscore: this.data.score
      })
      wx.setStorageSync('2048maxscore', this.data.maxscore)
    }
  },
  addScore:function(num){
    var that=this;
    if(!this.animation){
      var animation = wx.createAnimation({
              duration: 1000,
              timingFunction: 'ease'
            })
        this.animation=animation;
    }
    
    this.setData({isAddScore:false});
    this.setData({ isAddScore: false });
    this.animation.top(-50).opacity(0).step();
    this.setData({
      score: this.data.score + num,
      addScore: num,
      animationScoreData: this.animation.export()
    });

    // 还原到动画最初的状态
    setTimeout(function () {
      that.setData({isAddScore:true});
          that.animation.top(40).opacity(1).step();
          that.setData({
              animationScoreData: that.animation.export()
          });
    }, 1000);
  }
})
