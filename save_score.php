<?php
// ... (تنظیمات هدر) ...

// --- تنظیمات اتصال به دیتابیس (تغییر دهید) ---
$servername = "localhost";
$username = "root";       
$password = "your_db_password"; 
$dbname = "grade_management_db"; 

// ... (دریافت و بررسی داده‌ها) ...

try {
    // ... (کد اتصال PDO و اجرای کوئری UPDATE) ...

    $sql = "UPDATE scores SET `{$subject}` = :score WHERE student_code = :code";
    
    // ... (بقیه کد PHP) ...

} catch (PDOException $e) {
    // ... (مدیریت خطا) ...
}
?>