function random () {
}
let p= new Promise (random);


function callback() {
    console.log("promise succeeded");

}
p.then(callback)
