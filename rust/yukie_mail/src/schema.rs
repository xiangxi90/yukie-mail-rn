// @generated automatically by Diesel CLI.

diesel::table! {
    mail_calendar (id) {
        id -> Text,
        start_time -> Nullable<BigInt>,
        end_time -> Nullable<BigInt>,
        title -> Nullable<Text>,
        context -> Nullable<Text>,
        message_id -> Nullable<Text>,
    }
}

diesel::table! {
    mail_cmd_status (task_id) {
        task_id -> Integer,
        create_time -> Nullable<BigInt>,
        cmd -> Nullable<Text>,
        task_time -> Nullable<BigInt>,
        status -> Nullable<Integer>,
        message_id -> Nullable<Text>,
        add_labels -> Nullable<Text>,
        remove_labels -> Nullable<Text>,
        deleted -> Nullable<Bool>,
    }
}

diesel::table! {
    mail_label (id) {
        id -> Text,
        name -> Text,
        is_system -> Bool,
        updated_timestamp_ms -> BigInt,
        unread_count -> BigInt,
        total_count -> BigInt,
        raw_id -> Nullable<Text>,
    }
}

diesel::table! {
    mail_label_message (label_id, message_id) {
        label_id -> Text,
        message_id -> Text,
    }
}

diesel::table! {
    mail_message_body (id) {
        id -> Text,
        attachment_json -> Text,
        body -> Binary,
    }
}

diesel::table! {
    mail_message_file (message_id, token) {
        message_id -> Text,
        token -> Text,
        visit_time -> BigInt,
        file_path -> Text,
        has_sync -> Bool,
    }
}

diesel::table! {
    mail_message_info (id) {
        id -> Text,
        reply_to_id -> Text,
        subject -> Text,
        from -> Text,
        to -> Text,
        cc -> Text,
        bcc -> Text,
        json -> Text,
        created_time -> BigInt,
        summary -> Text,
        flaged -> Nullable<Bool>,
    }
}

diesel::table! {
    server_account (server_type, account) {
        server_type -> Nullable<Text>,
        account -> Nullable<Text>,
        password -> Nullable<Text>,
        protocol -> Nullable<Text>,
        address -> Nullable<Text>,
        port -> Nullable<Integer>,
        name -> Nullable<Text>,
    }
}

diesel::joinable!(mail_calendar -> mail_message_info (message_id));
diesel::joinable!(mail_label_message -> mail_label (label_id));
diesel::joinable!(mail_label_message -> mail_message_info (message_id));
diesel::joinable!(mail_message_body -> mail_message_info (id));
diesel::joinable!(mail_message_file -> mail_message_info (message_id));

diesel::allow_tables_to_appear_in_same_query!(
    mail_calendar,
    mail_cmd_status,
    mail_label,
    mail_label_message,
    mail_message_body,
    mail_message_file,
    mail_message_info,
    server_account,
);
