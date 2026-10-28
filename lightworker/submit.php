<?php
/**
 * Lightworker Welcome Page - Form Submission Handler
 * Handles all 3 forms: Self-check, Call Request, Founding Member
 * Saves to Neon PostgreSQL and sends emails via Maildog.io SMTP
 */

// Prevent direct access
define('SECURE_ACCESS', true);

// Configuration
$config = [
    // Neon Database
    'db_url' => 'postgresql://neondb_owner:npg_iDL9f6QFNaOJ@ep-red-bread-za4sgjj2-pooler.c-2.eu-west-2.aws.neon.tech/Welcome?sslmode=require&channel_binding=require',
    
    // SiteGround Email SMTP
    'smtp_host' => 'mail.lightworkercoach.co.uk',
    'smtp_port' => 465,
    'smtp_secure' => true, // true for port 465 (SMTPS)
    'smtp_user' => 'hello@lightworkercoach.co.uk',
    'smtp_pass' => 'YOUR_EMAIL_PASSWORD_HERE', // Update with actual password
    'from_email' => 'hello@lightworkercoach.co.uk',
    'from_name' => 'The Lightworker Coach',
    'admin_email' => 'peter@lightworkercoach.co.uk',
];

// CORS headers
header('Access-Control-Allow-Origin: https://lightworkercoach.co.uk');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get form type
$formType = isset($_POST['form_type']) ? sanitize($_POST['form_type']) : '';

try {
    $db = connectDB($config['db_url']);
    
    switch ($formType) {
        case 'selfcheck':
            handleSelfCheck($db, $config);
            break;
        case 'call':
            handleCallRequest($db, $config);
            break;
        case 'founding':
            handleFoundingMember($db, $config);
            break;
        default:
            throw new Exception('Invalid form type');
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

/**
 * Connect to Neon PostgreSQL
 */
function connectDB($dbUrl) {
    $parsed = parse_url($dbUrl);
    $dsn = sprintf(
        "pgsql:host=%s;port=%d;dbname=%s;sslmode=require",
        $parsed['host'],
        isset($parsed['port']) ? $parsed['port'] : 5432,
        ltrim($parsed['path'], '/')
    );
    
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];
    
    parse_str($parsed['query'] ?? '', $queryParams);
    $dsn .= isset($queryParams['sslmode']) ? ";sslmode=" . $queryParams['sslmode'] : ";sslmode=require";
    
    return new PDO($dsn, $parsed['user'], $parsed['pass'], $options);
}

/**
 * Sanitize input
 */
function sanitize($data) {
    if (is_array($data)) {
        return array_map('sanitize', $data);
    }
    return htmlspecialchars(strip_tags(trim($data)), ENT_QUOTES, 'UTF-8');
}

/**
 * Handle Self-Check Form
 */
function handleSelfCheck($db, $config) {
    $firstName = isset($_POST['first_name']) ? sanitize($_POST['first_name']) : '';
    $email = isset($_POST['email']) ? filter_var($_POST['email'], FILTER_SANITIZE_EMAIL) : '';
    $marketingConsent = isset($_POST['marketing_consent']) ? true : false;
    
    if (empty($firstName) || empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Please provide a valid name and email address.');
    }
    
    // Insert into database
    $stmt = $db->prepare("
        INSERT INTO self_check_submissions (first_name, email, marketing_consent, ip_address, user_agent)
        VALUES (:first_name, :email, :marketing_consent, :ip_address, :user_agent)
        ON CONFLICT (email) DO UPDATE SET 
            marketing_consent = EXCLUDED.marketing_consent,
            submitted_at = CURRENT_TIMESTAMP
    ");
    
    $stmt->execute([
        ':first_name' => $firstName,
        ':email' => $email,
        ':marketing_consent' => $marketingConsent ? 'true' : 'false',
        ':ip_address' => $_SERVER['REMOTE_ADDR'] ?? null,
        ':user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? null,
    ]);
    
    // Send confirmation email to user
    sendEmail($config, $email, $firstName, 'selfcheck_user', []);
    
    // Send notification to admin
    sendEmail($config, $config['admin_email'], 'Peter', 'selfcheck_admin', [
        'first_name' => $firstName,
        'email' => $email,
        'marketing_consent' => $marketingConsent ? 'Yes' : 'No'
    ]);
    
    echo json_encode(['success' => true, 'message' => 'Thank you! Your self-check is on its way.']);
}

/**
 * Handle Call Request Form
 */
function handleCallRequest($db, $config) {
    $firstName = isset($_POST['first_name']) ? sanitize($_POST['first_name']) : '';
    $email = isset($_POST['email']) ? filter_var($_POST['email'], FILTER_SANITIZE_EMAIL) : '';
    $phone = isset($_POST['phone']) ? sanitize($_POST['phone']) : null;
    $helpWith = isset($_POST['help_with']) ? sanitize($_POST['help_with']) : null;
    
    if (empty($firstName) || empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Please provide a valid name and email address.');
    }
    
    // Insert into database
    $stmt = $db->prepare("
        INSERT INTO call_requests (first_name, email, phone, help_with, ip_address, user_agent)
        VALUES (:first_name, :email, :phone, :help_with, :ip_address, :user_agent)
        ON CONFLICT (email) DO UPDATE SET 
            phone = EXCLUDED.phone,
            help_with = EXCLUDED.help_with,
            submitted_at = CURRENT_TIMESTAMP
    ");
    
    $stmt->execute([
        ':first_name' => $firstName,
        ':email' => $email,
        ':phone' => $phone,
        ':help_with' => $helpWith,
        ':ip_address' => $_SERVER['REMOTE_ADDR'] ?? null,
        ':user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? null,
    ]);
    
    // Send confirmation email to user
    sendEmail($config, $email, $firstName, 'call_user', ['first_name' => $firstName]);
    
    // Send notification to admin
    sendEmail($config, $config['admin_email'], 'Peter', 'call_admin', [
        'first_name' => $firstName,
        'email' => $email,
        'phone' => $phone ?: 'Not provided',
        'help_with' => $helpWith ?: 'Not provided'
    ]);
    
    echo json_encode(['success' => true, 'message' => 'Thank you! I\'ll be in touch within two working days.']);
}

/**
 * Handle Founding Member Form
 */
function handleFoundingMember($db, $config) {
    $firstName = isset($_POST['first_name']) ? sanitize($_POST['first_name']) : '';
    $lastName = isset($_POST['last_name']) ? sanitize($_POST['last_name']) : '';
    $email = isset($_POST['email']) ? filter_var($_POST['email'], FILTER_SANITIZE_EMAIL) : '';
    $address1 = isset($_POST['address_1']) ? sanitize($_POST['address_1']) : '';
    $address2 = isset($_POST['address_2']) ? sanitize($_POST['address_2']) : null;
    $town = isset($_POST['town']) ? sanitize($_POST['town']) : '';
    $postcode = isset($_POST['postcode']) ? sanitize($_POST['postcode']) : '';
    $country = isset($_POST['country']) ? sanitize($_POST['country']) : '';
    $letterTopics = isset($_POST['letter_topics']) ? sanitize($_POST['letter_topics']) : null;
    $reserveConfirm = isset($_POST['reserve_confirm']) ? true : false;
    $marketingConsent = isset($_POST['marketing_consent']) ? true : false;
    
    if (empty($firstName) || empty($lastName) || empty($email) || empty($address1) || 
        empty($town) || empty($postcode) || empty($country) || !$reserveConfirm ||
        !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Please fill in all required fields and confirm your reservation.');
    }
    
    // Insert into database
    $stmt = $db->prepare("
        INSERT INTO founding_members (
            first_name, last_name, email, address_1, address_2, town, postcode, country, 
            letter_topics, reserve_confirm, marketing_consent, ip_address, user_agent
        )
        VALUES (
            :first_name, :last_name, :email, :address_1, :address_2, :town, :postcode, :country,
            :letter_topics, :reserve_confirm, :marketing_consent, :ip_address, :user_agent
        )
        ON CONFLICT (email) DO UPDATE SET 
            first_name = EXCLUDED.first_name,
            last_name = EXCLUDED.last_name,
            address_1 = EXCLUDED.address_1,
            address_2 = EXCLUDED.address_2,
            town = EXCLUDED.town,
            postcode = EXCLUDED.postcode,
            country = EXCLUDED.country,
            letter_topics = EXCLUDED.letter_topics,
            marketing_consent = EXCLUDED.marketing_consent,
            submitted_at = CURRENT_TIMESTAMP
    ");
    
    $stmt->execute([
        ':first_name' => $firstName,
        ':last_name' => $lastName,
        ':email' => $email,
        ':address_1' => $address1,
        ':address_2' => $address2,
        ':town' => $town,
        ':postcode' => $postcode,
        ':country' => $country,
        ':letter_topics' => $letterTopics,
        ':reserve_confirm' => $reserveConfirm ? 'true' : 'false',
        ':marketing_consent' => $marketingConsent ? 'true' : 'false',
        ':ip_address' => $_SERVER['REMOTE_ADDR'] ?? null,
        ':user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? null,
    ]);
    
    // Send confirmation email to user
    sendEmail($config, $email, $firstName, 'founding_user', [
        'first_name' => $firstName,
        'last_name' => $lastName
    ]);
    
    // Send notification to admin
    sendEmail($config, $config['admin_email'], 'Peter', 'founding_admin', [
        'first_name' => $firstName,
        'last_name' => $lastName,
        'email' => $email,
        'address_1' => $address1,
        'address_2' => $address2 ?: '',
        'town' => $town,
        'postcode' => $postcode,
        'country' => $country,
        'letter_topics' => $letterTopics ?: 'None specified',
        'marketing_consent' => $marketingConsent ? 'Yes' : 'No'
    ]);
    
    echo json_encode(['success' => true, 'message' => 'Welcome! Your founding place is reserved at £29 a month.']);
}

/**
 * Send email using Maildog.io SMTP
 */
function sendEmail($config, $to, $toName, $template, $data = []) {
    // Use PHPMailer if available
    if (file_exists(__DIR__ . '/vendor/autoload.php')) {
        require_once __DIR__ . '/vendor/autoload.php';
        $mail = new PHPMailer\PHPMailer\PHPMailer(true);
        
        try {
            $mail->isSMTP();
            $mail->Host = $config['smtp_host'];
            $mail->SMTPAuth = true;
            $mail->Username = $config['smtp_user'];
            $mail->Password = $config['smtp_pass'];
            $mail->SMTPSecure = $config['smtp_secure'] ? PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS : false;
            $mail->Port = $config['smtp_port'];
            $mail->SMTPAutoTLS = false;
            
            $mail->setFrom($config['from_email'], $config['from_name']);
            $mail->addAddress($to, $toName);
            
            list($subject, $body) = getEmailTemplate($template, $data, $config);
            $mail->Subject = $subject;
            $mail->isHTML(true);
            $mail->Body = $body;
            $mail->AltBody = strip_tags(str_replace(['<br>', '<br/>', '<br />'], "\n", $body));
            
            $mail->send();
            return true;
        } catch (Exception $e) {
            error_log("Email error: " . $mail->ErrorInfo);
            return false;
        }
    } else {
        // Fallback to basic mail() if PHPMailer not available
        list($subject, $body) = getEmailTemplate($template, $data, $config);
        $headers = "MIME-Version: 1.0\r\n";
        $headers .= "Content-type: text/html; charset=UTF-8\r\n";
        $headers .= "From: {$config['from_name']} <{$config['from_email']}>\r\n";
        return @mail($to, $subject, $body, $headers);
    }
}

/**
 * Get email templates matching website design
 */
function getEmailTemplate($template, $data, $config) {
    $siteUrl = 'https://lightworkercoach.co.uk';
    $privacyUrl = $siteUrl . '/privacy';
    
    $header = '
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet">
    </head>
    <body style="margin: 0; padding: 0; background-color: #ffffff; font-family: \'Jost\', -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff;">
            <tr>
                <td align="center" style="padding: 40px 20px;">
                    <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff;">
                        <!-- Header -->
                        <tr>
                            <td align="center" style="padding-bottom: 40px;">
                                <table cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="width: 40px; height: 40px; border-radius: 50%; border: 1px solid rgba(166, 124, 43, 0.5); background-color: rgba(217, 177, 85, 0.1); text-align: center; vertical-align: middle;">
                                            <span style="color: #d9b155; font-size: 20px;">☀</span>
                                        </td>
                                        <td style="padding-left: 12px;">
                                            <span style="font-family: \'Cormorant Garamond\', serif; font-size: 18px; font-weight: 600; color: #1a1814; letter-spacing: 0.02em;">The Lightworker Coach</span>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
    ';
    
    $footer = '
                        <!-- Footer -->
                        <tr>
                            <td align="center" style="padding-top: 40px; border-top: 1px solid #f0f0f0; margin-top: 40px;">
                                <p style="font-family: \'Cormorant Garamond\', serif; font-size: 16px; font-weight: 600; color: #1a1814; margin: 0 0 12px 0;">
                                    The Lightworker Coach · Helping those who help others
                                </p>
                                <p style="margin: 0 0 12px 0;">
                                    <a href="mailto:' . $config['admin_email'] . '" style="color: #a67c2b; text-decoration: underline;">' . $config['admin_email'] . '</a>
                                </p>
                                <p style="color: #666666; font-size: 13px; margin: 0;">
                                    <a href="' . $privacyUrl . '" style="color: #666666; text-decoration: underline;">Privacy notice</a> · © 2026 Lightworker Coach Limited
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    ';
    
    switch ($template) {
        case 'selfcheck_user':
            $subject = 'Your self-check is here';
            $body = $header . '
                        <tr>
                            <td style="padding-bottom: 30px;">
                                <p style="color: #2d2a24; font-size: 16px; line-height: 1.7; margin: 0 0 20px 0;">
                                    Dear ' . $data['first_name'] . ',
                                </p>
                                <p style="color: #2d2a24; font-size: 16px; line-height: 1.7; margin: 0 0 20px 0;">
                                    Thank you for patiently listening to me on Friday’s call, and for asking for the self-check. You’ll find it attached.
                                </p>
                                <p style="color: #2d2a24; font-size: 16px; line-height: 1.7; margin: 0 0 20px 0;">
                                    Take ten quiet minutes with it. There are no right or wrong answers. Just an honest look at where your practice is today, and the next gentle step.
                                </p>
                                <p style="color: #2d2a24; font-size: 16px; line-height: 1.7; margin: 0 0 20px 0;">
                                    If you’d like to talk it through, simply reply to this email.
                                </p>
                                <p style="color: #2d2a24; font-size: 16px; line-height: 1.7; margin: 30px 0 0 0;">
                                    With love and light,<br>
                                    Peter
                                </p>
                            </td>
                        </tr>
            ' . $footer;
            break;
            
        case 'selfcheck_admin':
            $subject = 'New Self-Check Request';
            $body = $header . '
                        <tr>
                            <td style="padding-bottom: 30px;">
                                <h1 style="font-family: \'Cormorant Garamond\', serif; font-size: 28px; font-weight: 600; color: #1a1814; margin: 0 0 20px 0;">
                                    New Self-Check Request
                                </h1>
                                <table width="100%" cellpadding="10" cellspacing="0" style="background-color: #f8f7f5; border: 1px solid #e8e6e1; border-radius: 12px; margin: 20px 0;">
                                    <tr>
                                        <td style="color: #666666; font-size: 14px; width: 40%;">First Name:</td>
                                        <td style="color: #1a1814; font-size: 14px; font-weight: 500;">' . $data['first_name'] . '</td>
                                    </tr>
                                    <tr>
                                        <td style="color: #666666; font-size: 14px;">Email:</td>
                                        <td style="color: #1a1814; font-size: 14px;"><a href="mailto:' . $data['email'] . '" style="color: #a67c2b;">' . $data['email'] . '</a></td>
                                    </tr>
                                    <tr>
                                        <td style="color: #666666; font-size: 14px;">Marketing Consent:</td>
                                        <td style="color: #1a1814; font-size: 14px;">' . $data['marketing_consent'] . '</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
            ' . $footer;
            break;
            
        case 'call_user':
            $subject = 'Your free call with Peter';
            $body = $header . '
                        <tr>
                            <td style="padding-bottom: 30px;">
                                <p style="color: #2d2a24; font-size: 16px; line-height: 1.7; margin: 0 0 20px 0;">
                                    Dear ' . $data['first_name'] . ',
                                </p>
                                <p style="color: #2d2a24; font-size: 16px; line-height: 1.7; margin: 0 0 20px 0;">
                                    Thank you for asking for a call. I’ll email you within two working days with some times to choose from. I’m looking forward to hearing about your practice.
                                </p>
                                <p style="color: #2d2a24; font-size: 16px; line-height: 1.7; margin: 30px 0 0 0;">
                                    With love and light,<br>
                                    Peter
                                </p>
                            </td>
                        </tr>
            ' . $footer;
            break;
            
        case 'call_admin':
            $subject = 'New Free Call Request';
            $body = $header . '
                        <tr>
                            <td style="padding-bottom: 30px;">
                                <h1 style="font-family: \'Cormorant Garamond\', serif; font-size: 28px; font-weight: 600; color: #1a1814; margin: 0 0 20px 0;">
                                    New Free Call Request
                                </h1>
                                <table width="100%" cellpadding="10" cellspacing="0" style="background-color: #f8f7f5; border: 1px solid #e8e6e1; border-radius: 12px; margin: 20px 0;">
                                    <tr>
                                        <td style="color: #666666; font-size: 14px; width: 40%;">First Name:</td>
                                        <td style="color: #1a1814; font-size: 14px; font-weight: 500;">' . $data['first_name'] . '</td>
                                    </tr>
                                    <tr>
                                        <td style="color: #666666; font-size: 14px;">Email:</td>
                                        <td style="color: #1a1814; font-size: 14px;"><a href="mailto:' . $data['email'] . '" style="color: #a67c2b;">' . $data['email'] . '</a></td>
                                    </tr>
                                    <tr>
                                        <td style="color: #666666; font-size: 14px;">Phone:</td>
                                        <td style="color: #1a1814; font-size: 14px;">' . $data['phone'] . '</td>
                                    </tr>
                                    <tr>
                                        <td style="color: #666666; font-size: 14px; vertical-align: top;">Help With:</td>
                                        <td style="color: #1a1814; font-size: 14px; line-height: 1.6;">' . nl2br($data['help_with']) . '</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
            ' . $footer;
            break;
            
        case 'founding_user':
            $subject = 'Your founding place is reserved';
            $body = $header . '
                        <tr>
                            <td style="padding-bottom: 30px;">
                                <p style="color: #2d2a24; font-size: 16px; line-height: 1.7; margin: 0 0 20px 0;">
                                    Dear ' . $data['first_name'] . ',
                                </p>
                                <p style="color: #2d2a24; font-size: 16px; line-height: 1.7; margin: 0 0 20px 0;">
                                    Thank you. Your place as a founding member of my monthly letter is reserved, at £29 a month, locked in for as long as you stay.
                                </p>
                                <p style="color: #2d2a24; font-size: 16px; line-height: 1.7; margin: 0 0 20px 0;">
                                    There’s nothing to pay now. In December I’ll email you a simple link to set up your monthly payment, and your first letter will arrive in January 2027.
                                </p>
                                <p style="color: #2d2a24; font-size: 16px; line-height: 1.7; margin: 0 0 20px 0;">
                                    If anything changes for you before then, just reply to this email.
                                </p>
                                <p style="color: #2d2a24; font-size: 16px; line-height: 1.7; margin: 30px 0 0 0;">
                                    With love and light,<br>
                                    Peter
                                </p>
                            </td>
                        </tr>
            ' . $footer;
            break;
            
        case 'founding_admin':
            $subject = 'New Founding Member Reservation';
            $body = $header . '
                        <tr>
                            <td style="padding-bottom: 30px;">
                                <h1 style="font-family: \'Cormorant Garamond\', serif; font-size: 28px; font-weight: 600; color: #1a1814; margin: 0 0 20px 0;">
                                    New Founding Member Reservation
                                </h1>
                                <table width="100%" cellpadding="10" cellspacing="0" style="background-color: #f8f1e6; border: 1px solid #eadbc4; border-radius: 12px; margin: 20px 0;">
                                    <tr>
                                        <td style="color: #666666; font-size: 14px; width: 40%;">Name:</td>
                                        <td style="color: #1a1814; font-size: 14px; font-weight: 500;">' . $data['first_name'] . ' ' . $data['last_name'] . '</td>
                                    </tr>
                                    <tr>
                                        <td style="color: #666666; font-size: 14px;">Email:</td>
                                        <td style="color: #1a1814; font-size: 14px;"><a href="mailto:' . $data['email'] . '" style="color: #a67c2b;">' . $data['email'] . '</a></td>
                                    </tr>
                                    <tr>
                                        <td style="color: #666666; font-size: 14px; vertical-align: top;">Address:</td>
                                        <td style="color: #1a1814; font-size: 14px; line-height: 1.6;">
                                            ' . $data['address_1'] . '<br>
                                            ' . ($data['address_2'] ? $data['address_2'] . '<br>' : '') . '
                                            ' . $data['town'] . '<br>
                                            ' . $data['postcode'] . '<br>
                                            ' . $data['country'] . '
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="color: #666666; font-size: 14px; vertical-align: top;">What would you love me to write about:</td>
                                        <td style="color: #1a1814; font-size: 14px; line-height: 1.6;">' . nl2br($data['letter_topics']) . '</td>
                                    </tr>
                                    <tr>
                                        <td style="color: #666666; font-size: 14px;">Marketing Consent:</td>
                                        <td style="color: #1a1814; font-size: 14px;">' . $data['marketing_consent'] . '</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
            ' . $footer;
            break;
            
        default:
            $subject = 'Form Submission';
            $body = $header . '<tr><td><p>Form submission received.</p></td></tr>' . $footer;
            break;
    }
    
    return [$subject, $body];
}
?>
