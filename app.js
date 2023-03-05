let recordButton = document.getElementById("record");

async function startCapture(displayMediaOptions) {
    let captureStream = null;

    try {
        captureStream = await navigator.mediaDevices.getDisplayMedia(
            displayMediaOptions
        );

        // Get audio stream from microphone
        const audioStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
        });

        // Add microphone audio track to screen capture stream
        audioStream.getAudioTracks().forEach((track) => {
            captureStream.addTrack(track);
        });
    } catch (err) {
        console.error(`Error: ${err}`);
    }

    return captureStream;
}

recordButton.addEventListener("click", async () => {
    let captureStream = await startCapture({
        video: {
            cursor: "always",
        },
        audio: true,
    });

    let recorder = new MediaRecorder(captureStream);

    let data = [];

    recorder.ondataavailable = (event) => data.push(event.data);

    recorder.start();

    let stop = document.getElementById("stop");

    stop.addEventListener("click", () => {
        try {
            recorder.stop();
        } catch (error) {
            console.log({ msg: "Stop button pressed without recording." });
        }
    });

    recorder.onstop = (event) => {
        let recordedBlob = new Blob(data, {
            type: "video/webm",
        });

        let recordedVideo = document.createElement("video");
        recordedVideo.controls = true;
        recordedVideo.src = URL.createObjectURL(recordedBlob);
        recordedVideo.classList.add("w-1/4", "rounded-lg");

        let recordHolder = document.getElementById("videos");
        recordHolder.appendChild(recordedVideo);
    };
});
