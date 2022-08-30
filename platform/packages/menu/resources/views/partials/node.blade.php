<li class="dd-item dd3-item @if ($row->reference_id > 0) post-item @endif"
    data-reference_type="{{ $row->reference_type }}"
    data-reference_id="{{ $row->reference_id }}"
    data-title="{{ $row->title }}"
    data-css_class="{{ $row->css_class }}"
    data-id="{{ $row->id }}"
    data-url="{{ $row->url }}"
    data-icon_font="{{ $row->icon_font }}"
    data-target="{{ $row->target }}">
    <div class="dd-handle dd3-handle"></div>
    <div class="dd3-content">
        <span class="text float-start" data-update="title">{{ $row->title }}</span>
        <span class="text float-end">{{ Arr::last(explode('\\', $row->reference_type)) ?: trans('packages/menu::menu.custom_link') }}</span>
        <a href="#" title="" class="show-item-details">
            <i class="fa fa-angle-down"></i>
        </a>
        <div class="clearfix"></div>
    </div>
    <div class="item-details">
        {!! app(Botble\Base\Forms\FormBuilder::class)->create(Botble\Menu\Forms\MenuNodeForm::class, ['model' => $row])->renderForm([], false, true, false) !!}
        <div class="clearfix"></div>
        <div class="text-end mt-2">
            <a href="#" class="btn btn-danger btn-remove btn-sm">{{ trans('packages/menu::menu.remove') }}</a>
            <a href="#" class="btn btn-primary btn-cancel btn-sm">{{ trans('packages/menu::menu.cancel') }}</a>
        </div>
    </div>
    <div class="clearfix"></div>
    @if ($row->has_child)
        {!!
            Menu::generateMenu([
                'menu'       => $menu,
                'menu_nodes' => $row->child,
                'view'      => 'packages/menu::partials.menu',
                'theme'     => false,
                'active'    => false
            ])
        !!}
    @endif
</li>
