function subm(e){
    var key = e.key.value.split("=")[1];
    window.location.href = '/authenticate/'+key;
}