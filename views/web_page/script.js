var myText = document.getElementById("my-text");
var result = document.getElementById("result");
var limit = 60;
result.textContent = 0 + "/" + limit;

myText.addEventListener("input", function(){
    var textlength = myText.value.length;
    result.textContent = textlength + "/" + limit;

    if (textlength > limit) {
        myText.style.borderColor = "#ff2851";
        result.style.color = "#ff2851";
    }
});
var myText2 = document.getElementById("my-text2");
var result2 = document.getElementById("result2");
var limit2 = 100;
result2.textContent = 0 + "/" + limit2;

myText.addEventListener("input", function(){
    var textlength2 = myText2.value.length;
    result2.textContent = textlength2 + "/" + limit2;

    if (textlength > limit) {
        myText2.style.borderColor = "#ff2851";
        result2.style.color = "#ff2851";
    }
});

