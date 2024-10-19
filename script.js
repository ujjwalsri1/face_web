const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const nameInput = document.getElementById('name');
const idInput = document.getElementById('id');
const attendanceListBody = document.querySelector('#attendanceList tbody');

let attendanceCount = 0;
let isCameraActive = false;

// Train button event listener
document.getElementById('train').addEventListener('click', () => {
    if (nameInput.value && idInput.value) {
        startCamera('train');
    } else {
        alert('Please enter both name and ID');
    }
});

// Take attendance button event listener
document.getElementById('takeAttendance').addEventListener('click', () => {
    if (nameInput.value && idInput.value) {
        startCamera('attendance');
    } else {
        alert('Please enter both name and ID');
    }
});

// Download Excel button event listener
document.getElementById('downloadExcel').addEventListener('click', function() {
    let table = document.getElementById('attendanceList');
    let rows = Array.from(table.rows).map(row => 
        Array.from(row.cells).map(cell => cell.innerText).join('\t')).join('\n'
    );

    const blob = new Blob([rows], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance.xls';
    a.click();
    URL.revokeObjectURL(url);
});

async function startCamera(mode) {
    if (!isCameraActive) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        isCameraActive = true;

        setTimeout(() => {
            takePhoto(mode);
        }, 2000); // Allow time to set up camera
    } else {
        takePhoto(mode);
    }
}

function takePhoto(mode) {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const name = nameInput.value;
    const id = idInput.value;

    context.font = "20px Arial";
    context.fillStyle = "white";
    context.fillText(name, 10, 30); // Draw name on canvas

    if (mode === 'attendance') {
        attendanceCount++;
        const row = attendanceListBody.insertRow();
        row.innerHTML = `<td>${attendanceCount}</td><td>${name}</td><td>${id}</td>`;
	context.fillText(name, 10, 30);
    }

    // Stop the video stream based on mode
    const stream = video.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
    isCameraActive = false; // Reset camera active state
}
