# Kiến Trúc Backend

## Tổng Quan
Backend của SurfSense là một ứng dụng **Python FastAPI** mạnh mẽ, được thiết kế cho các quy trình làm việc agentic hiệu suất cao. Nó đóng vai trò là hệ thống thần kinh trung ương, điều phối RAG (Retrieval-Augmented Generation), quản lý bộ nhớ của agent (agent memory), và xử lý tương tác với các mô hình ngôn ngữ lớn (LLMs).

## Các Thành Phần Cốt Lõi

### 1. Framework AI Agent (DeepAgents & LangGraph)
- **DeepAgents**: Framework tùy chỉnh để xây dựng các AI agents tự chủ (autonomous agents).
- **LangGraph**: Quản lý StateGraph (đồ thị trạng thái) và quy trình điều phối cho các suy luận phức tạp, nhiều bước.
- **Workflow**: Người dùng gửi truy vấn -> LangGraph xác định ý định (Routing) -> Kích hoạt các Agents cụ thể (Search Agent, Coding Agent, v.v.).

### 2. Dịch Vụ Dữ Liệu (Data Services)
- **Primary Database**: **Postgres** (với extension `pgvector`) lưu trữ:
    - Dữ liệu người dùng & ứng dụng.
    - Vector Embeddings cho tìm kiếm ngữ nghĩa (semantic search).
    - Lịch sử chat và phiên làm việc.
- **ORM**: **SQLAlchemy (Async)** dùng cho các tương tác cơ sở dữ liệu quan hệ.
- **Caching/Queue**: **Redis** dùng cho hàng đợi tác vụ (Celery broker) và caching phản hồi ngắn hạn.

### 3. Hệ Thống Tìm Kiếm & RAG
- **Vector Store**: Sử dụng `pgvector` để lưu trữ embeddings của tài liệu.
- **Retriever**: Logic tùy chỉnh trong `app/retriever/` để lấy ngữ cảnh (fetches context) dựa trên sự tương đồng (similarity) và metadata filtering.
- **Ingestion Pipeline**: Celery workers xử lý việc tải tài liệu từ nguồn bên ngoài, chia nhỏ văn bản (chunking), tạo embedding, và lưu trữ.

### 4. Kết Nối Ứng Dụng Ngoài (Connectors)
- **Kiến Trúc**: Modular adapter pattern.
- **Hỗ trợ**: Slack, Google Drive, Notion, GitHub, v.v. (30+ integrations).
- **Cơ chế**: Webhooks hoặc định kỳ polling (thực hiện bởi Celery beats).

## Luồng Dữ Liệu (Data Flow)

1. **Request**: Client (Web/Extension) gửi REST request tới FastAPI Endpoints.
2. **Auth**: Middleware xác thực JWT/OAuth token.
3. **Controller**: Route handler (`app/routes/`) nhận request, gọi Service layer.
4. **Processing**:
    - Nếu là tác vụ nhanh (CRUD): Xử lý trực tiếp với DB.
    - Nếu là tác vụ AI: Đẩy vào LangGraph runner để streaming phản hồi.
    - Nếu là tác vụ dài (Ingestion): Đẩy job vào Redis queue cho Celery.
5. **Response**: Trả về JSON hoặc Streaming Response (SSE).
