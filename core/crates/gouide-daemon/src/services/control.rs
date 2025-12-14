//! Control service implementation.

use gouide_protocol::control_server::Control;
use gouide_protocol::{CancelRequest, CancelResponse};
use tonic::{Request, Response, Status};
use tracing::info;

/// Control service for cross-cutting operations.
///
/// Currently a stub implementation. Full cancellation support
/// requires a request tracker to be implemented.
pub struct ControlService {}

impl ControlService {
    /// Create a new control service.
    pub fn new() -> Self {
        Self {}
    }
}

impl Default for ControlService {
    fn default() -> Self {
        Self::new()
    }
}

#[tonic::async_trait]
impl Control for ControlService {
    async fn cancel(
        &self,
        request: Request<CancelRequest>,
    ) -> Result<Response<CancelResponse>, Status> {
        let req = request.into_inner();
        let request_id = req.request_id.map(|r| r.value).unwrap_or_default();

        info!(request_id = %request_id, "Cancel request received");

        // MVP: Stub implementation
        // Full implementation requires a request tracker that maps
        // request IDs to cancellation tokens
        Ok(Response::new(CancelResponse {
            cancelled: false,
            reason: "Request not found or already completed".to_string(),
        }))
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use gouide_protocol::RequestId;

    #[tokio::test]
    async fn test_cancel_stub() {
        let service = ControlService::new();

        let response = service
            .cancel(Request::new(CancelRequest {
                request_id: Some(RequestId {
                    value: "test-request-123".to_string(),
                }),
            }))
            .await
            .unwrap();

        let result = response.into_inner();
        // Stub always returns false
        assert!(!result.cancelled);
        assert!(!result.reason.is_empty());
    }
}
