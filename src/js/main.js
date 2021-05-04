/**
 * Created by Ольга on 28.02.2017.
 */

/** Format Price**/

function formatPrice() {
    var prices = document.getElementsByClassName('price');
    for (var i = 0; i < prices.length; i++) {
        var str = prices[i].innerHTML;
        prices[i].innerHTML = str.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1&thinsp;')
    }
}

function toggleSwitch(event) {
    event.preventDefault();
    console.log(this)
}


function toggle(toggleParent) {
    let buttons = document.querySelectorAll(toggleParent + "__btn");
    console.log(buttons);
    for(let i=0; i<buttons.length; i++){
        buttons[i].addEventListener('click',toggleSwitch);
    }
}

/** Colls for catalog-top Depends on jquery**/
//= ../js/liColumns.js

/** Colls for catalog-top Depends on jquery**/
//= ../js/selectSort.js

function catalogTop() {
    var block = 'catalog-top',
        items = document.getElementsByClassName(block + '__item');
/**Вспомогательные классы**/
    function removeClass(nameClass, removeClass) {
        var element = document.querySelector('.' + nameClass);
        element.classList.remove(removeClass);
    }


    function showSubMenu(event) {
        var target = event.target,
            nameElement = target.className,
            idElement = target.id;

        /** Закрывем ранее открытые подменю**/
        closeSubMenu();

        /** Останавливаем всплытие события**/
        event.stopPropagation();

        /** Ищем какое подменю открыть**/
        if (idElement == 'catalog-top') {console.log("Не нашли ни одного подменю");
}
        while (idElement != 'catalog-top') {
            nameElement = target.className;
            idElement = target.id;

            if (typeof nameElement == 'string') {
                if (nameElement.indexOf('catalog-top__item') + 1) {
                    var subTop = target.offsetParent.offsetTop + target.offsetParent.offsetHeight,
                        subItem = target.id,
                        subMenu = document.getElementsByClassName(subItem),
                        subActive;

                    if (subMenu.length) {
                        for (var i = 0; i < subMenu.length; i++) {
                            if (subMenu[i].hasAttribute('data-sub')) {
                                subActive = subMenu[i]
                            }
                        }

                        // нашли элемент, который нас интересует!;
                        subActive.style.top = subTop + "px";
                        subActive.style.display = "block";
                        target.classList.add('catalog-top__item-active');

                        var menuPosition = function (target) {
                            //двигаем меню при изменении окна
                            subTop = target.offsetParent.offsetTop + target.offsetParent.offsetHeight;
                            subActive.style.top = subTop + "px";
                        };
                        var submenuColl = function (){
                            var w = window.innerWidth
                                || document.documentElement.clientWidth
                                || document.body.clientWidth;
                            if(w>750){
                                /** Делаем две колонки**/
                            $('.list_coll').liColl({
                                c_unit: '%', // '%' или 'px' При указании '%' — ширина 'c_width' игнорируется
                                n_coll: 2, //колличество колонок
                                p_left: 5 //отступ слева %
                            });
                                updateColl($('.list_coll'));
                            } else {
                                $('.list_coll').liColl({
                                    c_unit: '%', // '%' или 'px' При указании '%' — ширина 'c_width' игнорируется
                                    n_coll: 1, //колличество колонок
                                    p_left: 0 //отступ слева %
                                });
                                updateColl($('.list_coll'));
                            }

                        };

                        submenuColl();
                        // полсекнды ждем пока закончится событие
                        (function () {
                            var time;
                            window.onresize = function (e) {
                                if (time)
                                    clearTimeout(time);
                                time = setTimeout(function () {
                                    menuPosition(target);
                                    submenuColl();
                                }, 500);
                            }
                        })();
                    }
                    return;
                }
            }
            target = target.parentNode;
        }
    }

    function closeSubMenu(event) {
        closeSubMenu();
        event.stopPropagation();
    }

    function show(item) {
        item.getElementsByClassName()
    }

    //навешиваем обработчик
    for (var i = 0; i < items.length; i++) {
        items[i].onclick = showSubMenu;
    }

    function closeSubMenu() {
        var subMenu = document.getElementsByClassName('catalog-top__sub-menu');
        var nameElementActive = document.getElementsByClassName('catalog-top__item-active');
        console.log(nameElementActive[i]);
        for (var i = 0; i < subMenu.length; i++) {
            subMenu[i].style.display = 'none';
        }
        for (var i = 0; i < nameElementActive.length; i++) {
            nameElementActive[i].classList.remove('catalog-top__item-active');
        }
    }

    document.addEventListener('click', closeSubMenu);
}

function changeToggle() {
var toggleButtons = document.querySelectorAll("js-toggle")
}
formatPrice();
catalogTop();
// Переключения внешнего вида в каталоге
toggle('.js-toggle');



//= ../js/libs/svgxuse.min.js


var timeColl;
window.onresize = function () {
    if (timeColl)
        clearTimeout(timeColl);
    timeColl = setTimeout(function () {
        $('.list_coll').liColl({
            n_coll: 1, //колличество колонок
            p_left: 0 //отступ слева %
        });
        updateColl($('.list_coll'))
    }, 500);
}
//= ../js/libs/owl.carousel.min.js
//= ../../node_modules/bootstrap-sass/assets/javascripts/bootstrap.min.js
//= ../../node_modules/bootstrap-select/dist/js/bootstrap-select.min.js
//Доработать логику когда второй импут становиться меньшепервого
//= price-slider.js
//= headerLimit.js

    //For checkbox
//=../js/libs/modernizr.custom.js
//=../js/libs/svgcheckbx.js

    //Код с jquery
(function($) {
    // Функции зависящие от jquery
    function gallery() {
        var containerBig = $("#images-gallery_big");
            $(".images-gallery")
            .on('click', ".images-gallery_thumb", function(){
                containerBig[0].src=this.href;
            return false;
        });
    }

    function top(elem) {
        $(elem).click(function(event){
            var positionMenu = $(event.target.hash)[0].offsetTop;
            console.log($(event.target.hash));
            $('html, body').animate({
                scrollTop: positionMenu
            }, 900);
            return false;
        });
    }

    //Вызовы функций
    //Кнопка наверх
    top('.icon-go-top');
    //Галлерея
    gallery();
    //Карусель
    $('.owl-carousel-popular').owlCarousel({
        loop:true,
        responsiveClass:true,
        nav:true,
        dots:false,
        navText:[' ',' '],
        responsive:{
            0:{
                items:1
            },
            480:{
                items:2
            },
            1000:{
                items:3,
                nav:true
            }
        }
    });

    $('.owl-carousel-thumb').owlCarousel({
        loop:true,
        responsiveClass:true,
        nav:true,
        dots:false,
        navText:[' ',' '],
        responsive:{
            0:{
                items:4
            },
            480:{
                items:6
            },
            768:{
                items:4
            },
            1000:{
                items:3,
                nav:true
            },
            1340:{
            items:4,
            nav:true
        }
        }
    });

    $('.owl-carousel-home').owlCarousel({
        items:1,
        loop:true,
        responsiveClass:true,
        nav:true,
        autoHeight: true,
        //autoHeightClass: 'owl-height',
        autoplay: false,
        autoplayTimeout: 7010
    });
    //слайдер цены
    $('.selectpicker').selectpicker({
        style: 'btn-dropdown btn-select',
        width: '100%',
        size: 4
    });
    //обрезка длинного заголовка
    var headerItem = document.getElementsByClassName('catalog-item__header');
    for (var i = 0; i < headerItem.length; i++) {
        var stringHead = headerItem[i].innerHTML;
        headerItem[i].innerHTML = stringHead.limit(160);
    }

    //модальные окна






})(jQuery);