/*
Navicat MySQL Data Transfer

Source Server         : mysql
Source Server Version : 80011
Source Host           : localhost:3306
Source Database       : my_chat

Target Server Type    : MYSQL
Target Server Version : 80011
File Encoding         : 65001

Date: 2019-01-18 17:13:29
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for member
-- ----------------------------
DROP TABLE IF EXISTS `member`;
CREATE TABLE `member` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `roomId` int(11) NOT NULL,
  `uid` varchar(64) NOT NULL,
  `nickName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '群聊昵称',
  `createTime` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `leaveTime` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `status` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`,`roomId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for room
-- ----------------------------
DROP TABLE IF EXISTS `room`;
CREATE TABLE `room` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ownerUid` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `type` int(2) DEFAULT '1',
  `name` varchar(255) NOT NULL,
  `createTime` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  `lastSendTime` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `total` int(4) NOT NULL DEFAULT '1000',
  `member` int(4) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `postscript` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`,`ownerUid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for session
-- ----------------------------
DROP TABLE IF EXISTS `session`;
CREATE TABLE `session` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` varchar(64) NOT NULL,
  `accessToken` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT 'token',
  `socketId` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `expireTime` int(11) NOT NULL COMMENT '过期时间',
  `sessionType` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'api' COMMENT 'session类型',
  `status` tinyint(2) DEFAULT NULL,
  PRIMARY KEY (`id`,`uid`),
  UNIQUE KEY `user_id_UNIQUE` (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='session';

-- ----------------------------
-- Table structure for single
-- ----------------------------
DROP TABLE IF EXISTS `single`;
CREATE TABLE `single` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ownerUid` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `friendUid` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `createTime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lastSendTime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`,`ownerUid`,`friendUid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `uid` varchar(64) NOT NULL,
  `password` varchar(64) NOT NULL,
  `registerTime` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `loginTime` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `loginIp` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `status` tinyint(2) NOT NULL,
  PRIMARY KEY (`id`,`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for userInfo
-- ----------------------------
DROP TABLE IF EXISTS `userInfo`;
CREATE TABLE `userInfo` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `uid` varchar(64) NOT NULL COMMENT 'userId',
  `nickName` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '昵称',
  `sex` tinyint(1) DEFAULT '0',
  `phoneNumber` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `email` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `avatar` varchar(128) DEFAULT NULL COMMENT '头像',
  `signature` tinytext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT '个性签名',
  `birthday` date DEFAULT NULL,
  PRIMARY KEY (`id`,`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
