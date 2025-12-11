<?php

namespace modules\enquiry\controllers;

use Craft;
use craft\web\Controller;
use yii\web\Response;
use craft\helpers\Json;

class EnquiryController extends Controller
{
    protected int|bool|array $allowAnonymous = true; // allow public POST access

    public function actionSubmit(): Response
    {
        $request = Craft::$app->getRequest();

        if (!$request->getIsPost()) {
            return $this->asJson([
                'success' => false,
                'message' => 'Invalid request method.'
            ]);
        }

        // 🔐 Get POST body parameters
        $token = $request->getBodyParam('token');
        $title = $request->getBodyParam('title');
        $firstName = $request->getBodyParam('firstName');
        $lastName = $request->getBodyParam('lastName');
        $emailAddress = $request->getBodyParam('emailAddress');
        $question = $request->getBodyParam('question');
        $authorId = $request->getBodyParam('authorId');

        // 🔐 Validate reCAPTCHA token
        $secretKey = getenv('RECAPTCHA_SECRET_KEY');

        if (!$secretKey) {
            return $this->asJson([
                'success' => false,
                'message' => 'reCAPTCHA secret key missing.'
            ]);
        }

        $verifyUrl = "https://www.google.com/recaptcha/api/siteverify";
        $verifyResponse = file_get_contents($verifyUrl . "?secret={$secretKey}&response={$token}");
        $captchaData = Json::decode($verifyResponse);

        if (!$captchaData['success'] || $captchaData['score'] < 0.5) {
            return $this->asJson([
                'success' => false,
                'message' => 'Bot detected. reCAPTCHA failed.'
            ]);
        }

        // 🧼 Sanitization
        $cleanTitle = trim(strip_tags($title));
        $cleanFirstName = trim(strip_tags($firstName));
        $cleanLastName = trim(strip_tags($lastName));
        $cleanEmail = trim(strip_tags($emailAddress));
        $cleanQuestion = trim(strip_tags($question));

        // 🔨 Internal GraphQL mutation inside Craft
        $gql = Craft::$app->getGql();

        $mutation = <<<GQL
mutation {
  save_enquiries_enquiry_Entry(
    title: "{$cleanTitle}",
    firstName: "{$cleanFirstName}",
    lastName: "{$cleanLastName}",
    emailAddress: "{$cleanEmail}",
    question: "{$cleanQuestion}",
    authorId: "{$authorId}"
  ) {
    id
    title
  }
}
GQL;

        $result = $gql->executeQuery($mutation);

        if (!isset($result['data']['save_enquiries_enquiry_Entry']['id'])) {
            return $this->asJson([
                'success' => false,
                'message' => 'GraphQL mutation failed.'
            ]);
        }

        return $this->asJson([
            'success' => true,
            'message' => 'Form submitted successfully.',
            'id' => $result['data']['save_enquiries_enquiry_Entry']['id']
        ]);
    }
}
