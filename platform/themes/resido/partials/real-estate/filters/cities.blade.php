@php
    $isAvailableForOneCountry = theme_option('is_available_for_one_country', 'no');
@endphp
<select
    data-placeholder="{{ $isAvailableForOneCountry ? __('City') : (__('Country') . ' ' . __('State') . ' ' . __('City'))  }}"
    class="form-control city_id"
    data-url="{{ route('public.ajax.cities') }}" name="city_id"
    id="city_id" {{ $isAvailableForOneCountry == 'yes' ? 'data-only-city=true' : ''}}>
    @if(!empty(request()->input('city_id')))
        <option value="{{ request()->input('city_id') }}" selected>
            {{ Location::getCityNameById(request()->input('city_id')) }}
        </option>
    @endif
</select>
