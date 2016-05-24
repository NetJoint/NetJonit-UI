define(['jquery',
    'affix',
    'alert',
    'button',
    'carousel',
    'collapse',
    'dropdown',
    'modal',
    'popover',
    'scrollspy',
    'tab',
    'tooltip',
    'transition',
    'select2',
    'checkbox',
    'layout'
], function () {
    $(function () {
        $('[data-spy="scroll"]').scrollspy();
        $('[data-spy="affix"]').affix();
        $('[data-toggle="select"]').select2();
    });
});