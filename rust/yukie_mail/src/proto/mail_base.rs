#[derive(serde::Serialize, serde::Deserialize)]
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct MailAddress {
    #[prost(string, tag = "1")]
    pub name: ::prost::alloc::string::String,
    #[prost(string, tag = "2")]
    pub address: ::prost::alloc::string::String,
}
#[derive(serde::Serialize, serde::Deserialize)]
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Account {
    #[prost(message, optional, tag = "1")]
    pub mail_address: ::core::option::Option<MailAddress>,
    #[prost(enumeration = "AccountStatus", tag = "2")]
    pub status: i32,
    #[prost(string, tag = "3")]
    pub smtp_server: ::prost::alloc::string::String,
    #[prost(string, tag = "4")]
    pub smtp_account: ::prost::alloc::string::String,
    #[prost(int32, tag = "5")]
    pub smtp_port: i32,
    #[prost(string, tag = "6")]
    pub smtp_password: ::prost::alloc::string::String,
    #[prost(enumeration = "MailProtocal", tag = "7")]
    pub smtp_protocol: i32,
    #[prost(string, tag = "8")]
    pub imap_server: ::prost::alloc::string::String,
    #[prost(int32, tag = "9")]
    pub imap_port: i32,
    #[prost(string, tag = "10")]
    pub imap_account: ::prost::alloc::string::String,
    #[prost(string, tag = "11")]
    pub imap_password: ::prost::alloc::string::String,
    #[prost(enumeration = "MailProtocal", tag = "12")]
    pub imap_protocol: i32,
}
#[derive(serde::Serialize, serde::Deserialize)]
#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash, PartialOrd, Ord, ::prost::Enumeration)]
#[repr(i32)]
pub enum AccountStatus {
    Success = 0,
    Empty = 1,
    Expired = 2,
}
impl AccountStatus {
    /// String value of the enum field names used in the ProtoBuf definition.
    ///
    /// The values are not transformed in any way and thus are considered stable
    /// (if the ProtoBuf definition does not change) and safe for programmatic use.
    pub fn as_str_name(&self) -> &'static str {
        match self {
            AccountStatus::Success => "success",
            AccountStatus::Empty => "empty",
            AccountStatus::Expired => "expired",
        }
    }
    /// Creates an enum from field names used in the ProtoBuf definition.
    pub fn from_str_name(value: &str) -> ::core::option::Option<Self> {
        match value {
            "success" => Some(Self::Success),
            "empty" => Some(Self::Empty),
            "expired" => Some(Self::Expired),
            _ => None,
        }
    }
}
#[derive(serde::Serialize, serde::Deserialize)]
#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash, PartialOrd, Ord, ::prost::Enumeration)]
#[repr(i32)]
pub enum MailProtocal {
    None = 0,
    Starttls = 1,
    Tls = 2,
}
impl MailProtocal {
    /// String value of the enum field names used in the ProtoBuf definition.
    ///
    /// The values are not transformed in any way and thus are considered stable
    /// (if the ProtoBuf definition does not change) and safe for programmatic use.
    pub fn as_str_name(&self) -> &'static str {
        match self {
            MailProtocal::None => "none",
            MailProtocal::Starttls => "starttls",
            MailProtocal::Tls => "tls",
        }
    }
    /// Creates an enum from field names used in the ProtoBuf definition.
    pub fn from_str_name(value: &str) -> ::core::option::Option<Self> {
        match value {
            "none" => Some(Self::None),
            "starttls" => Some(Self::Starttls),
            "tls" => Some(Self::Tls),
            _ => None,
        }
    }
}
