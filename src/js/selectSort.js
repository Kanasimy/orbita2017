(function(){
    var select = document.getElementById('sortSelect'),
        value;
    if(select){
        select.addEventListener('change', function () {
            value = select.options[select.selectedIndex].value;
            window.location = value;
        }, false);
    }
})();