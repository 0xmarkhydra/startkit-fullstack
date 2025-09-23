# SRS — Chat Widget Q&A for Token Project

> Mục tiêu: Xây dựng một **widget chat** nhúng vào website (ví dụ `app.pretgemarket.xyz/token/xpl`) để người dùng có thể đặt câu hỏi về chính dự án/token hiển thị tại trang đó. Hệ thống sẽ đọc dữ liệu từ API (`curl.md`) và tài liệu chính chủ (docs) để làm nguồn kiến thức.

---

## 1. Đầu vào (Inputs)
1. **URL trang token hiện tại**  
   - Ví dụ: `https://app.pretgemarket.xyz/token/xpl`  
   - Từ đây lấy ra `tokenSlug = "xpl"`.

2. **API dự án (từ curl.md)**  
   - `GET /api/v1/tokens/:slug` → tên, symbol, website, mạng lưới, trạng thái, giá hiện tại…
   - `POST /projects/get-by-symbol` → mô tả dự án, category, social, fundraising, investors, tokenomics.
   - Các endpoint khác trong `curl.md` như danh sách sàn, volume, hoạt động marketing, …

3. **Tài liệu chính thức (Docs)**  
   - Link gốc: `https://docs.plasma.to/docs`
   - Nội dung: giới thiệu dự án, cách hoạt động, tokenomics chi tiết, hướng dẫn kỹ thuật…

4. **Câu hỏi từ người dùng**  
   - Nhập trực tiếp trong widget chat.
   - Ngôn ngữ: tiếng Việt hoặc tiếng Anh.

---

## 2. Quá trình xử lý (Processing)

1. **Xác định bối cảnh (Context)**
   - Từ `tokenSlug` → ánh xạ sang project/token cụ thể.
   - Tất cả truy vấn từ widget tại trang đó đều scope vào **1 dự án duy nhất**.

2. **Thu thập dữ liệu (Ingestion)**
   - Gọi các API trong `curl.md` để lấy dữ liệu mới nhất về token & project.
   - Crawl docs chính chủ, chuẩn hoá sang Markdown, loại bỏ phần dư thừa.
   - Chia nhỏ (chunk) nội dung theo heading/bảng/code.

3. **Lưu trữ & lập chỉ mục**
   - Lưu dữ liệu dạng chuẩn hoá (project, token, funding, docs…)
   - Sinh embeddings (vector) cho từng chunk.
   - Lưu kèm metadata: `tokenSlug`, `projectName`, `url`, `heading`.

4. **Theo dõi thay đổi**
   - Định kỳ check API/docs (ETag, Last-Modified, hash nội dung).
   - Nếu có thay đổi → re‑crawl/re‑embed phần khác biệt (delta update).

5. **Truy vấn & trả lời (Q&A)**
   - Khi user chat → hệ thống lấy top‑k chunks theo scope `tokenSlug`.
   - Dùng hybrid retrieval (tìm theo keyword + vector).
   - Rerank để chọn các đoạn phù hợp nhất.
   - Sinh câu trả lời bằng LLM **chỉ dựa trên context**.
   - Bổ sung citations (nguồn: API URL hoặc docs).

6. **Trả kết quả về widget**
   - Hiển thị câu trả lời gọn gàng.
   - Kèm danh sách nguồn tham khảo (links).
   - Confidence score (nếu cần).

---

## 3. Đầu ra (Outputs)
- **Câu trả lời về dự án/token đang được xem**
  - Ví dụ: “Plasma (XPL) là một Layer1 xây dựng trên Bitcoin, đã mainnet, gọi vốn 74M USD từ các quỹ như Framework Ventures, Founders Fund… Tokenomics tổng cung 10B, đang lưu hành 1.8B.”
- **Nguồn trích dẫn**
  - Link API (pretgemarket.xyz/api/...)
  - Link docs chính chủ (docs.plasma.to/...)
- **Thông tin bổ sung** (tuỳ cấu hình)
  - Các vòng funding, exchange listings, roadmap…

---

## 4. Luồng tóm tắt Input → Xử lý → Output
```mermaid
flowchart LR
A[URL trang token] --> B[Resolver\n(tokenSlug)]
U[User Question] --> B
B --> C[Ingestion từ API + Docs]
C --> D[Index + Vectors]
D --> E[Retrieval + Rerank]
E --> F[LLM Answer]
F --> G[Widget Chat]
```

**Input**: URL trang token + API (curl.md) + Docs + User question  
**Processing**: Xác định token → Crawl API+Docs → Chuẩn hoá + Chunk + Embed → Retrieval theo tokenSlug → Rerank → Sinh trả lời  
**Output**: Trả lời trong widget chat kèm citations

