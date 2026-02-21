function calculateTimeOptimized(n) {

    const start = new Date();
    const sum = 0;

    for (let i = 1; i <= n; i++) {
        sum = sum + i;
    }
    const end = new Date();
    const timetaken = (end - start) / 1000;// deviding by 1000 to convert ms to s as known date works in ms therefore start , end will be in ms
    return timetaken;
}