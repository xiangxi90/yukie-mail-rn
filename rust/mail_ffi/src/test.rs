use crate::uds;

#[test]
fn test_connect_uds() {
    let res = uds::invoke();
    println!("{:?}", res);
    assert!(res.is_ok());
}
