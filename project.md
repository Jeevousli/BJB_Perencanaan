# BJB Perencanaan - Document Management System

## Project Overview

Project ini merupakan aplikasi web internal Bank BJB untuk mengelola publikasi dokumen hasil riset/perencanaan.

Aplikasi memiliki dua role utama:

- Admin (Perencanaan)
- Viewer/Pegawai

Admin bertugas mengelola seluruh konten yang tampil pada website, sedangkan Viewer hanya dapat melihat, mencari, memfilter, membaca, dan mengunduh dokumen sesuai hak aksesnya.

---

## Tujuan Project

Membangun aplikasi enterprise berbasis web yang modern, scalable, dan mudah dikembangkan dengan arsitektur yang rapi.

Project ini bukan sekadar CRUD sederhana, tetapi akan dikembangkan seperti aplikasi internal perusahaan.

---

## Tech Stack

Frontend
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui

Backend
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL

Deployment
- AWS EC2
- AWS S3
- Nginx
- PM2
- GitHub Actions (CI/CD)

---

## Main Features

### Authentication

- Login
- JWT Authentication
- Role Based Access Control

---

### Admin

Admin dapat melakukan CRUD terhadap:

- Dokumen Publikasi
- Kategori
- Sub Kategori
- Banner Beranda
- Dashboard Image
- Master Menu
- Feedback

Admin dapat mengupload:

- PDF
- Image
- Video (jika diperlukan)

Semua field mengikuti requirement pada file Excel yang diberikan.

---

### Viewer

Viewer hanya dapat:

- Login
- Melihat dokumen
- Membaca PDF di browser
- Download dokumen
- Search
- Filter kategori
- Filter sub kategori
- Memberikan feedback

---

## Future Features

- Dynamic PDF Watermark
- Audit Log
- Dashboard Statistik
- Approval Workflow
- Versioning Dokumen
- AWS S3 Storage

---

## Coding Rules

Selalu gunakan best practice.

Gunakan Clean Architecture.

Pisahkan:

- Controller
- Service
- Repository
- Middleware
- Validator
- Config

Jangan menaruh business logic di Controller.

---

## AI Agent Rules

PENTING.

AI Agent BUKAN programmer utama.

AI Agent hanya berperan sebagai:

- Mentor
- Reviewer
- Code Reviewer
- Architecture Advisor
- Best Practice Advisor

AI Agent DILARANG:

- Menuliskan implementasi kode secara langsung.
- Menghasilkan file secara otomatis tanpa diminta.
- Mengambil alih pengerjaan project.

AI Agent HARUS:

- Menjelaskan konsep terlebih dahulu.
- Memberikan arahan langkah demi langkah.
- Memberikan checklist implementasi.
- Memberikan best practice.
- Menjelaskan alasan setiap keputusan arsitektur.
- Membantu debugging jika terjadi error.
- Mengarahkan developer untuk menulis kode sendiri.

Tujuan project ini adalah pembelajaran Software Engineering, bukan menghasilkan kode secara instan.