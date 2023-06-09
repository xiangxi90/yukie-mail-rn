use crate::bridge::ext::JavaVMExt;
use std::future::Future;
use tokio::runtime::Runtime;
use tokio::task::JoinHandle;

static mut RUNTIME: Option<Runtime> = None;

/// Calls whenever the runtime is started or re-started.
pub fn start_runtime() {
    crate::info!(
        "Starting tokio runtime from thread id: {:?}, System: Logical cores: {}, Physical cores: {}, Tokio Runtime core threads: {}",
        std::thread::current().id(),
        num_cpus::get(),
        num_cpus::get_physical(),
        runtime_core_threads_count()
    );

    unsafe {
        RUNTIME.replace(
            tokio::runtime::Builder::new_multi_thread()
                .worker_threads(runtime_core_threads_count())
                .on_thread_start(|| {
                    crate::info!(
                        "Tokio worker thread started: {:?}",
                        std::thread::current().id()
                    );

                    crate::info!(
                        "Attaching Tokio worker thread with JVM: {:?}",
                        std::thread::current().id()
                    );
                    crate::bridge::jvm().attach_thread();
                })
                .on_thread_stop(|| {
                    crate::info!(
                        "Tokio worker thread stopped: {:?}",
                        std::thread::current().id()
                    );
                })
                .build()
                .unwrap(),
        );
    }
}

/// Calls whenever the runtime is shut down.
pub fn shutdown_runtime() {
    if let Some(runtime) = unsafe { RUNTIME.take() } {
        crate::info!("Shutdown tokio runtime started");
        runtime.shutdown_timeout(tokio::time::Duration::from_secs(1));
        crate::info!("Shutdown tokio runtime done");
    }
}

/// Spawns a future task to the runtime.
pub fn spawn<T>(task: T) -> JoinHandle<T::Output>
where
    T: Future + Send + 'static,
    T::Output: Send + 'static,
{
    unsafe { RUNTIME.as_ref().unwrap().spawn(task) }
}

pub fn block_on<T>(task: T) -> T::Output
where
    T: Future + Send + 'static,
    T::Output: Send + 'static,
{
    unsafe { RUNTIME.as_ref().unwrap().block_on(task) }
}

fn runtime_core_threads_count() -> usize {
    num_cpus::get().min(4).max(2)
}
