<?php
namespace modules\jobhighlights;

use Craft;
use yii\base\Module;

class JobHighlightsModule extends Module
{
    public function init(): void
    {
        parent::init();
        Craft::setAlias('@modules/jobhighlights', __DIR__);
        Craft::info('JobHighlights module loaded', __METHOD__);
    }
}
