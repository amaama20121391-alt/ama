<?php
header("Content-Type: application/json; charset=utf-8");

$dataFile = "data.json";

function loadData() {
    global $dataFile;
    return json_decode(file_get_contents($dataFile), true);
}

function saveData($data) {
    global $dataFile;
    file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

$action = $_GET["action"] ?? "";

$data = loadData();


// 🔹 دریافت کل دیتا برای کلاینت
if ($action === "get") {
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}


// 🔹 ورود
if ($action === "login") {
    $code = $_POST["code"];

    // ورود ادمین/معلم
    if ($code === "admin") {
        echo json_encode(["role" => "admin"]);
        exit;
    }
    if ($code === "teacher") {
        echo json_encode(["role" => "teacher"]);
        exit;
    }

    // ورود دانش‌آموز با کد ملی
    foreach ($data["classes"] as $clsName => $students) {
        foreach ($students as $s) {
            if ($s["code"] === $code) {
                echo json_encode(["role" => "student", "class" => $clsName, "student" => $s], JSON_UNESCAPED_UNICODE);
                exit;
            }
        }
    }

    echo json_encode(["error" => "not_found"]);
    exit;
}


// 🔹 بروزرسانی نمره
if ($action === "updateScore") {
    $cls = $_POST["cls"];
    $code = $_POST["code"];
    $subject = $_POST["subject"];
    $score = $_POST["score"];

    foreach ($data["classes"][$cls] as &$student) {
        if ($student["code"] === $code) {
            $student["scores"][$subject] = $score;
        }
    }
    saveData($data);
    echo json_encode(["success" => true]);
    exit;
}


// 🔹 افزودن دانش‌آموز (فقط ادمین)
if ($action === "addStudent") {
    $cls = $_POST["class"];
    $name = $_POST["name"];
    $code = $_POST["code"];

    $newStudent = [
        "name" => $name,
        "code" => $code,
        "scores" => []
    ];

    foreach ($data["subjects"] as $sub)
        $newStudent["scores"][$sub] = "";

    $data["classes"][$cls][] = $newStudent;

    saveData($data);
    echo json_encode(["success" => true]);
    exit;
}



// 🔹 افزودن درس جدید (فقط ادمین)
if ($action === "addSubject") {
    $subject = $_POST["subject"];

    if (!in_array($subject, $data["subjects"])) {
        $data["subjects"][] = $subject;

        foreach ($data["classes"] as &$students) {
            foreach ($students as &$s) {
                $s["scores"][$subject] = "";
            }
        }
        saveData($data);
    }

    echo json_encode(["success" => true]);
    exit;
}

echo json_encode(["error" => "unknown_action"]);
