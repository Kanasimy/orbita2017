//= ../../node_modules/bootstrap-slider/dist/bootstrap-slider.min.js
(function($) {
    var priceSlider = document.getElementById('price-slider');
if(priceSlider){
    var slider = new Slider("#price-slider");
        slider.on("change", function(slideEvent){
        var min,max,sliderValue;
        sliderValue = slider.getValue();
        console.log(sliderValue);
        if(sliderValue){
            min = Math.min.apply(null, sliderValue);
            max = Math.max.apply(null, sliderValue);}
        $('#from').val(min);
        $('#to').val(max);
        });
        function setInput(focus){
            var val1 = parseInt(document.getElementById('from').value),
                val2 = parseInt(document.getElementById('to').value),
                valMax = slider.getAttribute('max'),
                val = [];

            val1 = isNaN(val1) ? 0 : val1;
            val2 = isNaN(val2) ? valMax : val2;

            if(val1>valMax){
                val1=valMax;
                document.getElementById('from').value=valMax;
            };

            if(val1>val2&&val2){
                var min = val2;
                val2 = val1;
                val1 = min;
            }

            if(val2>valMax){
                val2=valMax;
                document.getElementById('to').value=valMax;
            };



            if(focus&&!(val1||val2)){
                console.log('В фокусе,ниче неделаем пока');
                return false;
            }else if(!focus) {
                console.log('Потерял фокус, установим input в нормальное значение');
                document.getElementById('from').value=val1;
                document.getElementById('to').value=val2;
            }else{
                console.log('Валидно,двигаем слайдер');
                val = [val1, val2];
                console.log(val);
               //document.getElementById('from').value=val1;
                //document.getElementById('to').value=val2;
                slider.setValue(val);
            }

        }
        document.getElementById('from').oninput = function() {setInput(true)};
        document.getElementById('to').oninput = function() {setInput(true)};
        document.getElementById('from').onblur = function() {setInput(false)};
        document.getElementById('to').onblur = function() {setInput(false)};
}

})(jQuery);