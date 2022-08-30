<?php

namespace Theme\Resido\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CityResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    public function toArray($request)
    {
        $state_name = empty($this->state) ? '' : (', ' . $this->state->name);

        return [
            'id'   => $this->id,
            'name' => $this->name . ($request->input('only_city_name') ? '' : $state_name)
        ];
    }
}
