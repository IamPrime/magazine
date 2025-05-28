//判断手机类型
window.onload = function () {
    //alert($(window).height());
    var u = navigator.userAgent;
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {//安卓手机
    } else if (u.indexOf('iPhone') > -1) {//苹果手机
        //屏蔽ios下上下弹性
        $(window).on('scroll.elasticity', function (e) {
            e.preventDefault();
        }).on('touchmove.elasticity', function (e) {
            e.preventDefault();
        });
    } else if (u.indexOf('Windows Phone') > -1) {//winphone手机
    }
    //预加载
    loading();
}

var date_start;
var date_end;
date_start = getNowFormatDate();
//加载图片
var loading_img_url = [
    "/image/001.jpg",
    "/image/002.jpg",
    "/image/003.jpg",
    "/image/004.jpg",
    "/image/005.jpg",
    "/image/006.jpg",
    "/image/007.jpg",
    "/image/008.jpg",
    "/image/009.jpg",
    "/image/010.jpg",
    "/image/011.jpg",
    "/image/012.jpg",
    "/image/013.jpg",
    "/image/014.jpg",
    "/image/015.jpg",
    "/image/016.jpg",
    "/image/017.jpg",
    "/image/018.jpg",
    "/image/019.jpg",
    "/image/020.jpg",
    "/image/021.jpg",
    "/image/022.jpg",
    "/image/023.jpg",
    "/image/024.jpg",
    "/image/025.jpg",
    "/image/026.jpg",
];

var length = loading_img_url.length;

// Add the page navigation functionality from index.html
$(document).ready(function () {
    // Page Total
    $("#pageTot").html(length);

    // To First page
    $("#toFirst").click(function () {
        $(".flipbook").turn("page", 1);
    });

    // To Last page
    $("#toLast").click(function () {
        $(".flipbook").turn("page", length);
    });

    // When everything is loaded
    $(window).on('load', function () {
        document.body.classList.add('loaded');
    });

    // Previous
    $("#prev-fa").click(function () {
        $(".flipbook").turn("previous");
    });

    $("#prev-fa").bind("touchend", function () {
        var pageCount = $(".flipbook").turn("pages"); // Total pages
        var currentPage = $(".flipbook").turn("page"); // Current page
        if (currentPage >= 2) {
            $(".flipbook").turn("page", currentPage - 1);
        }
    });

    // Next
    $("#next-fa").click(function () {
        $(".flipbook").turn("next");
    });

    $("#next-fa").bind("touchend", function () {
        var pageCount = $(".flipbook").turn("pages"); // Total pages
        var currentPage = $(".flipbook").turn("page"); // Current page
        if (currentPage <= pageCount) {
            $(".flipbook").turn("page", currentPage + 1);
        }
    });

    // Page Number
    $("#pageNum").change(function () {
        try {
            var pageNum = parseInt($(this).val());
            if (pageNum > 0 && pageNum <= length) {
                $(".flipbook").turn("page", pageNum);
            } else {
                alert("Please enter a valid page number between 1 and " + length);
                $(this).val($(".flipbook").turn("page")); // Reset to current page
            }
        } catch (error) {
            console.error("Error navigating to page:", error);
        }
    });
});

//加载页面
function loading() {
    var numbers = 0;

    for (var i = 0; i < length; i++) {
        var img = new Image();
        img.src = loading_img_url[i];
        img.onerror = function () {
            numbers += (1 / length) * 100;
        }
        img.onload = function () {
            numbers += (1 / length) * 100;
            $('.number').html(parseInt(numbers) + "%");
            console.log(numbers);
            if (Math.round(numbers) == 100) {
                //$('.number').hide();
                date_end = getNowFormatDate();
                var loading_time = date_end - date_start;
                //预加载图片
                $(function progressbar() {
                    //拼接图片
                    $('.shade').hide();
                    var tagHtml = "";
                    for (var i = 1; i <= length; i++) {
                        if (i == 1) {
                            tagHtml += ' <div id="first" style="background:url(image/0' + (i < 10 ? '0' + i : i) + '.jpg) center center no-repeat;background-size:contain;"></div>';
                        } else if (i == length) {
                            tagHtml += ' <div id="end" style="background:url(image/0' + (i < 10 ? '0' + i : i) + '.jpg) center center no-repeat;background-size:contain;"></div>';
                        } else {
                            tagHtml += ' <div style="background:url(image/0' + (i < 10 ? '0' + i : i) + '.jpg) center center no-repeat;background-size:contain;"></div>';
                        }
                    }
                    $(".flipbook").append(tagHtml);
                    var w = $(".graph").width();
                    $(".flipbook-viewport").show();
                });

                //配置turn.js
                function loadApp() {
                    var w = $(window).width();
                    var h = $(window).height();
                    $('.flipbook').width(w).height(h);
                    $(window).resize(function () {
                        w = $(window).width();
                        h = $(window).height();
                        $('.flipbook').width(w).height(h);
                    });
                    $('.flipbook').turn({
                        // Width
                        width: w,
                        // Height
                        height: h,
                        // Elevation
                        elevation: 150,
                        // Pages
                        pages: length,
                        // Display type
                        display: 'single',
                        // Enable gradients
                        gradients: true,
                        // Auto center this flipbook
                        autoCenter: true,
                        when: {
                            turning: function (e, page, view) {
                                if (page == 1) {
                                    $(".bottom").css("display", "none");
                                    $(".mark").css("display", "block");
                                } else {
                                    $(".bottom").css("display", "block");
                                    $(".mark").css("display", "none");
                                }
                                if (page == length) {
                                    $(".nextPage").css("display", "none");
                                } else {
                                    $(".nextPage").css("display", "block");
                                }
                            },
                            turned: function (e, page, view) {
                                console.log(page);
                                var total = $(".flipbook").turn("pages");//总页数
                                if (page == 1) {
                                    $(".return").css("display", "none");
                                    $(".bottom").css("display", "none");
                                } else {
                                    $(".return").css("display", "block");
                                    $(".bottom").css("display", "block");
                                }
                                if (page == 2) {
                                    $(".catalog").css("display", "block");
                                } else {
                                    $(".catalog").css("display", "none");
                                }
                                $("#pageNum").val($(".flipbook").turn("page"));
                            }
                        }
                    });
                    $(window).bind("keydown", function (e) {
                        if (e.keyCode == 37) $(".flipbook").turn("previous");
                        else if (e.keyCode == 39) $(".flipbook").turn("next");
                    });
                }

                yepnope({
                    test: Modernizr.csstransforms,
                    yep: ['js/turn.js'],
                    complete: loadApp
                });
            }
        }
    }
}
function addPage(page, book) {
    // Create a container with consistent dimensions
    const element = $('<div class="page-container"></div>');

    // If the page is an image
    if (page.includes('.jpg') || page.includes('.png') || page.includes('.jpeg')) {
        const img = $('<img />');
        img.attr('src', page);
        element.append(img);
    } else {
        // For HTML content
        element.html(page);
    }

    // Set data attribute for page number (useful for double-spreads)
    element.attr('data-page-number', book.turn('pages') + 1);

    book.turn('addPage', element, book.turn('pages') + 1);
}

function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "";
    var seperator2 = "";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + "" + date.getHours() + seperator2 + date.getMinutes()
        + seperator2 + date.getSeconds();
    return currentdate;
}