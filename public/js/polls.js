function newChoice(){
    var div = document.createElement('div');
    div.innerHTML = '<p class="choice">Choice:</p><input type="text" name="labels[]" placeholder="(optional)">';
    document.getElementById('last-choice').appendChild(div); 
}