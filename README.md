# Task Management System

A full-stack task management application built using Django REST Framework and React.

##  Features
- User Registration & Login (JWT Authentication)
- Create, Update, Delete Tasks
- Task Status Filtering
- Pagination
- Auto Refresh Token Handling
- Responsive UI using Tailwind
- Dockerized Setup

## 🛠 Tech Stack
**Backend:** Django, DRF, JWT  
**Frontend:** React (Hooks), Tailwind  
**Database:** SQLite / PostgreSQL  
**Auth:** JWT (Access + Refresh Tokens)  
**Containerization:** Docker

---

##  Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

---

##  Frontend Setup

```bash
cd frontend
npm install
npm dev

---

##  Docker Setup

```bash
docker-compose up --build
---
