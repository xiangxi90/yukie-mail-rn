-- Your SQL goes here
CREATE TABLE mail_label_message (
    label_id TEXT NOT NULL,
    message_id TEXT NOT NULL,
    thread_id TEXT NOT NULL,
    sort_timestamp BIGINT NOT NULL,
    PRIMARY KEY(label_id, message_id, thread_id)
);