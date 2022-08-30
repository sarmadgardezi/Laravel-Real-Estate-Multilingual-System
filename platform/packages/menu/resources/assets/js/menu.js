import sanitizeHTML from 'sanitize-html';

class MenuNestable {
    constructor() {
        this.$nestable = $('#nestable');
    }

    setDataItem(target) {
        target.each((index, el) => {
            let current = $(el);
            current.data('id', current.attr('data-id'));
            current.data('title', current.attr('data-title'));
            current.data('reference_id', current.attr('data-reference_id'));
            current.data('reference_type', current.attr('data-reference_type'));
            current.data('url', current.attr('data-url'));
            current.data('css_class', current.attr('data-css_class'));
            current.data('target', current.attr('data-target'));
        });
    }

    updatePositionForSerializedObj(arrayObject) {
        let result = arrayObject;
        let that = this;

        $.each(result, (index, val) => {
            val.position = index;
            if (typeof val.children == 'undefined') {
                val.children = [];
            }
            that.updatePositionForSerializedObj(val.children);
        });

        return result;
    }

    // Main function to initiate the module
    init() {
        let depth = parseInt(this.$nestable.attr('data-depth'));
        if (depth < 1) {
            depth = 5;
        }
        $('.nestable-menu').nestable({
            group: 1,
            maxDepth: depth,
            expandBtnHTML: '',
            collapseBtnHTML: ''
        });

        this.handleNestableMenu();
    }

    handleNestableMenu() {
        let that = this;
        // Show node details
        $(document).on('click', '.dd-item .dd3-content a.show-item-details', e => {
            e.preventDefault();
            let parent = $(e.currentTarget).parent().parent();
            $(e.currentTarget).toggleClass('active');
            parent.toggleClass('active');
        });

        // Edit attributes
        $(document).on('change blur keyup', '.nestable-menu .item-details input[type=text], .nestable-menu .item-details select', e => {
            e.preventDefault();
            let current = $(e.currentTarget);
            let parent = current.closest('li.dd-item');
            let value = sanitizeHTML(current.val());
            let name = sanitizeHTML(current.attr('name'));
            let old = sanitizeHTML(current.attr('data-old'));
            parent.attr('data-' + name, value);
            parent.data(name, value);
            parent.find('> .dd3-content .text[data-update="' + name + '"]').text(value);
            if (value.trim() === '') {
                parent.find('> .dd3-content .text[data-update="' + name + '"]').text(old);
            }
            that.setDataItem(that.$nestable.find('> ol.dd-list li.dd-item'));
        });

        // Add nodes
        $(document).on('click', '.box-links-for-menu .btn-add-to-menu', e => {
            e.preventDefault();
            let current = $(e.currentTarget);
            let parent = current.parents('.the-box');
            let params = [];
            if (parent.attr('id') === 'external_link') {
                let data = {};
                $('#menu-node-create-form').find('.form-control').serializeArray().map(function(x) {
                    data[x.name] = sanitizeHTML(x.value);
                });

                params.push(data);
            } else {
                parent.find('.list-item li.active').each((index, el) => {
                    let find_in = $(el).find('> label');
                    params.push({
                        reference_type: sanitizeHTML(find_in.attr('data-reference-type')),
                        reference_id: sanitizeHTML(find_in.attr('data-reference-id')),
                        title: sanitizeHTML(find_in.attr('data-title')),
                    });
                });
            }

            $.ajax({
                url: route('menus.get-node'),
                type: 'GET',
                data: {data: params},
                success: res => {
                    if (!res.error) {
                        that.appendMenuNode(res.data.html, parent);
                    } else {
                        Botble.showError(res.message);
                    }
                },
                error: res => {
                    Botble.handleError(res);
                },
            });
        });

        // Remove nodes
        $('.form-save-menu input[name="deleted_nodes"]').val('');
        $(document).on('click', '.nestable-menu .item-details .btn-remove', e => {
            e.preventDefault();
            let $this = $(e.currentTarget);
            let dd_item = $this.parents('.item-details').parent();

            let $elm = $('.form-save-menu input[name="deleted_nodes"]');
            // Add id of deleted nodes to delete in controller
            $elm.val($elm.val() + ' ' + dd_item.attr('data-id'));
            let children = dd_item.find('> .dd-list').html();
            if (children !== '' && children != null) {
                dd_item.before(children.replace('<script>', '').replace('<\\/script>', ''));
            }
            dd_item.remove();
        });

        $(document).on('click', '.nestable-menu .item-details .btn-cancel', e => {
            e.preventDefault();
            const $this = $(e.currentTarget);
            const parent = $this.parents('.item-details').parent();
            parent.find('input[type=text], textarea, select').each((index, el) => {
                $(el).val($(el).attr('data-old')).trigger('change');
            });

            parent.removeClass('active');
        });

        $(document).on('change', '.box-links-for-menu .list-item li input[type=checkbox]', event => {
            $(event.currentTarget).closest('li').toggleClass('active');
        });

        $(document).on('submit', '.form-save-menu', () => {
            if (that.$nestable.length < 1) {
                $('#nestable-output').val('[]');
            } else {
                let nestable_obj_returned = that.$nestable.nestable('serialize');
                let the_obj = that.updatePositionForSerializedObj(nestable_obj_returned);
                $('#nestable-output').val(JSON.stringify(the_obj));
            }
        });

        let accordion = $('#accordion');

        let toggleChevron = event => {
            $(event.target).prev('.widget-heading').find('.narrow-icon').toggleClass('fa-angle-down fa-angle-up');
        };

        accordion.on('hidden.bs.collapse', toggleChevron);
        accordion.on('shown.bs.collapse', toggleChevron);

        Botble.callScroll($('.list-item'));
    }

    appendMenuNode(html, parent) {
        const that = this;
        $('.nestable-menu > ol.dd-list').append(html.replace('<script>', '').replace('<\\/script>', ''));

        $('.nestable-menu').find('.select-full').select2({
            width: '100%',
            minimumResultsForSearch: -1
        });

        // Change json
        that.setDataItem(that.$nestable.find('> ol.dd-list li.dd-item'));
        if (parent.attr('id') === 'external_link') {
            parent.find('input[type=text], textarea, select').val('').trigger('change');
        }
        parent.find('.list-item li.active')
            .removeClass('active')
            .find('input[type=checkbox]')
            .prop('checked', false);
        Botble.initResources();
    }
}

$(window).on('load', () => {
    new MenuNestable().init();
});
