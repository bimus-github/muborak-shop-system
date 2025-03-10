function getInternetSpeed(callback: (speed: number) => void) {
    const imageAddr = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/1px-PNG_transparency_demonstration_1.png"; // URL of a small image
    var startTime: number, endTime: number;
    const download = new Image();
    if(!window.navigator.onLine) {
        callback(0);
        return
    }
    download.onload = function () {
        endTime = (new Date()).getTime();
        const duration = (endTime - startTime) / 1000; // Duration in seconds
        const speed = (1024 * 8) / duration; // Speed in kbps
        callback(speed);
    }
    startTime = (new Date()).getTime();
    download.src = imageAddr + "?n=" + startTime;
}


export default getInternetSpeed
