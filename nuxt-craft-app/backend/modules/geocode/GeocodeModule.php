<?php
namespace modules\geocode;

use Craft;
use craft\events\RegisterUrlRulesEvent;
use craft\web\UrlManager;
use yii\base\Event;
use yii\base\Module;

class GeocodeModule extends Module
{
    public function init(): void
    {
        parent::init();

        // Set module alias for easy access
        Craft::setAlias('@modules/geocode', __DIR__);

        // Register site route
        Event::on(
            UrlManager::class,
            UrlManager::EVENT_REGISTER_SITE_URL_RULES,
            function (RegisterUrlRulesEvent $event) {
                $event->rules['admin/update-geocode'] = 'geocode/geocode/update-coordinates';
            }
        );

        // Register control panel route (optional)
        Event::on(
            UrlManager::class,
            UrlManager::EVENT_REGISTER_CP_URL_RULES,
            function (RegisterUrlRulesEvent $event) {
                $event->rules['update-geocode'] = 'geocode/geocode/update-coordinates';
            }
        );

        Craft::info('Geocode module loaded', __METHOD__);
    }
}
