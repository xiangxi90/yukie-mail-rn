use crate::db::{account::get_mail_account_from_db, account::ServerType};
use crate::proto::command;
use anyhow::{Error, Result};
use lettre::{
    message::header::ContentType, message::Mailbox, transport::smtp::authentication::Credentials,
    AsyncSmtpTransport, AsyncTransport, Message, Tokio1Executor,
};
use log::*;

pub async fn send_mail(mail_request: command::SendMailRequest) -> Result<()> {
    // tracing_subscriber::fmt::init();
    let account = get_mail_account_from_db(ServerType::Smtp)?;
    debug!("{:#?}", account);
    let from_mailaddress = mail_request.from.unwrap_or_default().address;

    let from_mailbox =
        Mailbox::try_from((account.name.unwrap_or("None".to_owned()), from_mailaddress))?;

    let mut email_builder = Message::builder()
        .from(from_mailbox)
        // .reply_to("Yuin <yuin@domain.tld>".parse().unwrap())
        .subject(mail_request.subject)
        .header(ContentType::TEXT_HTML);

    for t in mail_request.to.iter() {
        email_builder = email_builder.to(Mailbox::try_from((&t.name, &t.address)).unwrap());
    }

    for c in mail_request.cc.iter() {
        email_builder = email_builder.cc(Mailbox::try_from((&c.name, &c.address)).unwrap());
    }

    for bc in mail_request.bcc.iter() {
        email_builder = email_builder.bcc(Mailbox::try_from((&bc.name, &bc.address)).unwrap());
    }

    let email = email_builder.body(mail_request.body).unwrap();
    debug!("{:#?}\n{:#?}", email.headers(), email.envelope());

    // 判断是否存库退出
    if mail_request.deliver_time != 0 {
        // insert_smq_into_datdbase();
        debug!("[Moc] mail save in database");
        return Ok(());
    }

    // 验证信息
    let creds = Credentials::new(
        account.account.unwrap_or_default(),
        account.password.unwrap_or_default(),
    );

    let mailer = match account.protocol.unwrap_or_default().as_str() {
        "None" => AsyncSmtpTransport::<Tokio1Executor>::unencrypted_localhost(),
        "tls" => AsyncSmtpTransport::<Tokio1Executor>::relay(&account.address.unwrap_or_default())
            .unwrap()
            .credentials(creds)
            .port(account.port.unwrap_or_default().try_into().unwrap())
            .build(),
        "starttls" => AsyncSmtpTransport::<Tokio1Executor>::starttls_relay(
            &account.address.unwrap_or_default(),
        )
        .unwrap()
        .credentials(creds)
        .port(account.port.unwrap_or_default().try_into().unwrap())
        .build(),
        _ => return Err(Error::msg("Unexpected mail protocal code.")),
    };

    // Send the email
    match mailer.send(email).await {
        Ok(_) => {
            debug!("Email sent successfully!");
            return Ok(());
        }
        Err(e) => {
            // panic!("Could not send email: {e:?}")
            return Err(Error::new(e));
        }
    }
}

// pub fn get_account_from_db() -> Result<Account> {
//     let mut account = Account::default();
//     let mail_adress = MailAddress {
//         name: String::from("Test Sender"),
//         address: String::from("kuzehibiki@126.com"),
//     };
//     account.mail_address = Some(mail_adress);
//     account.smtp_account = String::from("kuzehibiki@126.com");
//     account.smtp_password = String::from("IFHXQOCVBMPLJQTD");
//     account.smtp_server = String::from("smtp.126.com");
//     account.smtp_port = 25; // 126邮箱使用端口25
//     account.smtp_protocol = MailProtocal::Starttls.into();

//     Ok(account)
// }
