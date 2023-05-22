use crate::proto;
use crate::uds;
#[test]
fn test_connect_uds() {
    let res = uds::invoke();
    println!("{:?}", res);
    assert!(res.is_ok());
}

#[test]
fn test_proto() {
    let sd = proto::command::SendMailRequest::default();
    println!("{:?}", sd);
}
