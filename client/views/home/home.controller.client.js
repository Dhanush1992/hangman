(function(){
    angular
        .module("Hangman")
        .controller("HomeController", HomeController);

    function HomeController($location, $sce, LetterService) {
        var vm = this;
        vm.letter_pressed = letter_pressed;
        vm.new_game = new_game;
        // list to maintain the set of classes disabled. Every time a user clicks a button,
        // it is disabled until a new game is started.
        var disabledLetterClasses = [];

        // Initialize by starting a new game.
        function init(){

            new_game();
            $("#modal11").hide();
            $('.modal').modal();

        }
        init();

        function new_game(){
            console.log("new game");
            vm.attempts = 0;                            // Keeps track of no of attempts
            vm.gameState = "are playing";               // State of the game: playing,won,lost
            clearCanvas();
            removeClass();

            var promise = LetterService.new_game()      // Calls the method new_game from the client service(letterService)
            promise
                .success(function(replacedString){          // On success gets back the word as an array of letters guessed so far.
                    vm.guessedWordSoFar = replacedString;   // Starting a new game will receive an array of "_" times the no of
                                                            // letters in the word chosen for the game.
                    vm.wordLen = replacedString.length;
                    //console.log(vm.wordLen);
                })
                .error(function(error){

                });
        }

        function letter_pressed(letter){                    // Is called every time a letter(button) is pressed on the html

            $("#"+letter).addClass("disabled");             // JQuery to make the pressed button disabled

            disabledLetterClasses.push(letter);             // Add the letter to the list of disabledLetterClasses

            var promise = LetterService.letter_pressed(letter); // Calls the method letter_pressed from client service
            promise
                .success(function(guessAttempt){                // on success returns an object guessAttempt which has
                    if(guessAttempt.failedAttempt){             // failedAttempt,attempts,gamesLost,guessedWordSoFar,gamesWon
                        vm.attempts = guessAttempt.attempts;    // On a failed guessAttempt ,vm.attempts(attempts in the front end)
                        vm.games_lost = guessAttempt.gamesLost; // is updated and a part of hangman is drawn based on the no of attempts.
                        drawOnFailedGuess(vm.attempts);

                        // Draw hangman
                        if(vm.attempts == 10){                  // If the no of attempts reach 10, the game is lost.
                            disableLetterClasses();             // Disable all letters to halt the game
                            vm.gameState = "Lose!!";
                            $('#modal1').modal('open');         // A modal is displayed indicating the loss
                        }

                    }else{
                        vm.guessedWordSoFar = guessAttempt.guessedWordSoFar;    // On a successful guess attempt, the guessedWordSoFar is updated
                        if(vm.games_won < guessAttempt.gamesWon){               // if the gamesWon count is incremented, it indicates a win
                            disableLetterClasses();                             // Disable all letters to halt the game
                            vm.gameState = "Win!!";
                            $('#modal1').modal('open');                         // A modal is displayed indicating the win
                        }
                        vm.games_won = guessAttempt.gamesWon;                   // gamesWon is updated
                        console.log("gamesWon:"+vm.games_won);
                    }
                    vm.disableButton = true;
                })
                .error(function(error){

                });
        }


        // Function to draw parts of hangman based on the no of attempts
        function drawOnFailedGuess(failedGuessAttempt) {
            switch (failedGuessAttempt) {
                case 1:
                    drawLine(10, 380, 300, 380);        // failed attempt1: Draws part 1 of carousel
                    break;
                case 2:
                    drawLine(30, 380, 30, 20);          // failed attempt2: Draws part 2 of carousel
                    break;
                case 3:
                    drawLine(30, 30, 150, 30);          // failed attempt3: Draws part 3 of carousel
                    break;
                case 4:
                    drawLine(150, 30, 150, 50);         // failed attempt4: Draws part 4 of carousel
                    break;
                case 5:
                    drawCircle(150, 100, 50);           // failed attempt5: Draws head of hangman
                    break;
                case 6:
                    drawLine(150, 150, 150, 300);       // failed attempt6: Draws Torso of hangman
                    break;
                case 7:
                    drawLine(150, 180, 100, 200);       // failed attempt7: Draws right hand of hangman
                    break;
                case 8:
                    drawLine(150, 180, 200, 200);       // failed attempt8: Draws left hand of hangman
                    break;
                case 9:
                    drawLine(150, 300, 100, 350);       // failed attempt9: Draws right leg of hangman
                    break;
                case 10:
                    drawLine(150, 300, 200, 350);       // failed attempt10: Draws left leg of hangman
                    break;
            }
        }

        // function to remove all disabled letter classes. Called to re-enable all buttons for a new game
        function removeClass(){
            for(var i=0;i<disabledLetterClasses.length;i++){
                $("#"+disabledLetterClasses[i]).removeClass("disabled");
            }
            disabledLetterClasses = [];
        }
        // Adds a letter to disabled class
        function disableLetter(letter){
            $("#"+letter).addClass("disabled");
            disabledLetterClasses.push(letter);
        }
        // Make all the letters not pressed so far disabled to halt the game
        function disableLetterClasses(){
            var letterSet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
            var filteredSet =  letterSet.filter(function(x) { return disabledLetterClasses.indexOf(x) < 0 });
            for(var i=0;i<filteredSet.length;i++){
                disableLetter(filteredSet[i]);
            }
        }



        // Clears the canvas to be able draw again
        function clearCanvas(){
            var c = document.getElementById("myCanvas");
            var ctx = c.getContext("2d");
            c.width = c.width;
            // ctx.save();
            //
            // ctx.setTransform(1, 0, 0, 1, 0, 0);
            // ctx.clearRect(0,0,c.width,c.height);
            // ctx.restore();

        }
        // Draws a circle at point xFrom,yFrom of specified radius
        function drawCircle(xFrom,yFrom,radius){
            var c = document.getElementById("myCanvas");    // obtain the canvas element by ID
            var ctx = c.getContext("2d");                   // obtain the context of the canvas
            ctx.beginPath();
            ctx.arc(xFrom,yFrom,radius,0,2*Math.PI);    // Completes the arc to create a circle
            ctx.stroke();
        }
        // Draws a line from point xFrom,yFrom to xTo,yTo
        function drawLine(xFrom,yFrom,xTo,yTo){
            var x = document.getElementById("myCanvas");
            var ctx = x.getContext("2d");
            ctx.moveTo(xFrom,yFrom);
            ctx.lineTo(xTo,yTo);
            ctx.stroke();
        }
        //console.log("reached home controller");

    }
})();