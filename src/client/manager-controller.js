$('.manager--links a').click(function (event) {
    event.preventDefault();
    $('body').append($('<div id="macondo-admin-layer">'));
    console.log('ajax request: ' + this.href);
    $.ajax({
        url: this.href,
        success: function (data) {
            var $admin = $('#macondo-admin-layer');
            $admin.html(data);
            $admin.find('.cancel-button').click(function () {
                $admin.remove();
            });
            $admin.find('form').submit(function (event) {
                $form = $admin.find('form');
                event.preventDefault();
                $.ajax({
                    url: $form.attr('action'),
                    data: $form.serialize(),
                    type: 'POST',
                    success: function () {
                        $admin.remove();           
                        window.location.reload();                 
                    }
                });
                return false;
            });
        }
    })
});