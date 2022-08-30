@if (theme_option('min_price'))
    @php $minPriceData = get_repeat_field('min_price') @endphp
    @if(count($minPriceData))
        <select id="minprice" data-placeholder="{{ __('No Min1') }}" name="min_price" class="form-control">
            <option value="">&nbsp;</option>
            @foreach ($minPriceData as $item)
                @if (count($item) > 1)
                    <option value="{{ $item[0]['value'] }}"
                            @if (request()->input('min_price') == $item[0]['value']) selected @endif>
                        {{ $item[1]['value'] }}
                    </option>
                @endif
            @endforeach
        </select>
    @else
        <input type="number" min="0" placeholder="{{ __('No Min') }}" name="min_price" class="form-control">
    @endif
@endif
