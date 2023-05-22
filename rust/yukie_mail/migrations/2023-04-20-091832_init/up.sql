-- Your SQL goes here
-- ----------------------------
-- Table structure for mail_calendar
-- ----------------------------
DROP TABLE IF EXISTS "mail_calendar";
CREATE TABLE "mail_calendar" (
    "id" text NOT NULL,
    "start_time" BIGINT,
    "end_time" BIGINT,
    "title" TEXT,
    "context" TEXT,
    "message_id" text,
    PRIMARY KEY ("id"),
    CONSTRAINT "message_id" FOREIGN KEY ("message_id") REFERENCES "mail_message_info" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);
-- ----------------------------
-- Table structure for mail_cmd_status
-- ----------------------------
DROP TABLE IF EXISTS "mail_cmd_status";
CREATE TABLE "mail_cmd_status" (
    "task_id" INTEGER NOT NULL,
    "create_time" BIGINT,
    "cmd" TEXT,
    "task_time" BIGINT,
    "status" integer,
    "message_id" text,
    "add_labels" TEXT,
    "remove_labels" TEXT,
    "deleted" BOOLEAN,
    PRIMARY KEY ("task_id")
);
-- ----------------------------
-- Table structure for mail_label
-- ----------------------------
DROP TABLE IF EXISTS "mail_label";
CREATE TABLE "mail_label" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_system" BOOLEAN NOT NULL DEFAULT 0,
    "updated_timestamp_ms" BigInt NOT NULL DEFAULT 0,
    "unread_count" BigInt NOT NULL DEFAULT 0,
    "total_count" BigInt NOT NULL DEFAULT 1,
    "raw_id" TEXT,
    PRIMARY KEY ("id")
);
-- ----------------------------
-- Table structure for mail_label_message
-- ----------------------------
DROP TABLE IF EXISTS "mail_label_message";
CREATE TABLE "mail_label_message" (
    "label_id" TEXT NOT NULL,
    "message_id" TEXT NOT NULL,
    PRIMARY KEY ("label_id", "message_id"),
    CONSTRAINT "label_id" FOREIGN KEY ("label_id") REFERENCES "mail_label" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "message_id" FOREIGN KEY ("message_id") REFERENCES "mail_message_info" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);
-- ----------------------------
-- Table structure for mail_message_body
-- ----------------------------
DROP TABLE IF EXISTS "mail_message_body";
CREATE TABLE "mail_message_body" (
    "id" TEXT NOT NULL,
    "attachment_json" TEXT NOT NULL,
    "body" BLOB NOT NULL,
    PRIMARY KEY ("id"),
    CONSTRAINT "message_id" FOREIGN KEY ("id") REFERENCES "mail_message_info" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);
-- ----------------------------
-- Table structure for mail_message_file
-- ----------------------------
DROP TABLE IF EXISTS "mail_message_file";
CREATE TABLE "mail_message_file" (
    "message_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "visit_time" BIGINT NOT NULL DEFAULT 0,
    "file_path" TEXT NOT NULL,
    "has_sync" BOOLEAN NOT NULL DEFAULT true,
    PRIMARY KEY ("message_id", "token"),
    CONSTRAINT "message_id" FOREIGN KEY ("message_id") REFERENCES "mail_message_info" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);
-- ----------------------------
-- Table structure for mail_message_info
-- ----------------------------
DROP TABLE IF EXISTS "mail_message_info";
CREATE TABLE "mail_message_info" (
    "id" TEXT NOT NULL,
    "reply_to_id" TEXT NOT NULL DEFAULT "",
    "subject" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL DEFAULT "",
    "cc" TEXT NOT NULL DEFAULT "",
    "bcc" TEXT NOT NULL DEFAULT "",
    "json" TEXT NOT NULL DEFAULT "",
    "created_time" BIGINT NOT NULL DEFAULT 0,
    "summary" TEXT NOT NULL DEFAULT "",
    "flaged" boolean,
    PRIMARY KEY ("id")
);
-- ----------------------------
-- Table structure for server_account
-- ----------------------------
DROP TABLE IF EXISTS "server_account";
CREATE TABLE "server_account" (
    "server_type" TEXT,
    "account" TEXT,
    "password" TEXT,
    "protocol" TEXT,
    "address" TEXT,
    "port" integer,
    "name" TEXT,
    PRIMARY KEY ("account", "server_type")
);