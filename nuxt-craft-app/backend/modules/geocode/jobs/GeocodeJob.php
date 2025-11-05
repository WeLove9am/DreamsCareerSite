<?php
namespace modules\geocode\jobs;

use Craft;
use craft\queue\BaseJob;
use craft\elements\Category;
use GuzzleHttp\Client;

class GeocodeJob extends BaseJob
{
    public function execute($queue): void
    {
        $mapboxToken = Craft::$app->env->get('MAPBOX_TOKEN');

        if (!$mapboxToken) {
            Craft::error('MAPBOX_TOKEN missing in .env', __METHOD__);
            return;
        }

        $client = new Client(['base_uri' => 'https://api.mapbox.com/']);

        $categories = Category::find()->group('postcodesCat')->all();

        $total = count($categories);
        $processed = 0;

        foreach ($categories as $category) {
            $this->setProgress($queue, $processed++ / $total, "Processing {$category->title}");

            if ($category->longitude && $category->latitude) {
                continue; // already has data
            }

            $postcode = trim($category->title);
            if (!$postcode) {
                continue;
            }

            try {
                $response = $client->get('geocoding/v5/mapbox.places/' . urlencode($postcode) . '.json', [
                    'query' => [
                        'access_token' => $mapboxToken,
                        'limit' => 1,
                        'country' => 'GB',
                    ],
                ]);

                $data = json_decode($response->getBody(), true);
                if (!empty($data['features'][0]['center'])) {
                    $coords = $data['features'][0]['center'];
                    $category->longitude = $coords[0];
                    $category->latitude = $coords[1];
                    Craft::$app->elements->saveElement($category);
                }
            } catch (\Exception $e) {
                Craft::error("Error fetching {$postcode}: " . $e->getMessage(), __METHOD__);
            }
        }

        Craft::info("Geocode job completed: {$processed}/{$total}", __METHOD__);
    }

    protected function defaultDescription(): string
    {
        return 'Updating category geocodes from Mapbox';
    }
}
