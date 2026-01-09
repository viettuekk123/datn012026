# API Documentation cho Frontend

> **Base URL**: `http://localhost:4000/api`  
> **Swagger Docs**: `http://localhost:4000/api/docs`  
> **Static Files**: `http://localhost:4000/uploads/cvs/{filename}`

---

## 🔐 Authentication

Tất cả API protected yêu cầu header:
```
Authorization: Bearer <access_token>
```

### POST /auth/register
Đăng ký tài khoản mới.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "candidate"  // "candidate" | "employer"
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

---

### POST /auth/login

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
  "access_token": "eyJhbGciOiJIUzI1...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "candidate"
  }
}
```

---

### GET /auth/me 🔒

Lấy thông tin user hiện tại.

**Response (200):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "role": "candidate",
  "candidateProfile": { ... },
  "company": null
}
```

---

## 👤 Profile (Candidate Only)

### GET /profile/me 🔒

**Response:**
```json
{
  "id": "uuid",
  "fullName": "Nguyễn Văn A",
  "phone": "0912345678",
  "location": "TP.HCM",
  "title": "Backend Developer",
  "experienceYears": 3,
  "expectedSalary": 25000000,
  "workType": "hybrid",
  "bio": "Giới thiệu bản thân..."
}
```

---

### PUT /profile/me 🔒

**Request:**
```json
{
  "fullName": "Nguyễn Văn A",
  "phone": "0912345678",
  "location": "TP.HCM",
  "title": "Backend Developer",
  "experienceYears": 3,
  "expectedSalary": 25000000,
  "workType": "hybrid",  // "onsite" | "remote" | "hybrid"
  "bio": "Giới thiệu bản thân..."
}
```

---

## 🏢 Companies

### GET /companies
Danh sách công ty (public).

**Query:** `page`, `limit`

---

### GET /companies/:id
Chi tiết công ty (public).

---

### GET /companies/my 🔒 (Employer)
Lấy thông tin công ty của tôi.

---

### PUT /companies/my 🔒 (Employer)

**Request:**
```json
{
  "name": "FPT Software",
  "logoUrl": "https://example.com/logo.png",
  "description": "Mô tả công ty...",
  "companySize": "1000+",
  "location": "Hà Nội, TP.HCM",
  "website": "https://fpt-software.com"
}
```

---

## 💼 Jobs

### GET /jobs
Danh sách jobs (public).

**Query Parameters:**
| Param | Type | Mô tả |
|-------|------|-------|
| page | number | Default: 1 |
| limit | number | Default: 10 |
| keyword | string | Tìm theo title, company |
| location | string | Filter địa điểm |
| level | string | intern, fresher, junior, middle, senior, lead |
| skills | string[] | Filter theo skills |
| salaryMin | number | Lương tối thiểu |
| salaryMax | number | Lương tối đa |
| workType | string | onsite, remote, hybrid |
| sort | string | newest, salary_desc |

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Senior Backend Developer",
      "level": "senior",
      "salaryMin": 25000000,
      "salaryMax": 40000000,
      "location": "TP.HCM",
      "workType": "hybrid",
      "skills": ["Java", "Spring Boot"],
      "company": {
        "id": "uuid",
        "name": "FPT Software",
        "logoUrl": "https://..."
      },
      "createdAt": "2025-01-08T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  }
}
```

---

### GET /jobs/:id
Chi tiết job (public).

---

### GET /jobs/my 🔒 (Employer)
Jobs của công ty tôi.

---

### POST /jobs 🔒 (Employer)

**Request:**
```json
{
  "title": "Senior Backend Developer",
  "level": "senior",
  "experienceMin": 3,
  "experienceMax": 5,
  "salaryMin": 25000000,
  "salaryMax": 40000000,
  "salaryVisible": true,
  "location": "TP.HCM",
  "workType": "hybrid",
  "description": "Mô tả công việc...",
  "requirements": "Yêu cầu ứng viên...",
  "benefits": "Quyền lợi...",
  "skillIds": [1, 2, 5],
  "deadline": "2025-02-28"
}
```

---

### PUT /jobs/:id 🔒 (Employer)
Cập nhật job. Thêm field `isActive: boolean` để đóng/mở job.

---

### DELETE /jobs/:id 🔒 (Employer)
Xóa job.

---

## 🎯 Skills

### GET /skills
Danh sách skills (public).

**Query:** `category` - Filter theo category

**Response:**
```json
[
  { "id": 1, "name": "Java", "category": "language" },
  { "id": 2, "name": "Spring Boot", "category": "framework" }
]
```

---

### GET /skills/categories

**Response:**
```json
{
  "data": ["language", "framework", "database", "devops", "tool", "other"]
}
```

---

## 📄 CV (Candidate Only)

### POST /cv/upload 🔒
Upload và parse CV với NER.

**Request:** `multipart/form-data`
- `file`: PDF, DOCX, PNG, JPG (max 10MB)

**Response (201):**
```json
{
  "message": "Upload và parse CV thành công",
  "cv": {
    "id": "uuid",
    "filename": "NguyenVanA_CV.pdf",
    "fileUrl": "/uploads/cvs/1704700000-NguyenVanA_CV.pdf",
    "parsed": {
      "name": "Nguyễn Văn A",
      "email": "a.nguyen@gmail.com",
      "phone": "0912 345 678",
      "location": "TP.HCM",
      "positions": ["Senior Backend Developer"],
      "organizations": ["FPT Software", "Shopee"],
      "degrees": ["Kỹ sư CNTT"],
      "schools": ["Đại học Bách Khoa TP.HCM"]
    }
  }
}
```

---

### GET /cv/my 🔒
Danh sách CV của tôi.

---

### GET /cv/:id 🔒
Chi tiết CV.

---

### PUT /cv/:id/default 🔒
Đặt CV làm mặc định.

---

### DELETE /cv/:id 🔒
Xóa CV.

---

## 📝 Applications

### POST /applications 🔒 (Candidate)
Nộp đơn ứng tuyển.

**Request:**
```json
{
  "jobId": "uuid",
  "cvId": "uuid"  // Optional, dùng CV default nếu không truyền
}
```

**Response:**
```json
{
  "message": "Nộp đơn thành công",
  "application": {
    "id": "uuid",
    "jobId": "uuid",
    "cvId": "uuid",
    "matchScore": 85.5,
    "status": "pending",
    "appliedAt": "2025-01-08T10:00:00Z"
  }
}
```

---

### GET /applications/my 🔒 (Candidate)
Danh sách đơn đã nộp.

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "job": {
        "id": "uuid",
        "title": "Senior Backend Developer",
        "company": { "name": "FPT Software", "logoUrl": "..." }
      },
      "matchScore": 85.5,
      "status": "pending",  // "pending" | "accepted" | "rejected"
      "appliedAt": "2025-01-08T10:00:00Z"
    }
  ]
}
```

---

### GET /applications/job/:jobId 🔒 (Employer)
Danh sách ứng viên của job.

**Query:**
| Param | Type | Mô tả |
|-------|------|-------|
| page | number | Default: 1 |
| limit | number | Default: 10 |
| skills | string[] | Filter theo skills |
| matchMin | number | Match score tối thiểu |
| status | string | pending, accepted, rejected |
| sort | string | match_desc, newest |

**Response:**
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
      "cvId": "uuid",
      "skills": ["Java", "Spring Boot"],
      "matchScore": 85.5,
      "status": "pending",
      "appliedAt": "2025-01-08T10:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

---

### PUT /applications/:id/status 🔒 (Employer)

**Request:**
```json
{
  "status": "accepted",  // "accepted" | "rejected"
  "note": "Ghi chú..."   // Optional
}
```

---

## 🔧 Admin (Admin Only)

### GET /admin/stats 🔒

**Response:**
```json
{
  "total_candidates": 150,
  "total_employers": 25,
  "total_jobs": 45,
  "total_applications": 320,
  "total_cvs": 180,
  "jobs_by_level": {
    "intern": 5,
    "fresher": 10,
    "junior": 15,
    "senior": 12,
    "lead": 3
  }
}
```

---

### GET /admin/users 🔒

**Query:** `page`, `limit`, `role`, `isActive`

---

### PUT /admin/users/:id 🔒

**Request:**
```json
{
  "isActive": false  // Block user
}
```

---

## 🔑 Roles

| Role | Quyền |
|------|-------|
| `candidate` | Profile, CV, Apply jobs |
| `employer` | Company, Jobs CRUD, Xem ứng viên |
| `admin` | Thống kê, Quản lý users |

---

## ⚠️ Error Responses

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

```json
{
  "statusCode": 403,
  "message": "Forbidden"
}
```

```json
{
  "statusCode": 404,
  "message": "Not Found"
}
```

---

## 🚀 Quick Start

1. Đăng ký: `POST /auth/register`
2. Đăng nhập: `POST /auth/login` → Lưu `access_token`
3. Gọi API với header `Authorization: Bearer <token>`

**Lưu ý:** 
- 🔒 = Cần authentication
- Upload file CV sẽ trả về `fileUrl`, truy cập file tại: `http://localhost:4000{fileUrl}`
