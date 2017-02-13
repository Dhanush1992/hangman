module.exports = function(app){
    // List of words. Can be scaled by populating this array from a huge file of words.
    // List of words from : http://www.manythings.org/vocabulary/lists/l/words.php?f=noll15

    var words = ["paris","london","new york","shanghai","bangalore","boston","acres","adult","advice","arrangement","attempt","August","Autumn","border","breeze","brick","calm","canal","Casey","cast","chose","claws","coach","constantly","contrast","cookies","customs","damage","Danny","deeply","depth","discussion","doll","donkey","Egypt","Ellen","essential","exchange","exist","explanation","facing","film","finest","fireplace","floating","folks","fort","garage","grabbed","grandmother","habit","happily","Harry","heading","hunter","Illinois","image","independent","instant","January","kids","label","Lee","lungs","manufacturing","Martin","mathematics","melted","memory","mill","mission","monkey","Mount","mysterious","neighborhood","Norway","nuts","occasionally","official","ourselves","palace","Pennsylvania","Philadelphia","plates","poetry","policeman","positive","possibly","practical","pride","promised","recall","relationship","remarkable","require","rhyme","rocky","rubbed","rush","sale","satellites","satisfied","scared","selection","shake","shaking","shallow","shout","silly","simplest","slight","slip","slope","soap","solar","species","spin","stiff","swung","tales","thumb","tobacco","toy","trap","treated","tune","University","vapor","vessels","wealth","wolf","zoo"];
    var currentWordChosen;  // A random word is chosen from the list of words
    var guessedWordSoFar;   // Array of letters/blanks indicating the guessed word so far
    var attempts = 0;       // To keep track of no of failed attempts
    var gamesWon = 0;       // To keep track of no of games won
    var gamesLost = 0;      // To keep track of no of games lost


    app.post('/api/letter_check',letter_check);
    app.get('/api/new_game',getWord);

    var http = require('http');

    function letter_check(req, res){
        // getting the letter pressed
        var letterobj = req.body;                       // obtain  the letter object from the body of the request
        var letter = letterobj.letter.toLowerCase();    // Convert the letter to lowercase
        //console.log("letter:", letter);

        var guess = replaceLetter(letter);              // calls replaceLetter to check if the letter is present in the chosen word

        if(guess == -1){                                // On a failed guess, increase the no of attempts
            attempts = attempts + 1;
            if(attempts == 10){                         // if the no of attempts reach 10, game is lost
                gamesLost = gamesLost + 1;
            }
            if(attempts > 10){                          // reset the attempts to 0

                attempts = 0;
            }
            res.send({                                  // send the response object indicating the state of the game
                guessedWordSoFar:guessedWordSoFar,
                attempts:attempts,
                failedAttempt:true,
                gamesLost: gamesLost,
                gamesWon: gamesWon
            });
        }else{
            //console.log("currentwordchosen:"+currentWordChosen+", guessedwordsofar:"+guessedWordSoFar.join(""));
            // Checks if the word is matched completely, if yes increment the game won count
            if(currentWordChosen == guessedWordSoFar.join("")){
                gamesWon = gamesWon + 1;
                attempts = 0;
                //console.log("gamesWon:"+gamesWon);
            }
            res.send({                              // send the response object indicating the state of the game
                guessedWordSoFar:guessedWordSoFar,
                attempts:attempts,
                failedAttempt:false,
                gamesLost:gamesLost,
                gamesWon:gamesWon
            });
        }
    }
    // Replace the letter in the guessedWordSoFar if the letter is present in the chosen word
    // else return -1 indicating a failed guess
    function replaceLetter(letter){
        var str = currentWordChosen;
        var indices = [];
        for(var i=0; i<str.length;i++) {
            if (str[i] === letter) indices.push(i);
        }
        //console.log(indices);
        if(indices.length == 0){
            return -1;
        }
        for(var key in indices){
            var index = indices[key];
            guessedWordSoFar[index] = letter;
        }

        //console.log(guessedWordSoFar);
    }

    // On starting a new game, obtain a random word from the list of words and create a game string
    // and replaced string(array of letters replaced by "_") and send the array of blank characters back to client to start the game.
    function getWord(req,res){
        attempts = 0;
        var word = words[(Math.floor(Math.random() * words.length))];
        var gameString = word.replace(/\s/g, "-");

        currentWordChosen = gameString;

        var replacedString = gameString.replace(/[a-z]/g,"_").split("");
        guessedWordSoFar = replacedString;
        //console.log(replacedString);

        res.send(replacedString);
    }
};

