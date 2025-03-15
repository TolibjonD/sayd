if ('Notification' in window) {
    checkNotificationPermission();
}

const TIME = "15:25"

function checkNotificationPermission() {
    const permissionAsked = localStorage.getItem("notificationPermissionAsked");

    if (!permissionAsked) {
        Notification.requestPermission().then(permission => {
            localStorage.setItem("notificationPermissionAsked", "true");
            if (permission === "granted") {
                scheduleNotification(TIME);
            }
        });
    } else if (Notification.permission === "granted") {
        scheduleNotification(TIME); // Fixed to use correct time
    }
}

function playNotificationSound() {
    const audio = new Audio("../sounds/sound.mp3"); // Ensure the file exists
    audio.play().catch(error => console.error("Audio playback failed:", error));
}

function showNotification() {
    if (localStorage.getItem("disableNotifications") === "true") return;

    const options = {
        body: "Do not forget to check your dashboard!",
        icon: "../images/bell.png",
    };

    const notification = new Notification("Reminder", options);
    playNotificationSound();

    notification.onclick = () => {
        if (confirm("Do you want to disable these notifications?")) {
            localStorage.setItem("disableNotifications", "true");
        }
    };
}

// Function to schedule notifications at a specific time
function scheduleNotification(timeString) {
    if (Notification.permission !== 'granted') return;

    const [hour, minute] = timeString.split(":").map(Number);
    const now = new Date();
    let nextNotification = new Date();
    nextNotification.setHours(hour, minute, 0, 0);

    // 🔹 If the current time is **already past the notification time**, trigger immediately
    if (now > nextNotification) {
        console.log("Triggering notification immediately!");
        showNotification();
        nextNotification.setDate(nextNotification.getDate() + 1);
    }

    const delay = nextNotification - now;
    console.log(`Next notification in ${delay / 1000} seconds`);

    setTimeout(() => {
        showNotification();
        setInterval(showNotification, 24 * 60 * 60 * 1000); // Repeat daily
    }, delay);
}
