<?php
namespace modules\jobhighlights\controllers;

use Craft;
use craft\web\Controller;
use modules\jobhighlights\services\HighlightService;
use yii\web\Response;

class HighlightController extends Controller
{
    protected array|int|bool $allowAnonymous = ['process'];

    /**
     * Process job entries and update their highlights field
     * URL: /actions/jobhighlights/highlight/process
     */
    public function actionProcess(): Response
    {
        $request = Craft::$app->getRequest();
        $section = $request->getParam('section', 'jobList'); // default section handle
        $limit = (int)$request->getParam('limit', 5);

        $processed = HighlightService::processJobs($section, $limit);

        return $this->asJson([
            'status' => 'ok',
            'processed' => $processed,
        ]);
    }
}
