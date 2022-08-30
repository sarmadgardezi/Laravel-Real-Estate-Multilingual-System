@if (theme_option('max_price'))
    @php $maxPriceData = get_repeat_field('max_price') @endphp
    @if(count($maxPriceData))
        <select id="maxprice" data-placeholder="{{ __('No Max') }}" name="max_price" class="form-control">
            <option value="">&nbsp;</option>
            @foreach ($maxPriceData as $item)
                @if (count($item) > 1)
                    <option value="{{ $item[0]['value'] }}"
                            @if (request()->input('max_price') == $item[0]['value']) selected @endif>
                        {{ $item[1]['value'] }}
                    </option>
                @endif
            @endforeach
        </select>
    @else
        <input type="number" min="0" placeholder="{{ __('No Max') }}" name="max_price" class="form-control">
    @endif
@endif
