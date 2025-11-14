<?php
namespace modules\enquiriesmodule;

use Craft;
use yii\base\Module;
use craft\elements\Entry;
use craft\mail\Message;

class EnquiriesModule extends Module
{
    public function init(): void
    {
        parent::init();
        Craft::info('✅ EnquiriesModule initialized', __METHOD__);
    }

    /**
     * Send an email for a new enquiry and mark the entry as emailed
     */
    public function handleNewEnquiry(Entry $entry): bool
    {
        try {
            // Get field values
            $firstName = $entry->firstName ?? '';
            $lastName = $entry->lastName ?? '';
            $emailAddress = $entry->emailAddress ?? '';
            $question = $entry->question ?? '';

            // --- 1️⃣ Send the email ---
            $mailer = Craft::$app->getMailer();
            $message = new Message();

            $htmlBody = $this->buildEmailHtml($entry);

            $message->setTo('charlie@welove9am.com') // 👈 change this to your recipient
                ->setFrom(['no-reply@dreams-careers.com' => 'Dreams Careers'])
                ->setSubject('New Enquiry Received')
                ->setHtmlBody($htmlBody);

            if (!$mailer->send($message)) {
                Craft::error('❌ Failed to send enquiry email for entry ID ' . $entry->id, __METHOD__);
                return false;
            }

            // --- 2️⃣ Update the entry to mark it as emailed ---
            $entry->setFieldValue('emailSend', true);
            $entry->enabled = true;

            if (!Craft::$app->getElements()->saveElement($entry)) {
                Craft::error('⚠️ Could not update emailSend field for entry ID ' . $entry->id, __METHOD__);
                return false;
            }

            Craft::info('✅ Enquiry email sent and entry updated: ' . $entry->id, __METHOD__);
            return true;

        } catch (\Throwable $e) {
            Craft::error('❌ Error in handleNewEnquiry: ' . $e->getMessage(), __METHOD__);
            return false;
        }
    }

    /**
     * Build the HTML email template
     */
    private function buildEmailHtml(Entry $entry): string
    {
        $logoUrl = Craft::$app->sites->currentSite->getBaseUrl() . 'backend/web/email-logo.png';
        $firstName = htmlspecialchars($entry->firstName ?? '');
        $lastName = htmlspecialchars($entry->lastName ?? '');
        $emailAddress = htmlspecialchars($entry->emailAddress ?? '');
        $question = nl2br(htmlspecialchars($entry->question ?? ''));

        return <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>New Enquiry</title>
<style>
  body { font-family: Arial, sans-serif; background:#f8f9fa; color:#333; }
  .container { max-width:600px; margin:40px auto; background:#fff; padding:30px; border-radius:8px; box-shadow:0 3px 10px rgba(0,0,0,.1); }
  h1 { color:#0046ad; }
  .footer { margin-top:30px; font-size:0.9em; color:#888; text-align:center; }
</style>
</head>
<body>
  <div class="container">
    <div style="text-align:center; margin-bottom:20px;">
      <img src="{$logoUrl}" alt="Dreams Careers" style="max-width:180px;">
    </div>
    <h1>New Enquiry Received</h1>
    <p><strong>Name:</strong> {$firstName} {$lastName}</p>
    <p><strong>Email:</strong> {$emailAddress}</p>
    <p><strong>Question:</strong></p>
    <p>{$question}</p>
    <div class="footer">
      This message was sent automatically from Dreams Careers Enquiry Form.
    </div>
  </div>
</body>
</html>
HTML;
    }
}
