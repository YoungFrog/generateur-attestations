const files = { // an object of images that we will need
    img1: {
        url: "resources/logo-he2b-black.png"
        // this will be populated with another "data" property, containing the actual image (downloaded from above url)
    }
};

const doc = new PDFDocument({
    // layout: "portrait",
    size: 'A4',
    margins: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    }
});
var stream = doc.pipe(blobStream());

startDownloadFiles();

function startDownloadFiles() {
    const downloadFilesPromises = Object.values(files).map(downloadFile);
    Promise.all(downloadFilesPromises).then(showPDF)
}

async function downloadFile(file) {
    file.data = await fetch(file.url)
        .then(r => r.blob())
        .then(r => r.arrayBuffer());
}

function showPDF() {
    // doc.rect(10, 10, 430, 20).fill("#000000");
    // doc.rect(450, 10, 135, 20).fill("#000000");

    // doc
    //     .moveTo(10, 180)
    //     .lineTo(430, 180)
    //     .stroke();
    // doc
    //     .moveTo(10, 240)
    //     .lineTo(310, 240)
    //     .stroke();
    // doc
    //     .moveTo(10, 280)
    //     .lineTo(310, 280)
    //     .stroke();
    // doc
    //     .moveTo(445, 10)
    //     .lineTo(445, 300)
    //     .dash(5)
    //     .stroke();

    // pass loaded ArrayBuffer data instead of a path to image
    doc.image(files.img1.data, 10, 10, { fit: [160, 160], backgroundColor: 'black' });

    // doc.fontSize(17);
    // doc.fillColor("white").text("TEST1", 12, 13);
    // doc.fillColor("white").text("TEST2", 452, 13);

    doc.end();
}

const a = document.createElement("a");
document.body.appendChild(a);
a.style = "display: none";

let blob;

function download() {
    if (!blob) return;
    var url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = 'test.pdf';
    a.click();
    window.URL.revokeObjectURL(url);
}

stream.on("finish", function () {
    // get a blob you can do whatever you like with
    blob = stream.toBlob("application/pdf");

    const url = stream.toBlobURL('application/pdf');
    const iframe = document.querySelector('iframe')
    iframe.src = url;
});
