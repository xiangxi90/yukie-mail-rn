use std::{
    convert::Infallible,
    fmt,
    future::Future,
    pin::Pin,
    task::{Context, Poll},
};

type CommandId = u32;
type Route = Box<dyn Handler>;
pub(super) struct Router<S> {
    routes: HashMap<CommandId, Route>,
    node: Arc<Node>,
}
