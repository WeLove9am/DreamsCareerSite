<?php

namespace modules\enquiry;

use Craft;
use yii\base\Module;

class EnquiryModule extends Module
{
    public function init()
    {
        parent::init();

        // Register module path
        Craft::setAlias('@modules/enquiry', __DIR__);

        // Log initialization
        Craft::info('Enquiry Module loaded', __METHOD__);
    }
}
