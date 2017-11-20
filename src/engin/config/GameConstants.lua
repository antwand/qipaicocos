--[[
/**
 * GameConstants.js
 * GameConstants 常量
 *
 * 游戏的相关静态数据
 *
 * @author antwand@sina.com
 * @type {{}}
 */
 ]]
local GameConstants= {};







--//指定父类的显示层
GameConstants.BACKGROUND_LAYER="backgroundLayer";--//返回背景图
GameConstants.DEBUG_LAYER="debugLayer";--//debug层

GameConstants.FLOORS_LAYER="floorsLayer";--//地板层
GameConstants.FLY_LAYER="flysLayer";--//建筑的上一飞行层
GameConstants.BATCH_LAYER="batchLayer";--//中间建筑层

GameConstants.TOUCH_LAYER="touchLayer";--//触摸层
GameConstants.UI_LAYER="uiLayer";--//ui层
GameConstants.LOADING_LAYER="loadingLayer";-- //地图的loading层
GameConstants.TIP_LAYER="tipLayer";--//tips层





--//层级
GameConstants.DEFAULT_OBJECT_ZORDER  = 200--//默认物体的zorder
GameConstants.MAX_OBJECT_ZORDER      = 20000 --//最高物体的zorder












--//基础事件
GameConstants.EVENT_ENTERSCENE = "EVENT_ENTERSCENE";-- //进入场景事件 enterScene






cc.exports.GameConstants = GameConstants;