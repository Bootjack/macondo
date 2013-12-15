(function() {
    var i, buttons, classes;
    buttons = document.getElementsByTagName('input');
    for (i = 0; i < buttons.length; i += 1) {
        classes = buttons[i].className.split(' ');
        if (-1 !== classes.indexOf('datepickr')) {
            new datepickr(buttons[i].id, {
                //Sun Nov 03 2013 15:59:56 GMT-0500 (EST)
                dateFormat: 'D M d Y'
            });
        }
    }
}());
