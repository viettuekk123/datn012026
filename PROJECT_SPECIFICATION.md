# HỆ THỐNG TUYỂN DỤNG IT TÍCH HỢP NER
## IT Job Platform with AI-Powered CV Parsing

---

# MỤC LỤC

1. [Giới thiệu dự án](#1-giới-thiệu-dự-án)
2. [Kiến trúc hệ thống](#2-kiến-trúc-hệ-thống)
3. [Chức năng chi tiết](#3-chức-năng-chi-tiết)
4. [Database Schema](#4-database-schema)
5. [API Specification](#5-api-specification)
6. [NER Service](#6-ner-service)
7. [Giao diện người dùng](#7-giao-diện-người-dùng)
8. [Hướng dẫn triển khai](#8-hướng-dẫn-triển-khai)

---

# 1. GIỚI THIỆU DỰ ÁN

## 1.1 Mục tiêu

Xây dựng nền tảng tuyển dụng **chuyên ngành IT** với các tính năng:

- **Nhà tuyển dụng** đăng tin tuyển dụng, xem và lọc ứng viên
- **Ứng viên** tìm việc, upload CV và apply job
- **AI/NER** tự động trích xuất thông tin từ CV (tên, email, skills, kinh nghiệm...)
- **Match Score** tự động tính điểm phù hợp giữa CV và Job dựa trên skills

## 1.2 Đối tượng người dùng

| Role | Mô tả | Quyền hạn |
|------|-------|-----------|
| **Admin** | Quản trị viên hệ thống | Xem thống kê, quản lý users |
| **Employer** | Công ty/Nhà tuyển dụng | Đăng job, xem ứng viên, accept/reject |
| **Candidate** | Ứng viên tìm việc | Upload CV, apply job, theo dõi đơn |

## 1.3 Công nghệ sử dụng

| Layer | Công nghệ | Mô tả |
|-------|-----------|-------|
| **Frontend** | Next.js 14 | React framework với SSR |
| **UI Library** | shadcn/ui | Component library |
| **Styling** | TailwindCSS | Utility-first CSS |
| **Backend** | NestJS | Node.js framework |
| **ORM** | TypeORM | Database ORM |
| **Auth** | JWT | JSON Web Token |
| **Database** | PostgreSQL | Relational database |
| **NER Service** | FastAPI + Python | AI service trích xuất CV |
| **NER Model** | XLM-RoBERTa | Multilingual NER model |


---

# 2. KIẾN TRÚC HỆ THỐNG

## 2.1 Sơ đồ tổng quan

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND (Next.js)                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │    Admin    │  │  Employer   │  │  Candidate  │  │   Public    │    │
│  │  Dashboard  │  │  Dashboard  │  │  Dashboard  │  │   Pages     │    │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 │ REST API (HTTP)
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           BACKEND (NestJS)                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │    Auth     │  │    Job      │  │     CV      │  │Application  │    │
│  │   Module    │  │   Module    │  │   Module    │  │   Module    │    │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                    ▼                         ▼
┌─────────────────────────────┐  ┌─────────────────────────────┐
│      NER SERVICE            │  │        PostgreSQL           │
│      (FastAPI)              │  │        Database             │
│                             │  │                             │
│  Input: PDF/DOCX/Image      │  │  - users                    │
│  Output: JSON entities      │  │  - companies                │
│                             │  │  - jobs                     │
│  Entities:                  │  │  - skills                   │
│  - Name, Email, Phone       │  │  - cvs                      │
│  - Skills                   │  │  - applications             │
│  - Experience               │  │                             │
│  - Education                │  │                             │
└─────────────────────────────┘  └─────────────────────────────┘
```

## 2.2 Flow xử lý chính

### Flow 1: Candidate upload CV

```
1. Candidate upload file CV (PDF/DOCX/Image)
                    │
                    ▼
2. Backend nhận file, gửi sang NER Service
                    │
                    ▼
3. NER Service:
   - Trích xuất text từ file (OCR nếu là ảnh)
   - Chạy NER model nhận diện entities
   - Trả về JSON: {name, email, phone, skills, positions, ...}
                    │
                    ▼
4. Backend:
   - Lưu file gốc (local/cloud)
   - Lưu CV info vào table `cvs`
   - Lưu parsed data vào table `cv_parsed`
   - Map skills vào table `cv_skills`
                    │
                    ▼
5. Candidate xem CV đã parse, có thể chỉnh sửa
```

### Flow 2: Candidate apply job

```
1. Candidate xem job detail
                    │
                    ▼
2. Click "Apply" → Chọn CV (nếu có nhiều)
                    │
                    ▼
3. Backend:
   - Tạo record trong table `applications`
   - Gọi function `calculate_match_score(cv_id, job_id)`
   - Lưu match_score vào application
                    │
                    ▼
4. Employer nhận thông báo có ứng viên mới
```

### Flow 3: Employer xem ứng viên

```
1. Employer vào trang quản lý job
                    │
                    ▼
2. Chọn job → Xem danh sách ứng viên (DataGrid)
                    │
                    ▼
3. DataGrid hiển thị:
   - Tên, Email, Phone (từ cv_parsed)
   - Skills (từ cv_skills)
   - Match Score (%)
   - Trạng thái (pending/accepted/rejected)
                    │
                    ▼
4. Employer có thể:
   - Filter theo skills
   - Sort theo match score
   - Xem CV gốc / CV parsed
   - Accept / Reject ứng viên
```


---

# 3. CHỨC NĂNG CHI TIẾT

## 3.1 PUBLIC PAGES (Không cần đăng nhập)

### 3.1.1 Trang chủ
- Banner giới thiệu
- Ô tìm kiếm job (keyword, location)
- Danh sách job mới nhất
- Danh sách công ty nổi bật

### 3.1.2 Trang danh sách Jobs
- Danh sách jobs dạng card/list
- Filter:
  - Keyword (title, company)
  - Location (Hà Nội, TP.HCM, Đà Nẵng, Remote)
  - Level (Intern, Fresher, Junior, Middle, Senior)
  - Skills (multi-select)
  - Salary range
  - Work type (Onsite, Remote, Hybrid)
- Sort: Mới nhất, Lương cao nhất
- Pagination

### 3.1.3 Trang chi tiết Job
- Thông tin job: title, level, salary, location, work type
- Mô tả công việc
- Yêu cầu ứng viên
- Quyền lợi
- Skills yêu cầu (tags)
- Thông tin công ty (sidebar)
- Nút "Apply Now" (redirect login nếu chưa đăng nhập)

### 3.1.4 Trang Company Profile
- Logo, tên công ty
- Mô tả công ty
- Quy mô, địa điểm, website
- Danh sách jobs đang tuyển

### 3.1.5 Trang đăng ký / đăng nhập
- Form đăng ký: Email, Password, Role (Employer/Candidate)
- Form đăng nhập: Email, Password
- Quên mật khẩu (optional)

---

## 3.2 CANDIDATE DASHBOARD

### 3.2.1 Trang Profile
**Thông tin hiển thị:**
- Avatar (optional)
- Họ tên
- Email
- Số điện thoại
- Địa điểm
- Vị trí mong muốn (VD: "Backend Developer")
- Số năm kinh nghiệm
- Mức lương mong muốn
- Hình thức làm việc (Onsite/Remote/Hybrid)
- Giới thiệu bản thân

**Chức năng:**
- Xem profile
- Chỉnh sửa profile
- Đổi mật khẩu

### 3.2.2 Trang quản lý CV
**Danh sách CV:**

| Tên file | Ngày upload | Mặc định | Actions |
|----------|-------------|----------|---------|
| NguyenVanA_CV.pdf | 01/01/2025 | ✓ | Xem, Xóa, Đặt mặc định |
| CV_2024.docx | 15/12/2024 | | Xem, Xóa, Đặt mặc định |

**Upload CV mới:**
- Chọn file (PDF, DOCX, PNG, JPG)
- Upload → Hiển thị loading
- Sau khi NER parse xong → Hiển thị kết quả

**Xem CV đã parse:**
```
┌─────────────────────────────────────────────────────┐
│ CV: NguyenVanA_CV.pdf                               │
├─────────────────────────────────────────────────────┤
│ Thông tin cá nhân:                                  │
│   Họ tên: Nguyễn Văn A                              │
│   Email: a.nguyen@gmail.com                         │
│   SĐT: 0912 345 678                                 │
│   Địa điểm: TP.HCM                                  │
├─────────────────────────────────────────────────────┤
│ Vị trí:                                             │
│   • Senior Backend Developer                        │
│   • Software Engineer                               │
├─────────────────────────────────────────────────────┤
│ Kinh nghiệm:                                        │
│   • FPT Software (2020-2024)                        │
│   • Shopee (2018-2020)                              │
├─────────────────────────────────────────────────────┤
│ Học vấn:                                            │
│   • Kỹ sư CNTT - Đại học Bách Khoa TP.HCM           │
├─────────────────────────────────────────────────────┤
│ Skills:                                             │
│   [Java] [Spring Boot] [PostgreSQL] [Docker]        │
│   [Kubernetes] [AWS] [Redis] [Kafka]                │
└─────────────────────────────────────────────────────┘
```

### 3.2.3 Trang tìm việc
- Giống trang public Jobs nhưng có thêm:
  - Nút "Apply" trực tiếp (không cần redirect)
  - Hiển thị "Đã apply" nếu đã nộp đơn
  - Gợi ý jobs phù hợp với profile (optional)

### 3.2.4 Trang đơn ứng tuyển của tôi
**Danh sách đơn đã nộp:**

| Job | Công ty | Ngày nộp | Match | Trạng thái |
|-----|---------|----------|-------|------------|
| Senior Backend | FPT Software | 01/01/2025 | 85% | Pending |
| Fullstack Dev | Shopee | 28/12/2024 | 72% | Accepted |
| Java Developer | Tiki | 25/12/2024 | 60% | Rejected |

**Trạng thái:**
- `Pending` (Chờ xử lý) - màu vàng
- `Accepted` (Đã chấp nhận) - màu xanh
- `Rejected` (Từ chối) - màu đỏ


---

## 3.3 EMPLOYER DASHBOARD

### 3.3.1 Trang Company Profile
**Thông tin công ty:**
- Logo (upload ảnh)
- Tên công ty
- Mô tả công ty
- Quy mô (1-10, 11-50, 51-200, 201-500, 500+)
- Địa điểm
- Website

**Chức năng:**
- Xem profile công ty
- Chỉnh sửa thông tin
- Preview trang public

### 3.3.2 Trang quản lý Jobs
**Danh sách jobs:**

| Title | Level | Ứng viên | Trạng thái | Actions |
|-------|-------|----------|------------|---------|
| Senior Backend Developer | Senior | 15 | Active | Sửa, Xem UV, Đóng |
| Frontend Developer | Junior | 8 | Active | Sửa, Xem UV, Đóng |
| DevOps Engineer | Middle | 3 | Closed | Sửa, Xem UV, Mở lại |

**Tạo job mới:**

```
┌─────────────────────────────────────────────────────┐
│ TẠO TIN TUYỂN DỤNG MỚI                              │
├─────────────────────────────────────────────────────┤
│ Tiêu đề job: [________________________]             │
│                                                     │
│ Level: [Dropdown: Intern/Fresher/Junior/...]        │
│                                                     │
│ Kinh nghiệm: [Min] - [Max] năm                      │
│                                                     │
│ Mức lương: [Min] - [Max] VND  □ Hiển thị lương      │
│                                                     │
│ Địa điểm: [________________________]                │
│                                                     │
│ Hình thức: ○ Onsite  ○ Remote  ○ Hybrid             │
│                                                     │
│ Skills yêu cầu:                                     │
│ [Java ×] [Spring Boot ×] [+ Thêm skill]             │
│                                                     │
│ Mô tả công việc:                                    │
│ [Rich text editor................................]  │
│                                                     │
│ Yêu cầu ứng viên:                                   │
│ [Rich text editor................................]  │
│                                                     │
│ Quyền lợi:                                          │
│ [Rich text editor................................]  │
│                                                     │
│ Hạn nộp hồ sơ: [Date picker]                        │
│                                                     │
│              [Hủy]  [Lưu nháp]  [Đăng tin]          │
└─────────────────────────────────────────────────────┘
```

### 3.3.3 Trang xem ứng viên (CORE FEATURE)

**DataGrid ứng viên:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Job: Senior Backend Developer                                    [Export]   │
├─────────────────────────────────────────────────────────────────────────────┤
│ Filter: [Skills ▼] [Match > 70% ▼] [Status ▼]           Search: [________] │
├─────────────────────────────────────────────────────────────────────────────┤
│ □ │ Tên          │ Email              │ Skills              │Match│ Status │
├───┼──────────────┼────────────────────┼─────────────────────┼─────┼────────┤
│ □ │ Nguyễn Văn A │ a.nguyen@gmail.com │ Java, Spring, AWS   │ 85% │Pending │
│ □ │ Trần Thị B   │ b.tran@outlook.com │ Java, Docker, K8s   │ 78% │Pending │
│ □ │ Lê Văn C     │ c.le@gmail.com     │ Python, Django      │ 45% │Rejected│
├───┴──────────────┴────────────────────┴─────────────────────┴─────┴────────┤
│ Showing 1-10 of 15                                    [< 1 2 >]             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Chức năng DataGrid:**
- **Filter:**
  - Theo skills (multi-select)
  - Theo match score (>50%, >70%, >80%)
  - Theo status (Pending, Accepted, Rejected)
- **Sort:**
  - Match score (cao → thấp)
  - Ngày nộp (mới nhất)
- **Search:** Tìm theo tên, email
- **Bulk actions:** Chọn nhiều → Accept/Reject hàng loạt
- **Export:** Xuất danh sách ra Excel (optional)

**Xem chi tiết ứng viên (Modal/Drawer):**

```
┌─────────────────────────────────────────────────────┐
│ THÔNG TIN ỨNG VIÊN                           [×]   │
├─────────────────────────────────────────────────────┤
│ ┌─────┐  Nguyễn Văn A                               │
│ │Avatar│  a.nguyen@gmail.com                        │
│ └─────┘  0912 345 678                               │
│          TP.HCM                                     │
├─────────────────────────────────────────────────────┤
│ Match Score: ████████░░ 85%                         │
├─────────────────────────────────────────────────────┤
│ Skills:                                             │
│ [Java ✓] [Spring Boot ✓] [PostgreSQL ✓] [Docker ✓] │
│ [AWS ✓] [Redis] [Kafka]                             │
│ (✓ = match với job requirements)                    │
├─────────────────────────────────────────────────────┤
│ Kinh nghiệm:                                        │
│ • Senior Developer @ Shopee (2021-2024)             │
│ • Backend Developer @ FPT (2018-2021)               │
├─────────────────────────────────────────────────────┤
│ Học vấn:                                            │
│ • Kỹ sư CNTT - ĐH Bách Khoa TP.HCM                  │
├─────────────────────────────────────────────────────┤
│ [Xem CV gốc]  [Xem CV parsed]                       │
├─────────────────────────────────────────────────────┤
│ Ghi chú:                                            │
│ [_________________________________________]         │
│                                                     │
│         [Reject]              [Accept]              │
└─────────────────────────────────────────────────────┘
```

---

## 3.4 ADMIN DASHBOARD

### 3.4.1 Trang thống kê

```
┌─────────────────────────────────────────────────────────────────┐
│ DASHBOARD                                                       │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │   150    │  │    25    │  │    45    │  │   320    │        │
│  │Candidates│  │Employers │  │  Jobs    │  │  CVs     │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
├─────────────────────────────────────────────────────────────────┤
│  [Chart: Đăng ký theo tháng]    [Chart: Jobs theo level]       │
│                                                                 │
│  ████                           Intern   ██░░░░ 15%            │
│  ██████                         Fresher  ████░░ 25%            │
│  ████████                       Junior   ██████ 35%            │
│  ██████                         Senior   ████░░ 25%            │
│  Jan Feb Mar Apr                                                │
└─────────────────────────────────────────────────────────────────┘
```

### 3.4.2 Quản lý Users

| Email | Role | Trạng thái | Ngày tạo | Actions |
|-------|------|------------|----------|---------|
| a@gmail.com | Candidate | Active | 01/01/2025 | Block |
| company@fpt.com | Employer | Active | 15/12/2024 | Block |
| spam@test.com | Candidate | Blocked | 10/12/2024 | Unblock |

**Chức năng:**
- Xem danh sách users
- Filter theo role, status
- Block/Unblock user


---

# 4. DATABASE SCHEMA

Xem file chi tiết: `database.sql`

## 4.1 Sơ đồ quan hệ (ERD)

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   users     │       │  companies  │       │    jobs     │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │──┐    │ id (PK)     │──┐    │ id (PK)     │
│ email       │  │    │ user_id(FK) │◄─┘    │ company_id  │◄─┐
│ password    │  │    │ name        │       │ title       │  │
│ role        │  │    │ logo_url    │       │ level       │  │
│ is_active   │  │    │ description │       │ salary_min  │  │
└─────────────┘  │    │ location    │       │ location    │  │
                 │    └─────────────┘       │ description │  │
                 │                          └─────────────┘  │
                 │                                 │         │
                 │    ┌─────────────┐              │         │
                 │    │   skills    │              │         │
                 │    ├─────────────┤              │         │
                 │    │ id (PK)     │◄─────────────┼─────────┤
                 │    │ name        │              │         │
                 │    │ category    │              │         │
                 │    └─────────────┘              │         │
                 │           │                     │         │
                 │           │         ┌───────────┘         │
                 │           │         │                     │
                 │           ▼         ▼                     │
                 │    ┌─────────────────────┐                │
                 │    │    job_skills       │                │
                 │    ├─────────────────────┤                │
                 │    │ job_id (FK)         │────────────────┘
                 │    │ skill_id (FK)       │
                 │    │ is_required         │
                 │    └─────────────────────┘
                 │
                 │    ┌─────────────┐       ┌─────────────┐
                 │    │    cvs      │       │  cv_parsed  │
                 │    ├─────────────┤       ├─────────────┤
                 └───▶│ id (PK)     │──────▶│ id (PK)     │
                      │ user_id(FK) │       │ cv_id (FK)  │
                      │ filename    │       │ name        │
                      │ file_url    │       │ email       │
                      │ raw_text    │       │ phone       │
                      │ is_default  │       │ positions   │
                      └─────────────┘       │ skills      │
                             │              └─────────────┘
                             │
                             ▼
                      ┌─────────────────────┐
                      │    cv_skills        │
                      ├─────────────────────┤
                      │ cv_id (FK)          │
                      │ skill_id (FK)       │
                      │ confidence          │
                      └─────────────────────┘
                             │
                             │
                             ▼
                      ┌─────────────────────┐
                      │   applications      │
                      ├─────────────────────┤
                      │ id (PK)             │
                      │ job_id (FK)         │
                      │ candidate_id (FK)   │
                      │ cv_id (FK)          │
                      │ match_score         │
                      │ status              │
                      └─────────────────────┘
```

## 4.2 Mô tả các bảng

### users
Lưu thông tin tài khoản đăng nhập.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| email | VARCHAR(255) | Email đăng nhập (unique) |
| password_hash | VARCHAR(255) | Mật khẩu đã hash |
| role | VARCHAR(20) | 'admin', 'employer', 'candidate' |
| is_active | BOOLEAN | Tài khoản có bị block không |
| created_at | TIMESTAMP | Ngày tạo |

### companies
Thông tin công ty (1 employer = 1 company).

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | FK → users.id |
| name | VARCHAR(255) | Tên công ty |
| logo_url | VARCHAR(500) | URL logo |
| description | TEXT | Mô tả công ty |
| company_size | VARCHAR(50) | '1-10', '11-50', '51-200'... |
| location | VARCHAR(255) | Địa điểm |
| website | VARCHAR(255) | Website công ty |

### candidate_profiles
Thông tin profile ứng viên.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | FK → users.id |
| full_name | VARCHAR(255) | Họ tên |
| phone | VARCHAR(20) | Số điện thoại |
| location | VARCHAR(255) | Địa điểm |
| title | VARCHAR(255) | Vị trí mong muốn |
| experience_years | INT | Số năm kinh nghiệm |
| expected_salary | INT | Lương mong muốn (VND) |
| work_type | VARCHAR(50) | 'onsite', 'remote', 'hybrid' |
| bio | TEXT | Giới thiệu bản thân |

### skills
Master data các skills IT.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| name | VARCHAR(100) | Tên skill (unique) |
| category | VARCHAR(50) | 'language', 'framework', 'database', 'devops', 'tool' |

### jobs
Bài đăng tuyển dụng.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| company_id | UUID | FK → companies.id |
| title | VARCHAR(255) | Tiêu đề job |
| level | VARCHAR(50) | 'intern', 'fresher', 'junior', 'middle', 'senior', 'lead' |
| experience_min | INT | Kinh nghiệm tối thiểu (năm) |
| experience_max | INT | Kinh nghiệm tối đa |
| salary_min | INT | Lương tối thiểu (VND) |
| salary_max | INT | Lương tối đa |
| salary_visible | BOOLEAN | Có hiển thị lương không |
| location | VARCHAR(255) | Địa điểm làm việc |
| work_type | VARCHAR(50) | 'onsite', 'remote', 'hybrid' |
| description | TEXT | Mô tả công việc |
| requirements | TEXT | Yêu cầu ứng viên |
| benefits | TEXT | Quyền lợi |
| is_active | BOOLEAN | Job còn tuyển không |
| deadline | DATE | Hạn nộp hồ sơ |

### job_skills
Quan hệ nhiều-nhiều giữa jobs và skills.

| Column | Type | Description |
|--------|------|-------------|
| job_id | UUID | FK → jobs.id |
| skill_id | INT | FK → skills.id |
| is_required | BOOLEAN | Bắt buộc hay nice-to-have |

### cvs
CV gốc được upload.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | FK → users.id |
| filename | VARCHAR(255) | Tên file gốc |
| file_url | VARCHAR(500) | URL file đã upload |
| file_type | VARCHAR(20) | 'pdf', 'docx', 'image' |
| raw_text | TEXT | Text trích xuất từ file |
| is_default | BOOLEAN | CV mặc định |
| uploaded_at | TIMESTAMP | Ngày upload |

### cv_parsed
Dữ liệu CV đã được NER parse.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| cv_id | UUID | FK → cvs.id |
| name | VARCHAR(255) | Họ tên |
| email | VARCHAR(255) | Email |
| phone | VARCHAR(50) | Số điện thoại |
| location | VARCHAR(255) | Địa điểm |
| positions | JSONB | Danh sách vị trí ["Backend Dev", "Software Engineer"] |
| organizations | JSONB | Danh sách công ty ["FPT", "Shopee"] |
| years | JSONB | Các mốc thời gian ["2020-2024", "2018-2020"] |
| degrees | JSONB | Bằng cấp ["Kỹ sư CNTT", "Thạc sĩ"] |
| schools | JSONB | Trường học ["ĐH Bách Khoa"] |
| parsed_at | TIMESTAMP | Ngày parse |

### cv_skills
Quan hệ nhiều-nhiều giữa cvs và skills.

| Column | Type | Description |
|--------|------|-------------|
| cv_id | UUID | FK → cvs.id |
| skill_id | INT | FK → skills.id |
| confidence | DECIMAL(3,2) | Độ tin cậy từ NER (0-1) |

### applications
Đơn ứng tuyển.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| job_id | UUID | FK → jobs.id |
| candidate_id | UUID | FK → users.id |
| cv_id | UUID | FK → cvs.id |
| match_score | DECIMAL(5,2) | Điểm match (0-100) |
| status | VARCHAR(20) | 'pending', 'accepted', 'rejected' |
| employer_note | TEXT | Ghi chú của employer |
| applied_at | TIMESTAMP | Ngày nộp đơn |


---

# 5. API SPECIFICATION

## 5.1 Authentication

### POST /api/auth/register
Đăng ký tài khoản mới.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "candidate"  // "candidate" hoặc "employer"
}
```

**Response (201):**
```json
{
  "message": "Đăng ký thành công",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "candidate"
  }
}
```

### POST /api/auth/login
Đăng nhập.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "candidate"
  }
}
```

### GET /api/auth/me
Lấy thông tin user hiện tại.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "role": "candidate",
  "profile": { ... }
}
```

---

## 5.2 Jobs

### GET /api/jobs
Lấy danh sách jobs (public).

**Query params:**
- `page` (default: 1)
- `limit` (default: 10)
- `keyword` - Tìm theo title, company
- `location` - Filter theo địa điểm
- `level` - Filter theo level
- `skills` - Filter theo skills (comma-separated)
- `salary_min`, `salary_max` - Filter theo lương
- `work_type` - 'onsite', 'remote', 'hybrid'
- `sort` - 'newest', 'salary_desc'

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Senior Backend Developer",
      "level": "senior",
      "salary_min": 25000000,
      "salary_max": 40000000,
      "location": "TP.HCM",
      "work_type": "hybrid",
      "skills": ["Java", "Spring Boot", "PostgreSQL"],
      "company": {
        "id": "uuid",
        "name": "FPT Software",
        "logo_url": "https://..."
      },
      "created_at": "2025-01-08T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "total_pages": 5
  }
}
```

### GET /api/jobs/:id
Lấy chi tiết job.

**Response (200):**
```json
{
  "id": "uuid",
  "title": "Senior Backend Developer",
  "level": "senior",
  "experience_min": 3,
  "experience_max": 5,
  "salary_min": 25000000,
  "salary_max": 40000000,
  "salary_visible": true,
  "location": "TP.HCM",
  "work_type": "hybrid",
  "description": "Mô tả công việc...",
  "requirements": "Yêu cầu...",
  "benefits": "Quyền lợi...",
  "skills": [
    { "name": "Java", "is_required": true },
    { "name": "Spring Boot", "is_required": true },
    { "name": "AWS", "is_required": false }
  ],
  "company": {
    "id": "uuid",
    "name": "FPT Software",
    "logo_url": "https://...",
    "description": "...",
    "company_size": "1000+",
    "location": "Hà Nội, TP.HCM",
    "website": "https://fpt-software.com"
  },
  "deadline": "2025-02-28",
  "created_at": "2025-01-08T10:00:00Z"
}
```

### POST /api/jobs
Tạo job mới (Employer only).

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "title": "Senior Backend Developer",
  "level": "senior",
  "experience_min": 3,
  "experience_max": 5,
  "salary_min": 25000000,
  "salary_max": 40000000,
  "salary_visible": true,
  "location": "TP.HCM",
  "work_type": "hybrid",
  "description": "Mô tả công việc...",
  "requirements": "Yêu cầu...",
  "benefits": "Quyền lợi...",
  "skill_ids": [1, 2, 5, 10],
  "deadline": "2025-02-28"
}
```

**Response (201):**
```json
{
  "message": "Tạo job thành công",
  "job": { ... }
}
```

### PUT /api/jobs/:id
Cập nhật job (Employer only, owner).

### DELETE /api/jobs/:id
Xóa job (Employer only, owner).

---

## 5.3 CV

### POST /api/cv/upload
Upload và parse CV.

**Headers:** `Authorization: Bearer <token>`

**Request:** `multipart/form-data`
- `file`: File CV (PDF, DOCX, PNG, JPG)

**Response (201):**
```json
{
  "message": "Upload và parse CV thành công",
  "cv": {
    "id": "uuid",
    "filename": "NguyenVanA_CV.pdf",
    "file_url": "https://...",
    "parsed": {
      "name": "Nguyễn Văn A",
      "email": "a.nguyen@gmail.com",
      "phone": "0912 345 678",
      "location": "TP.HCM",
      "positions": ["Senior Backend Developer"],
      "organizations": ["FPT Software", "Shopee"],
      "skills": ["Java", "Spring Boot", "PostgreSQL", "Docker"],
      "degrees": ["Kỹ sư CNTT"],
      "schools": ["Đại học Bách Khoa TP.HCM"]
    }
  }
}
```

### GET /api/cv/my
Lấy danh sách CV của tôi (Candidate only).

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "filename": "NguyenVanA_CV.pdf",
      "file_url": "https://...",
      "is_default": true,
      "uploaded_at": "2025-01-08T10:00:00Z",
      "parsed": { ... }
    }
  ]
}
```

### GET /api/cv/:id
Lấy chi tiết CV.

### PUT /api/cv/:id/default
Đặt CV làm mặc định.

### DELETE /api/cv/:id
Xóa CV.

---

## 5.4 Applications

### POST /api/applications
Nộp đơn ứng tuyển (Candidate only).

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "job_id": "uuid",
  "cv_id": "uuid"  // Optional, dùng CV default nếu không truyền
}
```

**Response (201):**
```json
{
  "message": "Nộp đơn thành công",
  "application": {
    "id": "uuid",
    "job_id": "uuid",
    "cv_id": "uuid",
    "match_score": 85.5,
    "status": "pending",
    "applied_at": "2025-01-08T10:00:00Z"
  }
}
```

### GET /api/applications/my
Lấy danh sách đơn của tôi (Candidate only).

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "job": {
        "id": "uuid",
        "title": "Senior Backend Developer",
        "company": {
          "name": "FPT Software",
          "logo_url": "https://..."
        }
      },
      "match_score": 85.5,
      "status": "pending",
      "applied_at": "2025-01-08T10:00:00Z"
    }
  ]
}
```

### GET /api/applications/job/:jobId
Lấy danh sách ứng viên của job (Employer only, owner).

**Query params:**
- `page`, `limit`
- `skills` - Filter theo skills
- `match_min` - Match score tối thiểu
- `status` - Filter theo status
- `sort` - 'match_desc', 'newest'

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "candidate": {
        "name": "Nguyễn Văn A",
        "email": "a.nguyen@gmail.com",
        "phone": "0912 345 678"
      },
      "cv_id": "uuid",
      "skills": ["Java", "Spring Boot", "PostgreSQL"],
      "match_score": 85.5,
      "status": "pending",
      "applied_at": "2025-01-08T10:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

### PUT /api/applications/:id/status
Cập nhật trạng thái đơn (Employer only).

**Request:**
```json
{
  "status": "accepted",  // "accepted" hoặc "rejected"
  "note": "Ghi chú..."   // Optional
}
```

---

## 5.5 Company

### GET /api/companies/:id
Lấy thông tin công ty (public).

### PUT /api/companies/my
Cập nhật thông tin công ty (Employer only).

---

## 5.6 Admin

### GET /api/admin/stats
Lấy thống kê tổng quan.

**Response (200):**
```json
{
  "total_candidates": 150,
  "total_employers": 25,
  "total_jobs": 45,
  "total_applications": 320,
  "jobs_by_level": {
    "intern": 5,
    "fresher": 10,
    "junior": 15,
    "senior": 12,
    "lead": 3
  }
}
```

### GET /api/admin/users
Lấy danh sách users.

### PUT /api/admin/users/:id
Cập nhật user (block/unblock).


---

# 6. NER SERVICE

## 6.1 Tổng quan

NER Service là microservice riêng biệt, chạy bằng FastAPI + Python, có nhiệm vụ:
- Nhận file CV (PDF, DOCX, Image)
- Trích xuất text từ file
- Chạy NER model để nhận diện entities
- Trả về JSON chuẩn hóa

## 6.2 Entities được nhận diện

| Entity | Mô tả | Ví dụ |
|--------|-------|-------|
| NAME | Họ tên | Nguyễn Văn A |
| EMAIL | Email | a.nguyen@gmail.com |
| PHONE | Số điện thoại | 0912 345 678 |
| POSITION | Vị trí/Chức vụ | Senior Backend Developer |
| ORG | Tổ chức/Công ty | FPT Software, Shopee |
| SKILL | Kỹ năng | Java, Spring Boot, Docker |
| YEAR | Năm/Khoảng thời gian | 2020-2024 |
| DEGREE | Bằng cấp | Kỹ sư CNTT, Thạc sĩ |
| SCHOOL | Trường học | Đại học Bách Khoa |
| LOC | Địa điểm | TP.HCM, Hà Nội |

## 6.3 API Endpoints

### POST /extract
Parse CV từ file.

**Request:** `multipart/form-data`
- `file`: File CV

**Response (200):**
```json
{
  "success": true,
  "data": {
    "name": ["Nguyễn Văn A"],
    "email": ["a.nguyen@gmail.com"],
    "phone": ["0912 345 678"],
    "position": ["Senior Backend Developer", "Software Engineer"],
    "organization": ["FPT Software", "Shopee"],
    "skills": ["Java", "Spring Boot", "PostgreSQL", "Docker", "AWS"],
    "education": {
      "degrees": ["Kỹ sư CNTT"],
      "schools": ["Đại học Bách Khoa TP.HCM"]
    },
    "experience": [
      {"position": "Senior Developer", "company": "Shopee", "period": "2021-2024"},
      {"position": "Backend Developer", "company": "FPT", "period": "2018-2021"}
    ],
    "location": ["TP.HCM"]
  },
  "raw_entities": {
    "NAME": ["Nguyễn Văn A"],
    "EMAIL": ["a.nguyen@gmail.com"],
    ...
  },
  "raw_text": "Nội dung text trích xuất từ CV..."
}
```

### POST /extract-text
Parse CV từ text thuần.

**Request:** `application/x-www-form-urlencoded`
- `text`: Nội dung CV dạng text

### GET /health
Health check.

**Response:**
```json
{
  "status": "healthy",
  "model": "./cv_ner_model_final"
}
```

## 6.4 Xử lý file

| File type | Thư viện | Mô tả |
|-----------|----------|-------|
| PDF | PyPDF2 | Trích xuất text từ PDF |
| DOCX | python-docx | Trích xuất text từ Word |
| Image | EasyOCR | OCR nhận diện text từ ảnh |

## 6.5 Model

- **Base model:** XLM-RoBERTa (multilingual)
- **Fine-tuned:** Trên dataset CV tiếng Việt + tiếng Anh
- **F1-score:** ~95%

---

# 7. GIAO DIỆN NGƯỜI DÙNG

## 7.1 Cấu trúc thư mục Frontend

```
frontend/
├── app/                      # Next.js App Router
│   ├── (public)/             # Public pages
│   │   ├── page.tsx          # Trang chủ
│   │   ├── jobs/
│   │   │   ├── page.tsx      # Danh sách jobs
│   │   │   └── [id]/page.tsx # Chi tiết job
│   │   ├── companies/
│   │   │   └── [id]/page.tsx # Trang công ty
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   │
│   ├── (candidate)/          # Candidate dashboard
│   │   ├── dashboard/page.tsx
│   │   ├── profile/page.tsx
│   │   ├── cv/page.tsx
│   │   ├── jobs/page.tsx
│   │   └── applications/page.tsx
│   │
│   ├── (employer)/           # Employer dashboard
│   │   ├── dashboard/page.tsx
│   │   ├── company/page.tsx
│   │   ├── jobs/
│   │   │   ├── page.tsx      # Danh sách jobs
│   │   │   ├── new/page.tsx  # Tạo job
│   │   │   └── [id]/
│   │   │       ├── edit/page.tsx
│   │   │       └── applicants/page.tsx  # DataGrid ứng viên
│   │
│   ├── (admin)/              # Admin dashboard
│   │   ├── dashboard/page.tsx
│   │   └── users/page.tsx
│   │
│   └── api/                  # API routes (nếu cần)
│
├── components/
│   ├── common/               # Shared components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   └── Loading.tsx
│   ├── jobs/
│   │   ├── JobCard.tsx
│   │   ├── JobList.tsx
│   │   ├── JobFilter.tsx
│   │   └── JobForm.tsx
│   ├── cv/
│   │   ├── CVUpload.tsx
│   │   ├── CVParsedView.tsx
│   │   └── CVList.tsx
│   └── applicants/
│       ├── ApplicantDataGrid.tsx
│       ├── ApplicantDetail.tsx
│       └── ApplicantFilter.tsx
│
├── lib/
│   ├── api.ts                # API client
│   ├── auth.ts               # Auth utilities
│   └── utils.ts
│
├── store/                    # Redux store
│   ├── store.ts
│   ├── authSlice.ts
│   └── jobSlice.ts
│
└── types/                    # TypeScript types
    ├── user.ts
    ├── job.ts
    ├── cv.ts
    └── application.ts
```

## 7.2 Responsive Design

- **Desktop:** Full layout với sidebar
- **Tablet:** Collapsible sidebar
- **Mobile:** Bottom navigation, stacked layout

## 7.3 UI Components chính

### JobCard
```tsx
<JobCard
  title="Senior Backend Developer"
  company="FPT Software"
  logo="/logo.png"
  location="TP.HCM"
  salary="25-40 triệu"
  skills={["Java", "Spring Boot"]}
  postedAt="2 ngày trước"
/>
```

### ApplicantDataGrid
```tsx
<ApplicantDataGrid
  jobId="uuid"
  columns={["name", "email", "skills", "matchScore", "status"]}
  filters={{ skills: ["Java"], matchMin: 70 }}
  onAccept={(id) => ...}
  onReject={(id) => ...}
/>
```

### CVUpload
```tsx
<CVUpload
  onUploadSuccess={(cv) => ...}
  onUploadError={(error) => ...}
  acceptedTypes={[".pdf", ".docx", ".png", ".jpg"]}
/>
```

---

# 8. HƯỚNG DẪN TRIỂN KHAI

## 8.1 Yêu cầu hệ thống

- Node.js >= 18
- Python >= 3.9
- PostgreSQL >= 14
- RAM >= 4GB (cho NER model)

## 8.2 Cài đặt Development

### Backend (NestJS)
```bash
cd backend
npm install
cp .env.example .env
# Sửa .env với database credentials
npm run start:dev
```

### Frontend (Next.js)
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

### NER Service (FastAPI)
```bash
cd ner-service
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python app.py
```

### Database
```bash
# Tạo database
createdb job_platform

# Chạy schema
psql -d job_platform -f database.sql
```

## 8.3 Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:pass@localhost:5432/job_platform
JWT_SECRET=your-secret-key
NER_SERVICE_URL=http://localhost:8000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

## 8.4 Production Deployment

### Docker Compose
```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:4000/api

  backend:
    build: ./backend
    ports:
      - "4000:4000"
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres:5432/job_platform
      - NER_SERVICE_URL=http://ner-service:8000
    depends_on:
      - postgres

  ner-service:
    build: ./ner-service
    ports:
      - "8000:8000"

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=job_platform
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

# 9. TIMELINE

| Tuần | Công việc |
|------|-----------|
| 1 | Setup project structure, Database schema |
| 2 | Auth module (register, login, JWT) |
| 3 | Company & Candidate profile |
| 4 | Job CRUD, Job listing page |
| 5 | CV upload, tích hợp NER Service |
| 6 | CV parsing, lưu parsed data |
| 7 | Application flow, Match score |
| 8 | Employer DataGrid, filter/sort |
| 9 | Candidate dashboard, apply job |
| 10 | Admin dashboard |
| 11 | UI polish, responsive |
| 12 | Testing, bug fixes, deploy |

**Tổng: 12 tuần**
