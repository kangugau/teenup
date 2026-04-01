1. Mô tả chung
Xây dựng một ứng dụng web mini cho phép:
Quản lý thông tin Học sinh – Phụ huynh


Tạo và lên lịch Lớp học cho học sinh


Quản lý Subscription (gói học) cơ bản: khởi tạo, theo dõi buổi đã dùng/ còn lại
Ứng dụng không cần hoàn thiện 100% chức năng của LMS phức tạp, nhưng phải thể hiện rõ:
Database schema phù hợp


RESTful API cho các nghiệp vụ chính


Giao diện đơn giản để tương tác với API


Cấu trúc project rõ ràng, có CI/CD script (Dockerfile + script build/run)



2. Yêu cầu chi tiết
2.1. Database & Models
Thiết kế tối thiểu các bảng/collection:
Parents: id, name, phone, email


Students: id, name, dob, gender, current_grade, parent_id (relation)


Classes: id, name, subject, day_of_week, time_slot, teacher_name, max_students


ClassRegistrations: class_id, student_id


Subscriptions: id, student_id, package_name, start_date, end_date, total_sessions, used_sessions


2.2. API Endpoints
Cài đặt các route RESTful (JSON):
Parents


POST /api/parents – tạo phụ huynh


GET /api/parents/{id} – xem chi tiết


Students


POST /api/students – tạo học sinh (đính kèm parent_id)


GET /api/students/{id} – xem chi tiết, bao gồm thông tin parent


Classes


POST /api/classes – tạo lớp mới


GET /api/classes?day={weekday} – danh sách lớp theo ngày


ClassRegistrations


POST /api/classes/{class_id}/register – đăng ký học sinh vào lớp

Kiểm tra sĩ số: Không cho phép đăng ký nếu lớp đã đạt max_students.
Kiểm tra trùng lịch: Không cho phép học sinh đăng ký 2 lớp có khung giờ (time_slot) đè lên nhau trong cùng một ngày (day_of_week).
Kiểm tra gói học: Chỉ được đăng ký nếu expiry_date của gói học còn hiệu lực và used_sessions < total_sessions.


Kiểm tra trùng lịch: không cho student đăng ký khi đã có lớp khác vào cùng khung giờ

Hủy lịch có điều kiện (DELETE /api/registrations/{id}):
Nếu hủy trước giờ học > 24h: Hoàn trả 1 buổi vào gói học (used_sessions giảm 1).
Nếu hủy sát giờ (< 24h): Xóa đăng ký nhưng không hoàn buổi.

Subscriptions


POST /api/subscriptions – khởi tạo gói học


PATCH /api/subscriptions/{id}/use – đánh dấu đã dùng 1 buổi (giảm used_sessions)


GET /api/subscriptions/{id} – xem trạng thái gói (tổng vs. đã dùng)


2.3. Frontend
Yêu cầu tối thiểu:


Hiển thị form để tạo Parent & Student


Danh sách Classes theo tuần (bảng 7 ngày, show time_slot và teacher)


Cho phép đăng ký một học sinh vào một lớp (từ UI)


Giao diện đơn giản, sử dụng ReactJs hoặc NextJs


2.4. DevOps & CI/CD
Viết Dockerfile cho backend và frontend


Cung cấp script docker-compose.yml để chạy đồng thời backend + frontend + database (Postgres hoặc MongoDB)


Hướng dẫn ngắn gọn trong README.md để dựng môi trường và chạy thử