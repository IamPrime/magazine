// Fullscreen functions
function openFullscreen() {
    const elem = document.documentElement;

    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
    }

    document.body.classList.add('fullscreen-active');
    document.querySelector('.flipbook-viewport').classList.add('fullscreen');

    // Resize the flipbook for fullscreen
    setTimeout(function () {
        $(window).trigger('resize');
    }, 200);
}

function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
    }

    document.body.classList.remove('fullscreen-active');
    document.querySelector('.flipbook-viewport').classList.remove('fullscreen');

    // Resize the flipbook after exiting fullscreen
    setTimeout(function () {
        $(window).trigger('resize');
    }, 200);
}

// Listen for fullscreen change events
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('mozfullscreenchange', handleFullscreenChange);
document.addEventListener('MSFullscreenChange', handleFullscreenChange);

function handleFullscreenChange() {
    if (!document.fullscreenElement &&
        !document.webkitFullscreenElement &&
        !document.mozFullScreenElement &&
        !document.msFullscreenElement) {
        // Exit fullscreen happened
        document.body.classList.remove('fullscreen-active');
        document.querySelector('.flipbook-viewport').classList.remove('fullscreen');

        // Resize the flipbook
        setTimeout(function () {
            $(window).trigger('resize');
        }, 200);
    }
}
