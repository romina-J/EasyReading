let fileData = null;

function loadFile() {
    let preview = document.querySelector('file');
    let file = document.querySelector('input[type=file]').files[0];
    let reader = new FileReader();

    reader.onloadend = function () {
        fileData = file;
        document.getElementById("upload").style.display = "";
    };

    if (file) {
        reader.readAsDataURL(file);

    }
}

function uploadFile() {
    let data = new FormData();
    data.append('file', fileData);

    $.ajax({
        url: "/post_image/",
        type: "POST",
        data: data,
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        success: function (data) {
            console.log(data);
            document.getElementById("current_logo").innerHTML = '<img src="data:image/png;base64, ' + data + '" alt="Preview picture" />';
            document.getElementById("clear").style.display = "";
            document.getElementById("upload").style.display = "none";
            document.getElementById("logo").value = data;
        },
        error: function (e) {
            document.getElementById("result").innerHTML = 'Result: Error occurred: ' + e.message;
        }
    });
}

function clearFile() {
    document.getElementById("current_logo").innerHTML = "";
    document.getElementById("logo").value = "";
    document.getElementById("upload").style.display = "none";
    document.getElementById("clear").style.display = "none";
    document.getElementById('file_upload').value = "";
}