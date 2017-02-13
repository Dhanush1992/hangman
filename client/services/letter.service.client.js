(function () {
    angular
        .module("Hangman")
        .factory("LetterService", LetterService);

    function LetterService($http) {
        console.log("got to service");

        var api = {
            letter_pressed: letter_pressed,
            new_game: new_game
        };
        return api;
        function new_game(){
            return $http.get("/api/new_game");          // GET request to start a new game from server side service
        }

        function letter_pressed(letter) {
            console.log("letter in client service:"+letter);
            var letterobj = {letter: letter};
            return $http.post("/api/letter_check", letterobj);      // POST the pressed letter to server side service
        }
    }
})();
