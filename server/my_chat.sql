/*
Navicat MySQL Data Transfer

Source Server         : local-qing
Source Server Version : 80011
Source Host           : localhost:3306
Source Database       : my_chat

Target Server Type    : MYSQL
Target Server Version : 80011
File Encoding         : 65001

Date: 2020-03-10 18:18:22
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for friend
-- ----------------------------
DROP TABLE IF EXISTS `friend`;
CREATE TABLE `friend` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `ownerUid` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `friendUid` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `nickName` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT '' COMMENT '好友备注名字',
  `notReadCount` tinyint(3) unsigned DEFAULT '0',
  `createTime` datetime DEFAULT CURRENT_TIMESTAMP,
  `lastSendTime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`,`ownerUid`,`friendUid`),
  UNIQUE KEY `owner_uid` (`ownerUid`,`friendUid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Table structure for history
-- ----------------------------
DROP TABLE IF EXISTS `history`;
CREATE TABLE `history` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `sendUid` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `reciveUid` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `content` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`,`sendUid`,`reciveUid`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Table structure for member
-- ----------------------------
DROP TABLE IF EXISTS `member`;
CREATE TABLE `member` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `roomId` int(11) unsigned NOT NULL,
  `uid` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `notReadCount` tinyint(3) unsigned DEFAULT '0',
  `nickName` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT '' COMMENT '群成员在群里的昵称',
  `createTime` datetime DEFAULT CURRENT_TIMESTAMP,
  `leaveTime` datetime DEFAULT NULL,
  `status` tinyint(1) unsigned DEFAULT '1',
  PRIMARY KEY (`id`,`roomId`),
  UNIQUE KEY `unique field` (`roomId`,`uid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Table structure for room
-- ----------------------------
DROP TABLE IF EXISTS `room`;
CREATE TABLE `room` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `ownerUid` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '创建人id',
  `roomNo` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '房间号码(min:6,max:12)',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `total` int(4) unsigned NOT NULL DEFAULT '1000' COMMENT '聊天室总数',
  `memberCount` int(4) unsigned DEFAULT '0' COMMENT '当前有多少人',
  `logo` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT 'logo',
  `postscript` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT '' COMMENT '描述',
  `type` int(2) unsigned DEFAULT '1' COMMENT '房间类型（待用）',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lastSendTime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`,`ownerUid`),
  UNIQUE KEY `No` (`roomNo`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Table structure for room_history
-- ----------------------------
DROP TABLE IF EXISTS `room_history`;
CREATE TABLE `room_history` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `sendUid` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `roomId` int(11) unsigned NOT NULL,
  `content` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` tinyint(1) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Table structure for session
-- ----------------------------
DROP TABLE IF EXISTS `session`;
CREATE TABLE `session` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `uid` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `accessToken` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT 'token',
  `expireTime` datetime DEFAULT NULL COMMENT '过期时间',
  `sessionType` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'api' COMMENT 'session类型',
  `status` tinyint(1) unsigned DEFAULT '0' COMMENT 'session过期状态',
  PRIMARY KEY (`id`,`uid`),
  UNIQUE KEY `user_id_UNIQUE` (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='session';

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `uid` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'uid',
  `password` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `account` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `nickName` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `onlineStatus` tinyint(1) unsigned DEFAULT '0' COMMENT '在线状态 0：离线，1：在线，后面等待需求',
  `phoneNumber` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `email` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `sex` tinyint(1) unsigned DEFAULT '0',
  `avatar` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `signature` tinytext CHARACTER SET utf8 COLLATE utf8_general_ci COMMENT '个性签名',
  `registerTime` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'CURRENT_TIMESTAMP',
  `loginTime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '登陆时间',
  `loginIp` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `status` tinyint(1) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`,`uid`),
  UNIQUE KEY `uid` (`uid`) USING BTREE,
  UNIQUE KEY `account` (`account`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
DROP TRIGGER IF EXISTS `single_not_read_and_last_send_time`;
DELIMITER ;;
CREATE TRIGGER `single_not_read_and_last_send_time` AFTER INSERT ON `history` FOR EACH ROW BEGIN
	UPDATE friend SET  lastSendTime=CURRENT_TIMESTAMP WHERE ownerUid=new.reciveUid AND friendUid=new.sendUid;
	UPDATE friend SET notReadCount=notReadCount+1 WHERE ownerUid=new.reciveUid AND friendUid=new.sendUid;
END
;;
DELIMITER ;
DROP TRIGGER IF EXISTS `member_add`;
DELIMITER ;;
CREATE TRIGGER `member_add` AFTER INSERT ON `member` FOR EACH ROW BEGIN
	UPDATE room SET memberCount=memberCount+1 WHERE id=new.roomId;
END
;;
DELIMITER ;
DROP TRIGGER IF EXISTS `member_reduce`;
DELIMITER ;;
CREATE TRIGGER `member_reduce` AFTER DELETE ON `member` FOR EACH ROW BEGIN
	UPDATE room SET memberCount=memberCount-1 WHERE id=old.roomId;
END
;;
DELIMITER ;
DROP TRIGGER IF EXISTS `room_not_read`;
DELIMITER ;;
CREATE TRIGGER `room_not_read` AFTER INSERT ON `room_history` FOR EACH ROW BEGIN
	UPDATE member SET notReadCount=notReadCount+1 WHERE roomId=new.roomId AND uid<>new.sendUid;
END
;;
DELIMITER ;
DROP TRIGGER IF EXISTS `insert_session`;
DELIMITER ;;
CREATE TRIGGER `insert_session` AFTER INSERT ON `user` FOR EACH ROW BEGIN
INSERT INTO session (uid) VALUES (new.uid);
END
;;
DELIMITER ;
