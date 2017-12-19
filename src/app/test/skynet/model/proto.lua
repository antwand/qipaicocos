local sprotoparser = require "app.sproto.sprotoparser"

local proto = {}

proto.c2s = sprotoparser.parse [[
.package {
	type 0 : integer
	session 1 : integer
}

# -------------- MODEL -------------- #
.Player {
	uid 	0 : integer
	sex 	1 : integer
	name 	2 : string
	icon 	3 : string

	buyin 	4 : integer
	chipin	5 : integer
	seatid	6 : integer
	status  7 : integer

	chips   8 : integer # 口袋里的筹码
	profit  9 : integer
	win    10 : integer

	card_type 			11 : integer
	hand_cards  		12 : *string
	hightlight_cards 	13 : *string
	card_rank           14 : integer
}

.Pot {
	.Winner {
		uid 		0 : integer
		seatid 		1 : integer
		win_chips 	2 : integer
	}
	val 		0 : integer
	winner 		1 : *Winner
}

# -------------- 用户信息 -------------- #

login 100 {
	request {
		uid		0 : integer
		token 	1 : string
	}
	response {
		code 	0 : integer
		player 	1 : Player
		cmd     2 : string
		tids    3 : *integer #重连时返回房间信息
	}
}

logout 101 {

}

player_info 110 {
	request {
		uid 0 : integer
	}
	response {
		player 0 : Player
		cmd    1 : string
	}
}

# -------------- 打牌 -------------- #

# 进入牌桌
enter_table 200 {
	request {
		tid 0 : integer
	}
	response {
		code			0 : integer
		tid				1 : integer
		status  		2 : integer
		gap_sec 		3 : integer
		sb				4 : integer
		bb				5 : integer
		min_buyin		6 : integer
		max_buyin		7 : integer
		service_fee 	8 : integer
		duration		9 : integer
		start_time		10 : integer
		server_time		11 : integer
		delay_count 	12 : integer
		total_pot  		13 : integer
		pots			14 : *Pot
		dealer			15 : integer
		public_cards 	16 : *string
		players			17 : *Player
		ante			18 : integer
		seat_count		19 : integer
		create_uid	    20 : integer #房主
		cmd     		21 : string
		ask_buyin		22 : integer
		GID          	23 : string 
		start_flag      24 : boolean
	}
}

#开始游戏
start_game 201 {
	request {
		tid 0 : integer
	}
	response {
		code 0 : integer
		cmd  1 : string
	}
}

sit_down 202 {
	request {
		tid 		0 : integer
		seatid 		1 : integer
		buyin   	2 : integer
		auto_buyin 	3 : integer
	}
	response {
		code 0 : integer
		cmd  1 : string
	}
}

stand_up 203 {
	request {
		tid 		0 : integer 
		stand_type 	1 : integer # 1:立刻站起，2:这局结束后站起
	}
	response {
		code 0 : integer
		cmd  1 : string
	}
}

leave 204 {
	request {
		tid 		0 : integer
		leave_type 	1 : integer # 1:立刻离开,2:结束后离开
	}
	response {
		code 0 : integer
		cmd  1 : string
	}
}

action 205 {
	request {
		tid 		0 : integer
		action_type 1 : integer # 3:跟注,4:加注,5:下注,6:全下,7:看牌,8:弃牌
		chipin		2 : integer 
	}
	response {
		code 0 : integer
		cmd  1 : string
	}
}

show_hand_card 206 {
	request {
		tid 	0 : integer
		card    1 : string #手牌，可亮一张，也可亮两张
	}
	response {
		code 0 : integer
		cmd  1 : string
	}
}

buyin 207 {
	request {
		tid 	0 : integer
		buyin 	1 : integer
	}
	response {
		code 0 : integer
		cmd  1 : string
	}
}

statistics 208 {
	request {
		tid 	0 : integer
	}
	response {
		code 	0 : integer
		cmd  	1 : string
		players 2 : *Player #uid,name,icon,buyin,chipin,win
	}
}

last_record 209 {
	request {
		tid 0 : integer
	}
	response {
		code 		  0 : integer
		cmd  		  1 : string
		players 	  2 : *Player #uid,name,icon,buyin,chipin,win,status,hightlight_cards
		public_cards  3 : *string
		GID    		  4 : string
	}
}

]]

proto.s2c = sprotoparser.parse [[
.package {
	type 0 : integer
	session 1 : integer
}

.Player {
	uid 	0 : integer
	sex 	1 : integer
	name 	2 : string
	icon 	3 : string

	buyin 	4 : integer
	chipin	5 : integer
	seatid	6 : integer
	status  7 : integer

	chips   8 : integer # 口袋里的筹码
	profit  9 : integer
	win    10 : integer

	card_type 			11 : integer
	hand_cards  		12 : *string
	hightlight_cards 	13 : *string
	card_rank           14 : integer
}

.Pot {
	.Winner {
		uid 		0 : integer
		seatid 		1 : integer
		win     	2 : integer
	}
	val 		0 : integer
	winner 		1 : *Winner
}

#退回的筹码
.ReturnChip {
	uid 	0 : integer
	seatid 	1 : integer
	chip 	2 : integer
}

.TableInfo {
	duration 		0 : integer
	sb 				1 : integer
	bb 				2 : integer
	hand_count 		3 : integer
	total_buyin 	4 : integer
	insurance_pot 	5 : integer
}

noti_game_started 200 {
	request {
		tid 	0 : integer
		dealer 	1 : integer
		sb_idx 	2 :integer
		bb_idx 	3 : integer
		players 4 : *Player # uid,seatid,buyin
		cmd 	5 : string
		GID     6 : string
	}
}


noti_player_enter 201 {
	request {
		tid 	0 : integer
		player 	1 : Player
		cmd 	2 : string
	}
}

noti_player_leave 202 {
	request {
		tid 		0 : integer
		player 		1 : Player
		leave_type 	2 : integer
		cmd 		3 : string
	}
}

noti_player_sit_down 203 {
	request {
		tid 	0 : integer
		player 	1 : Player
		cmd 	2 : string
	}
}

noti_player_stand_up 204 {
	request {
		tid 		0 : integer
		player 		1 : Player
		stand_type 	2 : integer # 1:立刻站起，2:这局结束后站起
		cmd 		3 : string
	}
}

noti_player_game_can_start 205 {
	request {
		tid	0 : integer
		cmd 1 : string
	}
}

noti_deal_hand_cards 206 {
	request {
		tid   0 : integer
		cards 1 : *string
		cmd   2 : string
	}
}

noti_player_action 207 {
	request {
		tid   		0 : integer
		player 		1 : Player  # uid,seatid,buyin,chipin
		action_type 2 : integer
		cmd 		3 : string
		total_pot   4 : integer
	}
}

noti_next_player_action 208 {
	request {
		tid			0 : integer
		player 		1 : Player # uid,seatid,buyin,chipin
		need_call 	2 : integer
		min_raise 	3 : integer
		max_raise 	4 : integer
		server_time 5 : integer
		cmd 		6 : string
	}
}

noti_deal_flop_cards 209 {
	request {
		tid		0 : integer
		cards 	1 : *string
		cmd 	2 : string
	}
}

noti_deal_turn_card 210 {
	request {
		tid 	0 : integer
		card 	1 : string
		cmd 	2 : string
	}
}

noti_deal_river_card 211 {
	request {
		tid  	0 : integer
		card 	1 : string
		cmd 	2 : string
	}
}


noti_round_over 212 {
	request {
		tid 		0 : integer
		round 		1 : integer #INIT_ROUND:1,PREFLOP:2,FLOP:3,TURN:4,RIVER:5,SETTLE:6,OVER:7
		total_pot 	2 : integer
		pots 		3 : *Pot 
		cmd 		4 : string
		returns     5 : *ReturnChip
	}
}

noti_game_over 213 {
	request {
		result 		0 : integer #1:比牌赢;0:弃牌赢
		players 	1 : *Player #uid,seatid,buyin,card_rank,card_type,hand_cards,hightlight_cards
		total_pot 	2 : integer
		pots 		3 : *Pot
		tid      	4 : integer
		cmd         5 : string
	}
}

noti_show_hand_card 214 {
	request {
		cards 	0 : *string #手牌，可亮一张，也可亮两张
		cmd 	1 : string
		player  2 : Player
		tid 	3 : integer
	}
}

noti_buyin 215 {
	request {
		tid 	0 : integer
		player  1 : Player
		cmd     2 : string
	}
}

noti_table_close 216 {
	request {
		tid 	0 : integer
		cmd 	1 : string
		players 2 : *Player #uid,name,icon,buyin,chipin,win
		info 	3 : TableInfo #牌局信息
	}
}

noti_error 9999 {
	request {
		code 	0 : integer
		msg 	1 : string
		cmd 	2 : string
	}
}

]]

proto.msg = {
	[200] = "成功",
	
	[201] = "参数错误",
	[202] = "非法操作",
	[203] = "cmd未找到",
	[204] = "未登录",
	[205] = "数据库操作失败",
	
	[301] = "牌局已创建",
	[302] = "牌局不存在",
	[303] = "玩家已上桌",
	[304] = "玩家不在牌桌上",
	[304] = "座位已有人",
	[305] = "已经在座位上了",
	[306] = "筹码不足",
	[307] = "不能小于最小带入",
	[308] = "玩家不在座位上",

	[400] = "至少一个bb",
	[401] = "下注小于上次下注",
	[402] = "不能RAISE",
	[403] = "不能CHECK",

}

return proto
