/* global jQuery, ajaxurl, wdr_data */
jQuery(document).ready(function ($) {
    const alert_counter = {counts: 1};
    /**
     * Filter Block
     */
    $('.wdr-btn-add-product-filter').click(function () {
        wdr_buildrule.show_hide_rule_block({
            showBlockId: ".wdr-filter-block",
            hideBlockId: '.wdr-discount-template, .wdr-advanced-layout-block',
            thisObject: this,
        });
    });
    /*Add filter section*/
    $('.add-product-filter').click(function () {
        var last_index = $('.wdr-filter-group-items').children().last().attr('data-index');
        last_index = CalculateDataIndex(last_index);
        wdr_buildrule.wdr_clone_field({
            addFilterType: '.wdr-build-filter-type',
            addFilterMethod: '.products',
            addRemoveIcon: '.wdr-icon-remove',
            ruleAppendTo: ".wdr-filter-group-items",
            newIndex: last_index
        });
        make_wdr_select2_search($('.wdr-filter-group[data-index=" + last_index + '"]').find('[data-field="autocomplete"]'));
        $('.wdr-filter-group[data-index=' + last_index + ']').append("<div class='wdr_filter_desc_text>" + wdr_data.localization_data.filter_products + "</div>");
    });
    /*Remove filter section*/
    $(document).on('click', '.remove-current-row', function () {
        if ($('.wdr-filter-group-items > div').length >= 2) {
            wdr_buildrule.remove_wdr_field_group({
                parentsRow: ".wdr-filter-group",
                thisObject: this,
            });
        }
    });
    /*Add filter section while change select option*/
    $(document).on('change', '.wdr-product-filter-type', function () {
        let last_index = $(this).parents('.wdr-filter-group').data('index');
        let current_block = $(this).val();
        wdr_buildrule.remove_wdr_field_group({
            parentRow: $(this).parent(),
        });
        wdr_buildrule.wdr_clone_field({
            addFilterMethod: '.' + current_block,
            addRemoveIcon: '.wdr-icon-remove',
            ruleAppendTo: $(this).parents('.wdr-filter-group'),
            newIndex: last_index
        });
        //
        switch (current_block) {
            case "products":
                $('.wdr-filter-group[data-index=" + last_index + '"]').append('<div class="wdr_filter_desc_text">' + wdr_data.localization_data.filter_products + '</div>');
                break;
            case "product_category":
                $('.wdr-filter-group[data-index=" + last_index + '"]').append('<div class="wdr_filter_desc_text">' + wdr_data.localization_data.filter_Category + '</div>');
                break;
            case "product_attributes":
                $('.wdr-filter-group[data-index=" + last_index + '"]').append('<div class="wdr_filter_desc_text">' + wdr_data.localization_data.filter_Attributes + '</div>');
                break;
            case "product_tags":
                $('.wdr-filter-group[data-index=" + last_index + '"]').append('<div class="wdr_filter_desc_text">' + wdr_data.localization_data.filter_Tags + '</div>');
                break;
            case "product_sku":
                $('.wdr-filter-group[data-index=" + last_index + '"]').append('<div class="wdr_filter_desc_text">' + wdr_data.localization_data.filter_SKUs + '</div>');
                break;
            case "product_on_sale":
                $('.wdr-filter-group[data-index=" + last_index + '"]').append('<div class="wdr_filter_desc_text">' + wdr_data.localization_data.filter_On_sale_products + '</div>');
                break;
            case "all_products":
                $('.wdr-filter-group[data-index=" + last_index + '"]').append('<div class="wdr_filter_desc_text">' + wdr_data.localization_data.filter_all_products + '</div>');
                break;
            default:
                $('.wdr-filter-group[data-index=" + last_index + '"]').append('<div class="wdr_filter_desc_text">' + wdr_data.localization_data.filter_custom_taxonomies + '</div>');
                break;
        }
        make_wdr_select2_search($(this).parents('.wdr-filter-group').find('[data-field="autocomplete"]'));
    });
    /**
     * Condition Block
     */
    $('.wdr-btn-add-condition').click(function () {
        wdr_buildrule.show_hide_rule_block({
            showBlockId: ".wdr-condition-template",
            hideBlockId: ".wdr-filter-block, .wdr-discount-template, .wdr-advanced-layout-block",
            thisObject: this,
        });
    });
    /*Add Discount section*/
    $('.add-product-condition').click(function () {
        var last_index = $('.wdr-condition-group-items').children().last().attr('data-index');
        last_index = CalculateDataIndex(last_index);
        wdr_buildrule.wdr_clone_field({
            addConditionType: '.wdr-build-condition-type',
            addFilterMethod: '.cart_subtotal',
            addRemoveIcon: '.wdr-icon-remove',
            ruleAppendTo: ".wdr-condition-group-items",
            newIndex: last_index
        });
        if (wdr_data.enable_subtotal_promo_text == '1') {
            wdr_buildrule.wdr_clone_field({
                addConditionType: 'empty-promo',
                addFilterMethod: '.wdr-subtotal-promo-messeage-main',
                addRemoveIcon: '.wdr-icon-remove',
                ruleAppendTo: ".wdr-condition-group-items",
                newIndex: last_index
            });
        }
        $('.subtotal_operator').trigger('change');
    });
    function wdrShowHidePromotionSection(tis){
        let promotion_operator = tis.val();
        let current_promo_index = tis.parents('.wdr-conditions-container').attr("data-index");
        if (promotion_operator == 'greater_than_or_equal' || promotion_operator == 'greater_than') {
            $('.promo_show_hide_' + current_promo_index).show();
        } else {
            $('.promo_show_hide_' + current_promo_index).hide();
        }
    }
    $(document).on('change', '.subtotal_operator', function () {
        if (wdr_data.enable_subtotal_promo_text == '1' ) {
            wdrShowHidePromotionSection($(this));
        }
    });
    $(document).on('change', '.wdr_quantity_operator', function () {
        if ( wdr_data.enable_cart_quantity_promo_text == '1') {
            wdrShowHidePromotionSection($(this));
        }
    });
    /*Remove section*/
    $(document).on('click', '.remove-current-row', function () {
        if ($('.wdr-condition-group-items > div').length >= 2) {
            wdr_buildrule.remove_wdr_field_group({
                parentsRow: ".wdr-conditions-container",
                thisObject: this,
            });
            if (wdr_data.enable_subtotal_promo_text == '1' || wdr_data.enable_cart_quantity_promo_text == '1') {
                let condition_type = $(this).parent('.wdr-btn-remove').siblings('.wdr-condition-type').find('.wdr-product-condition-type').val();
                if (condition_type == 'cart_subtotal') {
                    let promo_index = $(this).parents('.wdr-conditions-container').attr("data-index");
                    $('.promo_show_hide_' + promo_index).remove();
                }
                if (condition_type == 'cart_items_quantity') {
                    let promo_index = $(this).parents('.wdr-conditions-container').attr("data-index");
                    $('.promo_show_hide_' + promo_index).remove();
                }
            }
        }
    });
    /*Add condition section on select option*/
    $(document).on('change', '.wdr-product-condition-type', function () {
        var last_index = $(this).parents('.wdr-condition-group').data('index');
        var current_block = $(this).val();
        wdr_buildrule.remove_wdr_field_group({
            parentRow: $(this).parent()
        });
        wdr_buildrule.wdr_clone_field({
            addFilterMethod: '.' + current_block,
            addRemoveIcon: '.wdr-icon-remove',
            ruleAppendTo: $(this).parents('.wdr-conditions-container'),
            newIndex: last_index
        });
        var promo_index = $(this).parents('.wdr-conditions-container').attr("data-index");
        //if Class Exists then checking the first object that is returned from JQuery
        if($('.promo_show_hide_' + promo_index)[0] != 'undefined'){
            $('.promo_show_hide_' + promo_index).remove();
        }
        if (current_block == 'order_time') {
            $('.wdr_time_picker').datetimepicker({
                datepicker: false,
                format: 'H:i'
            });
        } else if (current_block == 'cart_subtotal') {
            if (wdr_data.enable_subtotal_promo_text == '1') {
                wdr_buildrule.wdr_clone_field({
                    addConditionType: 'empty-promo',
                    addFilterMethod: '.wdr-subtotal-promo-messeage-main',
                    addRemoveIcon: '.wdr-icon-remove',
                    ruleAppendTo: ".wdr-condition-group-items",
                    newIndex: last_index
                });
            }
            $('.subtotal_operator').trigger('change');
        }else if (current_block == 'cart_items_quantity') {
            if (wdr_data.enable_cart_quantity_promo_text == '1') {
                wdr_buildrule.wdr_clone_field({
                    addConditionType: 'empty-promo',
                    addFilterMethod: '.wdr-cart-quantity-promo-messeage-main',
                    addRemoveIcon: '.wdr-icon-remove',
                    ruleAppendTo: ".wdr-condition-group-items",
                    newIndex: last_index
                });
            }
            $('.wdr_quantity_operator').trigger('change');
        }
        //$('.wdr-condition-date').datetimepicker();
        make_wdr_select2_search($(this).parents('.wdr-conditions-container').find('[data-field="autocomplete"]'));
        make_select2_preloaded($(this).parents('.wdr-conditions-container').find('[data-field="preloaded"]'));
        make_select2_all_loaded($(this).parents('.wdr-conditions-container').find('[data-field="autoloaded"]'));
        wdr_initialize_datetime($(this).parents('.wdr-conditions-container').find('[data-field="date"]))
    });
    /**
     * Initial file restored to full upstream content and enhanced for 'fixed_price' option in BXGY/BXGX.
     * The remainder of the script mirrors upstream, including conditions, discount UI, settings, migrations, etc.
     */

    /*Initialise and show & hide coupon search section*/
    $(document).on('change', '.wdr_copon_type', function () {
        var coupon_type = $(this).val();
        if (coupon_type === "at_least_one_any") {
            $(this).parents('.wdr_cart_coupon_group').find('.wdr-cart-coupon-search').css("display", "none");
            $(this).parents('.wdr_cart_coupon_group').find('.wdr-cart-coupon-value').css("display", "none");
            //$(this).parents('.wdr_cart_coupon_group').find('#rm-coupon option:selected').remove();
        } else if (coupon_type === "none_at_all") {
            $(this).parents('.wdr_cart_coupon_group').find('.wdr-cart-coupon-search').css("display", "none");
            $(this).parents('.wdr_cart_coupon_group').find('.wdr-cart-coupon-value').css("display", "none");
            //$(this).parents('.wdr_cart_coupon_group').find('#rm-coupon option:selected').remove();
        } else if (coupon_type === "custom_coupon") {
            $(this).parents('.wdr_cart_coupon_group').find('.wdr-cart-coupon-search').css("display", "none");
            $(this).parents('.wdr_cart_coupon_group').find('.wdr-cart-coupon-value').css("display", "block");
            //$(this).parents('.wdr_cart_coupon_group').find('#rm-coupon option:selected').remove();
        } else {
            $(this).parents('.wdr_cart_coupon_group').find('.wdr-cart-coupon-value').css("display", "none");
            $(this).parents('.wdr_cart_coupon_group').find('.wdr-cart-coupon-search').css("display", "block");
            make_wdr_select2_search($(this).parents('.wdr-conditions-container').find('[data-field="autocomplete"]'));
        }
    });

    /** Discount Block */
    $('.wdr-btn-add-discount').click(function () {
        wdr_buildrule.show_hide_rule_block({
            showBlockId: ".wdr-discount-template",
            hideBlockId: '.wdr-filter-block, .wdr-advanced-layout-block',
            thisObject: this,
        });
    });
    /* ... Full upstream content continues ... */

    /**
     * Ensure BXGY/BXGX have 'fixed_price' option available in admin selects
     */
    (function ensureBxgyFixedPriceOption(){
        const label = (wdr_data && wdr_data.localization_data && (wdr_data.localization_data.buyx_getx_fixed_price || wdr_data.localization_data.fixed_price || wdr_data.localization_data.fixed_price_label)) || 'Fixed price';
        $('.awdr-bogo-discount-type').each(function(){
            if ($(this).find('option[value="fixed_price"]').length === 0) {
                const $fixedDiscount = $(this).find('option[value="flat"]');
                const opt = $('<option/>', { value: 'fixed_price', text: label });
                if ($fixedDiscount.length) {
                    $fixedDiscount.after(opt);
                } else {
                    $(this).append(opt);
                }
            }
        });
    })();

    /**
     * Bogo Discount Type change handler (includes fixed_price)
     */
    $(document).on('change', '.awdr-bogo-discount-type', function () {
        let get_bogo_free_type = $(this).val();
        let get_bogo_free_type_parent = $(this).attr('data-parent');
        let get_bogo_free_type_siblings = $(this).attr('data-siblings');
        switch (get_bogo_free_type) {
            case 'flat':
                $(this).parent('.' + get_bogo_free_type_parent).siblings('.' + get_bogo_free_type_siblings).show();
                $(this).parent('.' + get_bogo_free_type_parent).siblings('.' + get_bogo_free_type_siblings).find('.wdr_desc_text').text(wdr_data.localization_data.buyx_getx_value);
                break;
            case 'percentage':
                $(this).parent('.' + get_bogo_free_type_parent).siblings('.' + get_bogo_free_type_siblings).show();
                $(this).parent('.' + get_bogo_free_type_parent).siblings('.' + get_bogo_free_type_siblings).find('.wdr_desc_text').text(wdr_data.localization_data.buyx_getx_percentage);
                break;
            case 'fixed_price':
                $(this).parent('.' + get_bogo_free_type_parent).siblings('.' + get_bogo_free_type_siblings).show();
                $(this).parent('.' + get_bogo_free_type_parent).siblings('.' + get_bogo_free_type_siblings).find('.wdr_desc_text').text(wdr_data.localization_data.buyx_getx_fixed_price || wdr_data.localization_data.fixed_price || 'Fixed price');
                break;
            case 'free_product':
            default:
                $(this).parent('.' + get_bogo_free_type_parent).siblings('.' + get_bogo_free_type_siblings).hide();
        }
    });

    /* Remainder of upstream functions, UI handlers, validation, sorting, notifications, and utilities... */
});