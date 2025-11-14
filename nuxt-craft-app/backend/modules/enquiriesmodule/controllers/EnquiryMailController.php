<?php
namespace modules\enquiriesmodule\controllers;

use Craft;
use craft\web\Controller;
use craft\elements\Entry;
use yii\web\Response;

class EnquiryMailController extends Controller
{
    // Allow public access (consider protecting with a token)
    protected array|int|bool $allowAnonymous = true;

    public function actionSend(): Response
    {
        $entries = Entry::find()
            ->section('enquiries')
            ->emailSend(false)
            ->all();

        $count = count($entries);

        if ($count === 0) {
            return $this->asHtmlResponse(
                'ℹ️ No new enquiries found.',
                'All enquiries have already been processed or emailed.'
            );
        }

        /** @var \modules\enquiriesmodule\EnquiriesModule $module */
        $module = Craft::$app->getModule('enquiriesmodule');

        foreach ($entries as $entry) {
            $module->handleNewEnquiry($entry);
        }

        return $this->asHtmlResponse(
            '✅ Enquiry Emails Sent Successfully',
            "<strong>{$count}</strong> entr" . ($count === 1 ? 'y' : 'ies') . " processed and marked as emailed."
        );
    }

    /**
     * Build a simple styled HTML page and return it as a RAW HTML response.
     */
    private function asHtmlResponse(string $title, string $message): Response
    {
        $html = <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>{$title}</title>
  <style>
    body { font-family: Arial, sans-serif; background:#f7f7f7; margin:0; padding:60px 20px; }
    .container { background:#fff; max-width:600px; margin:0 auto; padding:40px; border-radius:12px; box-shadow:0 3px 10px rgba(0,0,0,.1); text-align:center; }
    h2 { color:#2e7d32; font-size:1.8em; margin-bottom:10px; }
    p  { font-size:1.1em; color:#333; }
    footer { margin-top:30px; font-size:.85em; color:#888; }
  </style>
</head>
<body>
  <div class="container">
    <h2>{$title}</h2>
    <p>{$message}</p>
    <footer>Dreams Careers — Automated Email Sender</footer>
  </div>
</body>
</html>
HTML;

        $response = Craft::$app->getResponse();
        $response->format = Response::FORMAT_RAW;
        $response->headers->set('Content-Type', 'text/html; charset=utf-8');
        $response->data = $html;
        return $response;
    }
}
