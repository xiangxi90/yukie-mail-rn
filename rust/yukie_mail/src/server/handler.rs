pub trait Handler {
    fn call(&self, req: vec<u8>) -> BoxFuture<'static, Vec<u8>>;
}

pub trait IntoResponse {
    fn into_response(self) -> Vec<u8>;
}

// framework code
pub trait FromRequest {
    type Error;
    fn from_request(req: &[u8]) -> Result<Self, Self::Error>;
}

impl<F, O, T1> Handler for F
    where F: Fn(T1) -> Fut, Fut: Future<Output = O>,
          O: IntoResponse, T1: FromRequest {
    fn call(&self, req: http::Request) -> BoxFuture<'static, Vec<u8>> {
        Box::pin(async move {
            let param = match T1::from_request(&req) {
                Ok(p) => p,
                Err(e) => return e.into(),
            };
            let resp = (self)(param).into_response();
            resp
        })
    }
}

macro_rules! handler_tuple ({ $(($n:tt, $T:ident)),+} => {
    impl<F, $($T,)+> Handler<($($T,)+)> for F
    where F: Fn($($T,)+) -> BoxFuture<'static, Vec<u8>>,
    {
        fn call(&self, param: ($($T,)+)) -> BoxFuture<'static, Vec<u8>> {
            (self)($(param.$n,)+)
        }
    }
});