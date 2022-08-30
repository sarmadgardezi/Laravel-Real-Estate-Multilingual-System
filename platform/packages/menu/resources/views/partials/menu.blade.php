<ol class="dd-list">
    @foreach ($menu_nodes as $key => $row)
       @include('packages/menu::partials.node')
    @endforeach
</ol>
