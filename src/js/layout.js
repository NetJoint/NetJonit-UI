/* ========================================================================
 * NetJoint UI: layout.js v3.3.6
 * ========================================================================
 * Copyright 2015-2016 NetJoint, Inc.
 * Licensed under MIT (https://github.com/NetJoint/NetJoint-UI/blob/master/LICENSE.md)
 * ======================================================================== */


+function ($) {
    'use strict';

    var layout_toggle = '[data-toggle="layout"]',
            main_sidebar_toggle = '[data-toggle="main-sidebar"]',
            control_sidebar_toggle = '[data-toggle="control-sidebar"]';
    var screenSizes = {
        xs: 480,
        sm: 768,
        md: 992,
        lg: 1200
    }

    var Layout = function (element, options) {
        this.$element = $(element);
        this.options = options;
        this.init();
    }

    Layout.VERSION = '3.3.6'

    Layout.prototype.init = function (e) {
        var that = this;
        this.fix();
        $(window).resize(function () {
            that.fix();
        });
    }

    Layout.prototype.toggleMainSidebar = function (e) {
        e.preventDefault();

        var $layout = $(this).parents(layout_toggle);

        if ($(window).width() > (screenSizes.sm - 1)) {
            if ($layout.hasClass('sidebar-collapse')) {
                $layout.removeClass('sidebar-collapse').trigger('expanded.mainSidebar');
            } else {
                $layout.addClass('sidebar-collapse').trigger('collapsed.mainSidebar');
            }
        } else {
            if ($layout.hasClass('sidebar-open')) {
                $layout.removeClass('sidebar-open').removeClass('sidebar-collapse').trigger('collapsed.mainSidebar');
            } else {
                $layout.addClass('sidebar-open').trigger('expanded.mainSidebar');
            }
        }
    }

    Layout.prototype.toggleControlSidebar = function (e) {
        e.preventDefault();
        var $layout = $(this).parents(layout_toggle);
        var sidebar = $('.control-sidebar', $layout);
        if (!sidebar.hasClass('control-sidebar-open')) {
            sidebar.addClass('control-sidebar-open');
        } else {
            sidebar.removeClass('control-sidebar-open');
        }
    }

    Layout.prototype.toggleChildMenu = function (e) {
        e.preventDefault();
        var $this = $(this),
                $layout = $this.parents(layout_toggle);
        var checkElement = $this.next();
        var parent_li = $this.parent("li");  
        var parent_id = parent_li.attr('id');
        if ((checkElement.is('.child-menu')) && (checkElement.is(':visible')) && (!$layout.hasClass('sidebar-collapse'))) {            
            checkElement.slideUp(300, function () {
                checkElement.removeClass('menu-open');
                parent_li.removeClass("actived");
                if(parent_id){
                    //cookie 记录展开的菜单
                    $.cookie('open_'+parent_id, 0, { expires: 365 });
                }
            });
        } else if ((checkElement.is('.child-menu')) && (!checkElement.is(':visible'))) {            
            checkElement.slideDown(300, function () {
                checkElement.addClass('menu-open');
                parent_li.addClass('actived');
                if(parent_id){
                    //cookie 记录展开的菜单
                    $.cookie('open_'+parent_id, 1, { expires: 365 });
                }
            });
        }
    }

    Layout.prototype.fix = function () {        
        var neg = $('.layout-nav').outerHeight();
        var window_height = $(window).height();
        var sidebar_height = $(".main_sidebar").height();
        $.each($('.sidebar-menu .child'),function(idx,obj){
            //cookie 记录展开的菜单
            var id = $(obj).attr('id');            
            if(id){
                if($.cookie('open_'+id)==1){
                    $(obj).addClass('actived');
                }
            }
        });
        if (this.$element.hasClass("fixed")) {
            $(".layout-content").css('min-height', window_height);
        } else {
            var postSetWidth;
            if (window_height >= sidebar_height) {
                $(".layout-content").css('min-height', window_height - neg);
                postSetWidth = window_height - neg;
            } else {
                $(".layout-content").css('min-height', sidebar_height);
                postSetWidth = sidebar_height;
            }
            var controlSidebar = $(control_sidebar_toggle);
            if (typeof controlSidebar !== "undefined") {
                if (controlSidebar.height() > postSetWidth)
                    $(".layout-content").css('min-height', controlSidebar.height());
            }
        }
    }


    // ALERT PLUGIN DEFINITION
    // =======================

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.layout')
            if (!data)
                $this.data('bs.layout', (data = new Layout(this)))
            if (typeof option == 'string')
                data[option].call($this)
        })
    }

    var old = $.fn.layout

    $.fn.layout = Plugin
    $.fn.layout.Constructor = Layout


    // ALERT NO CONFLICT
    // =================

    $.fn.layout.noConflict = function () {
        $.fn.layout = old
        return this
    }


    // LAYOUT DATA-API
    // ==============    

    $(document)
            .on('click.bs.layout.data-api', main_sidebar_toggle, Layout.prototype.toggleMainSidebar)
            .on('click.bs.layout.data-api', control_sidebar_toggle, Layout.prototype.toggleControlSidebar)
            .on('click.bs.layout.data-api', '.child > a', Layout.prototype.toggleChildMenu)

    $(document).on('ready', function () {
        $(layout_toggle).each(function () {
            var $layout = $(this)
            Plugin.call($layout, $layout.data())
        })
    })

}(jQuery);