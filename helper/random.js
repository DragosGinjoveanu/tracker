function randomMessage() {
    var message = [
        "Keep up the good work.",
        "Be a good example for others.",
        "Don't stop now! You'll regret it...",
         "Keep moving forward.",
        "Choose your friends wisely.",
        "You are absolutely unique."
    ];
    var i = Math.floor(message.length * Math.random());
    return message[i];
}

function randomImage() {
    var images = new Array(
        'monster.png',
        'monkey.png', 
        'chicken.png', 
        'pig.png',
        'mouse.png'
    );
    var i = Math.floor(images.length * Math.random());
    return images[i];
}

module.exports = {randomMessage, randomImage}