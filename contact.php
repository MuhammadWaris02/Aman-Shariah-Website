<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer-7.1.1/src/Exception.php';
require 'PHPMailer-7.1.1/src/PHPMailer.php';
require 'PHPMailer-7.1.1/src/SMTP.php';

// Database Connection
$conn = new mysqli("localhost", "root", "", "aman_website");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$mail = new PHPMailer(true);

try {

    // SMTP Settings
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'saqlainedu415@gmail.com';

    // Gmail App Password
    $mail->Password = 'jcrg xjng npje tzci';

    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    // Email Settings
    $mail->setFrom('saqlainedu415@gmail.com', 'Aman Shariah Advisory');
    $mail->addAddress('saqlainedu415@gmail.com');

    // File Attachment
    $fileName = "";

    if (isset($_FILES['upload']) && $_FILES['upload']['error'] == 0) {
        $fileName = $_FILES['upload']['name'];

        $mail->addAttachment(
            $_FILES['upload']['tmp_name'],
            $_FILES['upload']['name']
        );
    }

    // Email Body
    $mail->isHTML(true);
    $mail->Subject = "New Contact Form Submission";

    $mail->Body = "
    <h2>New Contact Request</h2>

    <b>Full Name:</b> " . $_POST['name'] . "<br><br>

    <b>Organisation:</b> " . $_POST['org'] . "<br><br>

    <b>Designation:</b> " . $_POST['designation'] . "<br><br>

    <b>Email:</b> " . $_POST['email'] . "<br><br>

    <b>Phone:</b> " . $_POST['phone'] . "<br><br>

    <b>Service:</b> " . $_POST['service'] . "<br><br>

    <b>Preferred Contact:</b> " . $_POST['contactMethod'] . "<br><br>

    <b>Description:</b><br>
    " . $_POST['desc'];

    // STEP 1: Send Email
    $mail->send();

    // STEP 2: Save to Database
    $stmt = $conn->prepare("INSERT INTO contacts
    (name, organisation, designation, email, phone, service, contact_method, description, file_name)
    VALUES (?,?,?,?,?,?,?,?,?)");

    $stmt->bind_param(
        "sssssssss",
        $_POST['name'],
        $_POST['org'],
        $_POST['designation'],
        $_POST['email'],
        $_POST['phone'],
        $_POST['service'],
        $_POST['contactMethod'],
        $_POST['desc'],
        $fileName
    );


if (!$stmt->execute()) {
    throw new Exception($stmt->error);
}

$stmt->close();


    // Success
    echo "
    <script>
        alert('Message Sent Successfully!');
        window.location='contact.html';
    </script>
    ";

} catch (Exception $e) {

    echo "
    <script>
        alert('Error: " . $mail->ErrorInfo . "');
        window.history.back();
    </script>
    ";

}

$conn->close();

?>