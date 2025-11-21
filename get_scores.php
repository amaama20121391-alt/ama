<?php
// ... (تنظیمات هدر) ...

// --- تنظیمات اتصال (تغییر دهید) ---
$servername = "localhost";
$username = "root";
$password = "your_db_password";
$dbname = "grade_management_db";

try {
    // ... (کد اتصال PDO و اجرای کوئری SELECT) ...

    // دریافت تمام نمرات
    $stmt = $conn->prepare("SELECT * FROM scores");
    $stmt->execute();
    $db_scores = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // ... (کد تبدیل فرمت دیتابیس به فرمت جاوااسکریپت) ...

    // ارسال داده‌ها به جاوااسکریپت
    echo json_encode(['status' => 'success', 'classes' => $formatted_classes]);

} catch (PDOException $e) {
    // ... (مدیریت خطا) ...
}
?>