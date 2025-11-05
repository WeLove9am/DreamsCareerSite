<?php
namespace modules\geocode\controllers;

use Craft;
use craft\web\Controller;
use craft\elements\Category;
use GuzzleHttp\Client;

class GeocodeController extends Controller
{
    protected array|bool|int $allowAnonymous = true;

    public function actionUpdateCoordinates()
    {
        $mapboxToken = 'pk.eyJ1IjoiY2hhcmxpZTlhbSIsImEiOiJjbGg3cndremUwMWpzM2RwbnFrOXRrNmM3In0.ToFGGkXHE9j6MEehp31B7Q';

        if (!$mapboxToken) {
            return $this->asJson(['error' => 'MAPBOX_TOKEN missing in .env']);
        }

        $client = new Client([
            'base_uri' => 'https://api.mapbox.com/',
            'timeout' => 10,
        ]);

        $categories = Category::find()
            ->group('postcodesCat')
            ->all();

        $updated = 0;
        $skipped = 0;

        foreach ($categories as $category) {
            $longitude = $category->longitude ?? null;
            $latitude = $category->latitude ?? null;

            if ($longitude && $latitude) {
                $skipped++;
                continue;
            }

            $postcode = trim($category->title);
            if (!$postcode) {
                $skipped++;
                continue;
            }

            try {
                $response = $client->get('geocoding/v5/mapbox.places/' . urlencode($postcode) . '.json', [
                    'query' => [
                        'access_token' => $mapboxToken,
                        'limit' => 1,
                        'country' => 'GB', // change if needed
                    ],
                ]);

                $data = json_decode($response->getBody(), true);

                if (!empty($data['features'][0]['center'])) {
                    $coords = $data['features'][0]['center'];
                    $category->longitude = $coords[0];
                    $category->latitude = $coords[1];

                    if (!Craft::$app->elements->saveElement($category)) {
                        Craft::warning("Failed to save {$postcode}", __METHOD__);
                    } else {
                        $updated++;
                    }
                } else {
                    Craft::warning("No coordinates for {$postcode}", __METHOD__);
                }
            } catch (\Exception $e) {
                Craft::error("Error fetching {$postcode}: " . $e->getMessage(), __METHOD__);
            }
        }

        return $this->asJson([
            'message' => "Geocoding complete",
            'updated' => $updated,
            'skipped' => $skipped,
            'total' => count($categories),
        ]);
    }
}
