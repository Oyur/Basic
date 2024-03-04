document.addEventListener('DOMContentLoaded', () => {
    const videoElement = document.querySelector('video');
    const startStopBtn = document.getElementById('startStopBtn');
    const downloadBtn = document.getElementById('download');
    let mediaRecorder;
    let chunks = [];

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
            videoElement.srcObject = stream;
            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunks.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'video/mp4' });
                chunks = [];
                const videoURL = URL.createObjectURL(blob);
                videoElement.src = videoURL;
                downloadBtn.href = videoURL;
            };
        })
        .catch((error) => {
            console.error('Error accessing media devices:', error);
        });

    let isRecording = false;

    startStopBtn.addEventListener('click', () => {
        if (isRecording) {
            mediaRecorder.stop();
            startStopBtn.textContent = 'Start Recording';
        } else {
            mediaRecorder.start();
            startStopBtn.textContent = 'Stop Recording';
        }

        isRecording = !isRecording;
    });
});