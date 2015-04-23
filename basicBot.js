/** version: 2.1.4.00036

START[1429226840663] NOW[1429226843027]
[1429226840663]
[1429226843027]

.lastplayed user
.mystats user
.logout cohost
currdj.votes.tasty += 1;

 
<div class="from"><span class="un" style="color: rgb(238, 200, 27);">Booth Alert</span><span class="timestamp" style="display: inline;">9:09am</span></div>
<div class="text" style="color: rgb(255, 255, 255);">Are you ready to play? you are in 1 of the waitlist!</div>

<div class="text" style="color: rgb(239, 37, 37);">
    Username: <span>BuckeyeChick</span><br>
    ID: <span>4104098</span><br>
    Level: <span>13</span><br>
    WaitList Position: <span>Not in WaitList</span><br>
    Joined: <span>4/25/2012, 11:26:07 PM UTC</span><br>
    Rank: <span>Resident DJ</span><br>
    Profile: <a href="https://plug.dj/@/buckeyechick" target="_blank">Click here</a>
</div>
1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456
3 strikes and you're out (for 10 mins)

.unban Dexter Nix
.ban @Dexter Nix
.dasboot 5226880

Levis Homer: 5226916
Dexter Nix:  5226880
Doc_Z: 3837756
Larry: 3864950

Ban Forever:
{"userID":5226916,"reason":1,"duration":"f"}

Booth me:
https://plug.dj/_/booth
Remove current dj:
https://plug.dj/_/booth/remove/3598437
 
function narcisDeleteChat(a){
  $.ajax({url:"https://plug.dj/_/chat/"+a,type:"DELETE"});
}

 
Grab:
{"playlistID":6096830,"historyID":"291d773b-c5e7-4dce-b555-5842efd94b6f"}
Grab - Playlist Insert: 
{"media":[{"id":0,"format":1,"cid":"0gpMlAiqcjU","author":"The Fratellis","title":"Henrietta","image":"//i.ytimg.com/vi/0gpMlAiqcjU/default.jpg","duration":228}],"append":false}

(UPDATED -> Commits on Feb 10, 2015)
 Creator: Yemasthui
    var botCreator = "Matthew (Yemasthui)";
    var botMaintainer = "Benzi (Quoona)"
    var botCreatorIDs = ["3851534", "3934992", "4105209"];
 *Copyright 2014 Yemasthui
 *Modifications (including forks) of the code to fit personal needs are allowed only for personal use and should refer back to the original source.
 *This software is not for profit, any extension, or unauthorised person providing this software is not authorised to be in a position of any monetary gain from this use of this software. Any and all money gained under the use of the software (which includes donations) must be passed on to the original author.
 */

(function () {
    API.getWaitListPosition = function(id){
        try {
            if(typeof id === 'undefined' || id === null){
                id = basicBot.userUtilities.getCurrentPlugUser().id;
            }
            var wl = API.getWaitList();
            for(var i = 0; i < wl.length; i++){
                if(wl[i].id === id){
                    return i;
                }
            }
            return -1;
        }
           catch(err) {
           basicBot.roomUtilities.logException("getWaitListPosition: " + err.message);
        }
    };
    API.getWaitListCount = function(){
        var wl = API.getWaitList();
        return wl.length;
    };
    API.botDjNow = function () {
        try {
            $("#dj-button").click();
        }
        catch(err) {
            basicBot.roomUtilities.logException("botDjNow: " + err.message);
        }
    };
    API.botHopDown = function () {
        try {
            if (!basicBot.roomUtilities.botInWaitList() && !basicBot.roomUtilities.botIsDj()) return;
            $("#dj-button").click();
            setTimeout(function () { $("#dialog-confirm > div:nth-child(3) > div.button.submit").click(); }, 1 * 1000);
            /* This also appears to work:
            setTimeout(function () { $("#dialog-confirm > div:nth-child(3) > div.button.submit > span").click(); }, 1 * 1000);
            */
        }
        catch(err) {
            basicBot.roomUtilities.logException("botHopDown: " + err.message);
        }
    };

    var kill = function () {
        clearInterval(basicBot.room.autodisableInterval);
        clearInterval(basicBot.room.afkInterval);
        basicBot.status = false;
    };

    var storeToStorage = function () {
        localStorage.setItem("basicBotsettings", JSON.stringify(basicBot.settings));
        localStorage.setItem("basicBotRoom", JSON.stringify(basicBot.room));
        var basicBotStorageInfo = {
            time: Date.now(),
            stored: true,
            version: basicBot.version
        };
        localStorage.setItem("basicBotStorageInfo", JSON.stringify(basicBotStorageInfo));

    };

    var subChat = function (chat, obj) {
        try {
            if (typeof chat === "undefined") {
                basicBot.roomUtilities.chatLog("There is a chat text missing.");
                basicBot.roomUtilities.logDebug("There is a chat text missing.");
                return "[Error] No text message found.";
            }
            var lit = '%%';
            for (var prop in obj) {
                chat = chat.replace(lit + prop.toUpperCase() + lit, obj[prop]);
            }
            return chat;
        }
        catch(err) {
           basicBot.roomUtilities.logException("subChat: " + err.message);
        }
    };

    var loadChat = function (cb) {
        if (!cb) cb = function () {
        };
        $.get("https://rawgit.com/SZigmund/basicBot/master/lang/langIndex.json", function (json) {
            var link = basicBot.chatLink;
            if (json !== null && typeof json !== "undefined") {
                langIndex = json;
                link = langIndex[basicBot.settings.language.toLowerCase()];
                if (basicBot.settings.chatLink !== basicBot.chatLink) {
                    link = basicBot.settings.chatLink;
                }
                else {
                    if (typeof link === "undefined") {
                        link = basicBot.chatLink;
                    }
                }
                $.get(link, function (json) {
                    if (json !== null && typeof json !== "undefined") {
                        if (typeof json === "string") json = JSON.parse(json);
                        basicBot.chat = json;
                        cb();
                    }
                });
            }
            else {
                $.get(basicBot.chatLink, function (json) {
                    if (json !== null && typeof json !== "undefined") {
                        if (typeof json === "string") json = JSON.parse(json);
                        basicBot.chat = json;
                        cb();
                    }
                });
            }
        });
    };

    var retrieveSettings = function () {
        var settings = JSON.parse(localStorage.getItem("basicBotsettings"));
        if (settings !== null) {
            for (var prop in settings) {
                basicBot.settings[prop] = settings[prop];
            }
        }
    };

    var retrieveFromStorage = function () {
        try {
        var info = localStorage.getItem("basicBotStorageInfo");
        if (info === null) basicBot.roomUtilities.chatLog(basicBot.chat.nodatafound);
        else {
            var settings = JSON.parse(localStorage.getItem("basicBotsettings"));
            var room = JSON.parse(localStorage.getItem("basicBotRoom"));
            var elapsed = Date.now() - JSON.parse(info).time;
            if ((elapsed < 1 * 60 * 60 * 1000)) {
                basicBot.roomUtilities.chatLog(basicBot.chat.retrievingdata);
                for (var prop in settings) {
                    basicBot.settings[prop] = settings[prop];
                }
                basicBot.room.users = room.users;
                basicBot.room.afkList = room.afkList;
                basicBot.room.historyList = room.historyList;
                basicBot.room.mutedUsers = room.mutedUsers;
                basicBot.room.autoskip = room.autoskip;
                basicBot.room.roomstats = room.roomstats;
                basicBot.room.messages = room.messages;
                basicBot.room.queue = room.queue;
                basicBot.room.newBlacklisted = room.newBlacklisted;
                basicBot.roomUtilities.chatLog(basicBot.chat.datarestored);
            }
        }
        var json_sett = null;
        var roominfo = document.getElementById("room-info");
        info = roominfo.textContent;
        var ref_bot = "@basicBot=";
        var ind_ref = info.indexOf(ref_bot);
        if (ind_ref > 0) {
            var link = info.substring(ind_ref + ref_bot.length, info.length);
            var ind_space = null;
            if (link.indexOf(" ") < link.indexOf("\n")) ind_space = link.indexOf(" ");
            else ind_space = link.indexOf("\n");
            link = link.substring(0, ind_space);
            $.get(link, function (json) {
                if (json !== null && typeof json !== "undefined") {
                    json_sett = JSON.parse(json);
                    for (var prop in json_sett) {
                        basicBot.settings[prop] = json_sett[prop];
                    }
                }
            });
        }
        }
        catch(err) {
           basicBot.roomUtilities.logException("retrieveFromStorage: " + err.message);
        }

    };

    String.prototype.splitBetween = function (a, b) {
        var self = this;
        self = this.split(a);
        for (var i = 0; i < self.length; i++) {
            self[i] = self[i].split(b);
        }
        var arr = [];
        for (var i = 0; i < self.length; i++) {
            if (Array.isArray(self[i])) {
                for (var j = 0; j < self[i].length; j++) {
                    arr.push(self[i][j]);
                }
            }
            else arr.push(self[i]);
        }
        return arr;
    };

    var linkFixer = function (msg) {
        var parts = msg.splitBetween('<a href="', '<\/a>');
        for (var i = 1; i < parts.length; i = i + 2) {
            var link = parts[i].split('"')[0];
            parts[i] = link;
        }
        var m = '';
        for (var i = 0; i < parts.length; i++) {
            m += parts[i];
        }
        return m;
    };

    var newUserWhoisInfo = "";
    var runningBot = false;
    var botCreator = "Matthew aka. Yemasthui";
    var botCreatorIDs = [3837756];
    var botIDs = [3864950, 5226916];
    var botMaintainer = "Benzi (Quoona)";
    var basicBot = {
        /*ZZZ: Updated Version*/
        version: "2.1.4.00036",
        status: false,
        name: "basicBot",
        loggedInID: null,
        loggedInName: "",
        scriptLink: "https://rawgit.com/SZigmund/basicBot/master/basicBot.js",
        scriptTestLink: "https://rawgit.com/SZigmund/basicBot/master/basicBotTEST.js",
        cmdLink: "http://bit.ly/1DbtUV7",
        chatLink: "https://rawgit.com/SZigmund/basicBot/master/lang/en.json",
        chat: null,
        loadChat: loadChat,
        retrieveSettings: retrieveSettings,
        retrieveFromStorage: retrieveFromStorage,
        commandChat: {
            cid: "",
            message: "",
            sub: -1,
            un: "",
            uid: -1,
            type: "message",
            timestamp: null,
            sound: "mention"
        },
        songinfo: {
            songName: "",
            songIndex: -1,
            firstPlayed: null,
            playCount: 0,
            lastPlayed: null,
            songStatsMsg: ""
        },
        settings: {
            autoWootBot: false,
            autoHopUp: true,
            autoHopUpCount: 1,
            autoHopDownCount: 4,
            hoppingDownNow: false,
            botName: "Larry the LAW",
            language: "english",
            chatLink: "https://rawgit.com/SZigmund/basicBot/master/lang/en.json",
            maximumAfk: 60,
            afkRemoval: true,
            afk5Days: true,
            afk7Days: false,
            afkRemoveStart: 7,
            afkRemoveEnd: 17,
            maximumDc: 90,
            bouncerPlus: true,
            blacklistEnabled: true,
            gifEnabled: true,
            lockdownEnabled: false,
            lockGuard: false,
            maximumLocktime: 10,
            cycleGuard: true,
            maximumCycletime: 10,
            voteSkipEnabled: true,
            voteSkipLimit: 4,
            welcomeForeignerMsg: false,
            timeGuard: true,
            maximumSongLength: 8,
            repeatSongs: true,
            repeatSongTime: 180,
            skipSound5Days: true,
            skipSound7Days: false,
            skipSoundStart: 7,
            skipSoundEnd: 15,
            skipSoundRange: "Monday-Friday between 7AM and 3PM EST",
            randomComments: true,
            roulette5Days: true,
            roulette7Days: false,
            rouletteStart: 9,
            rouletteEnd: 17,
            randomRoulette: false,
            randomCommentMin: 60,
            randomCommentMax: 180,
            nextRandomComment: Date.now(),
            /*ZZZ: Disabled Autodisable Auto-Djs*/
            autodisable: false,
            commandCooldown: 30,
            usercommandsEnabled: true,
            lockskipPosition: 3,
            lockskipReasons: [
                ["theme", "This song does not fit the room theme. "],
                ["op", "This song is on the OP list. "],
                ["history", "This song is in the history. "],
                ["mix", "You played a mix, which is against the rules. "],
                ["sound", "The song you played had bad sound quality or no sound. "],
                ["nsfw", "The song you contained was NSFW (image or sound). "],
                ["unavailable", "The song you played was not available for some users. "]
            ],
            tastyCommentArray: [
            ":cake: *** Tasty point for you, you go Glen Coco!  (%%POINTFROM%%) *** :cake:",
            ":cake: *** I don't feel I have to explain my fake points to you Warren. (%%POINTFROM%%) *** :cake:",
            ":cake: *** %%POINTFROM%% thinks this song is pretty fetch. Stop trying to make fetch happen. *** :cake:",
            ":cake: *** That tasty point from %%POINTFROM%% really brings the room together. *** :cake:",
            ":cake: *** The jury may be out on this song but %%POINTFROM%% thinks it’s pretty tasty *** :cake:",
            ":cake: *** %%POINTFROM%% salutes those who rock. *** :cake:",
            ":cake: *** This tune is more soothing than Morgan Freeman's voice. (%%POINTFROM%%) *** :cake:",
            ":cake: *** The Tasty Tasty cake is a lie. (%%POINTFROM%%) *** :cake:",
            ":cake: *** You deserve a promotion. But since %%POINTFROM%% can't do that here, have a tasty point. *** :cake:",
            ":cake: *** :pig: %%POINTFROM%% loves this tune more than bacon!  :pig: *** :cake:",
            ":cake: *** %%POINTFROM%% thinks you listen to the coolest songs. *** :cake:",
            ":cake: *** %%POINTFROM%% loves this song more than a drunk college student loves tacos. *** :cake:",
            ":cake: *** Being awesome is hard, but you make it work. (%%POINTFROM%%) *** :cake:",
            ":cake: *** %%POINTFROM%% likes your style.  *** :cake:",
            ":cake: *** You have a good taste in tunes. (%%POINTFROM%%) *** :cake:",
            ":cake: *** %%POINTFROM%% appreciates this tune more than Santa appreciates chimney grease. *** :cake:",
            ":cake: *** This tune is sweeter than than a bucket of bon-bons! (%%POINTFROM%%) *** :cake:",
            ":cake: *** %%POINTFROM%% enjoys your decision on playing this tune *** :cake:",
            ":cake: *** %%POINTFROM%% finds this song is as fun as a hot tub full of chocolate pudding. *** :cake:",
            ":cake: *** %%POINTFROM%% likes the cut of your jib. *** :cake:",
            ":cake: *** %%POINTFROM%% thinks this song is smoother than a fresh jar of skippy. *** :cake:",
            ":cake: *** %%POINTFROM%% can’t come up with something funny to say so here’s a worthless tasty point. *** :cake:",
            ":cake: *** It may be 106 miles to Chicago but here’s a tasty point (%%POINTFROM%%) *** :cake:",
            ":cake: *** Illinois Tasty Points? %%POINTFROM%% hates Illinois Tasty Points! *** :cake:",
            ":cake: *** %%POINTFROM%% says 'Hey Girl, have a Tasty Point' *** :cake:",
            ":cake: *** %%POINTFROM%% thinks you’re a tasty, tasty rockstar *** :cake:",
            ":cake: *** He likes it. Mikey likes it! (%%POINTFROM%%) *** :cake:",
            ":doughnut: *** Mmmm, doughnuts...(%%POINTFROM%%) *** :doughnut:",
            ":cake: *** Dyn-Oh-Mite! (%%POINTFROM%%) *** :cake:",
            ":cake: *** %%POINTFROM%% thinks this song is the bee’s knees *** :cake:",
            ":cake: *** Now you’re on the trolley! (%%POINTFROM%%) *** :cake:",
            ":cake: *** Thanks to Al Gore %%POINTFROM%% can give you this: :cake: *** :cake:",
            ":cake: *** Goose, take me to bed or lose me forever. (%%POINTFROM%%) *** :cake:",
            ":cake: *** If we weren’t on the internet %%POINTFROM%% would get you tin roof rusted. *** :cake:",
            ":cake: *** :dancer: %%POINTFROM%% gave you a tasty point.  @Larry the Law will now dance the robot in your honor. :dancer: *** :cake:",
            ":cake: *** Beanbags are great and so are you!! (%%POINTFROM%%) *** :cake:",
            ":cake: *** You're smarter than Google and Mary Poppins combined. (%%POINTFROM%%) *** :cake:",
            ":cake: *** Hanging out with you is better than a party with unlimited juice. Which, as we all know, is off the hook. (%%POINTFROM%%) *** :cake:",
            ":cake: *** Shit just got real. (%%POINTFROM%%) *** :cake:",
            ":cake: *** This play is so awesome. It's like you are the superhero of Tasty Tunes. (%%POINTFROM%%) *** :cake:",
            ":cake: *** Yeah... That's the ticket. (%%POINTFROM%%) *** :cake:",
            ":cake: *** This tune is cooler than Mr. Rogers. Which may not seem like a big deal, but that dude would put on a different pair of shoes just to chill in his own home. And that's crazy cool!! (%%POINTFROM%%) *** :cake:",
            ":cake: *** You are so rad!! (%%POINTFROM%%) *** :cake:"
            ],
            EightBallArray: [
            "As I See It Yes", 
            "Ask Again Later", 
            "Better Not Tell You Now", 
            "Cannot Predict Now", 
            "Concentrate and Ask Again", 
            "Don't Count On It", 
            "It Is Certain", 
            "It Is Decidedly So", 
            "Most Likely", 
            "My Reply Is No", 
            "My Sources Say No", 
            "Outlook Good", 
            "Outlook Not So Good", 
            "Reply Hazy Try Again", 
            "Signs Point to Yes", 
            "Very Doubtful", 
            "Without A Doubt", 
            "Yes", 
            "Yes - Definitely", 
            "You May Rely On It",
            "Absolutely", 
            "Answer Unclear Ask Later", 
            "Cannot Foretell Now", 
            "Can't Say Now", 
            "Chances Aren't Good", 
            "Consult Me Later", 
            "Don't Bet On It", 
            "Focus And Ask Again", 
            "Indications Say Yes", 
            "Looks Like Yes", 
            "No", 
            "No Doubt About It", 
            "Positively", 
            "Prospect Good", 
            "So It Shall Be", 
            "The Stars Say No", 
            "Unlikely", 
            "Very Likely", 
            "You Can Count On It",
            "As If",
            "Ask Me If I Care",
            "Dumb Question Ask Another",
            "Forget About It",
            "Get A Clue",
            "In Your Dreams",
            "Not A Chance",
            "Obviously",
            "Oh Please",
            "Sure",
            "That's Ridiculous",
            "Well Maybe",
            "What Do You Think?",
            "Whatever",
            "Who Cares?",
            "Yeah And I'm The Pope",
            "Yeah Right",
            "You Wish",
            "You've Got To Be Kidding",
            "You Look Marvelous", 
            "Your Breath Is So Minty", 
            "You're 100% Fun!", 
            "You're A Winner",
            "At Least I Love You",
            "Have You Lost Weight?",
            "Go flip a quarter",
            "Never gonna happen",
            "Smells like a Yes",
            "Si Amigo, like cheese on nachos",
            "When pigs fly!",
            "No, but I still love you",
            "Give me a dollar, then I'll answer",
            "I got yes written on my forehead",
            "Sorry, but no way",
            "I know, but I'm not telling",
            "I guess so, maybe",
            "Yes! Hooray, Yippee!",
            "Ha Ha Ha, no!",
            "Of course silly",
            "My dog thinks so",
            "Um.. Ok, sure, why not?",
            "Will the sun rise tomorrow?",
            "Yep, like a bird has feathers",
            "You can bet your ass on it",
            "Hell No",
            "Are you stupid?",
            "Hell Yes",
            "Give it up",
            "Maybe if you weren't so lazy",
            "Make it happen",
            "No way, sucka!",
            "Wow, you are an idiot!",
            "Yes, now stop asking!",
            "Ha Ha Ha! Nope!",
            "Don't you have something better to do?",
            "Of course, shit head",
            "5 letters, LOL NO!",
            "Go ask your mama",
            "Just a wild guess, but yes",
            "I really don't care",
            "Damn Right",
            "Boring! Ask something exciting",
            "Swear on my 8 balls it's true",
            "Shit Happens",
            "F*ck Yeah",
            "F*ck No",
            "What the F*ck?",
            "Hell F*cking Yes",
            "Hell F*cking No",
            "You F*cking Crazy?",
            "Of course F*cker",
            "No way F*cker",
            "Who F*cking cares",
            "God Damn F*cking Right!",
            "Not a F*cking chance",
            "I don't F*cking know",
            "No F*cking doubt",
            "No F*cking way",
            "Seriously F*cker?",
            "F*ck, why not.",
            "Don't F*cking count on it",
            "It could F*cking happen",
            "You must be out of your F*cking mind",
            "Sure F*cking thing",
            "F*cking Right",
            "Signs point to F*cking Yes",
            "It is F*cking certain"
            ],
            randomCommentArray: [
            "I told him we already got one",
            "You don't think she'd yada yada sex?....I've yada yada'd sex.",
            "@Bacon_Cheeseburger time for another PBR!",
            "You can't make somebody love you.  You can only stalk them and hope for the best",
            "I stayed up all night to see where the sun went, then it dawned on me.",
            "I went to a chiropractor yesterday for the first time.... he cracked me up!",
            "I know a guy thats addicted to break fluid....... he says he can stop anytime!",
            "A soldier who survived mustard gas and pepper spray is now a seasoned veteran!",
            "Irish Handcuffs:  Holding an alcoholic drink in each hand.",
            "If Apple made a car, would it have Windows?",
            "An apple a day keeps anyone away, If you throw it hard enough",
            "Yesterday at the bank an old lady asked if i could help her check her balance... so i pushed her over",
            "To the guy who invented Zero: Thanks for nothing!",
            "I can hear music coming out of my printer. I think the paper's jammin' again.",
            "People who drink light 'beer' don't like the taste of beer; they just like to pee a lot.",
            "No one looks back on their life and remembers the nights they had plenty of sleep.",
            "Give a man a beer, and he wastes an hour, but teach a man how to brew, and he wastes a lifetime.",
            "Give a man a fish and he will eat for a day. Teach him how to fish, and he will sit in a boat and drink beer all day.",
            "Squats?  I thought you said let's do shots!",
            "I want a beer. I want a giant, ice-cold bottle of beer... and shower sex.",
            "Beer makes you feel the way you ought to feel without beer.",
            "Larry no function beer well without.",
            "Drunk is when you feel sophisticated, but can't pronounce it...",
            "My girlfriend's favorite beer is water. I mean Bud Light.",
            "It's a zombie apocalypse! Quick, grab the beer!",
            "He who drinks beer sleeps well. He who sleeps well cannot sin. He who does not sin goes to heaven. Amen.",
            "There are more old drunks than there are old doctors.",
            "I don't think I've drunk enough beer to understand that.",
            "In dog beers, I've only had one.",
            "There's a time and place for beer....In my hand and NOW!",
            "When I read about the evils of drinking, I gave up reading.",
            "You can drink at 7AM Because the Beastie Boys fought for that kind of thing",
            "I rescued some beer last night.  It was trapped inside a bottle.",
            "There comes a time in the day that no matter the question...the answer is beer!",
            "I've been working out a lot lately. My favorite exercise is a mix between a lunge and a crunch....I call it Lunch.",
            "I call my bathroom the Jim instead of the the John.  So now I can tell all my friends I hit the Jim before I go to work everyday.",
            "When people get a little too chummy with me I like to call them by the wrong name to let them know I don't really care about them",
            "That's what happens when you rub it.",
            "I'm not interested in caring about people",
            "Chase you?  Bitch please, I don't even chase my liquor!",
            "I don't get nearly enough credit for managing not to be a violent psychopath.",
            "Yes I walked away mid-conversation.  You were boring me to death and my survival instincts kicked in",
            "Fishing relaxes me. It'd like yoga, except I still get to kill something.",
            "All is well, the PBR is in the fridge",
            "Quick somebody pull my finger!!",
            "Women, can't live with them....pass the beer nuts!",
            "The older I get, the more people can kiss my a$$",
            "I can't tell if you are on too many drugs or not enough.",
            "My doctor told me to start killing people... Well not in those exact words.  He said I had to reduce stress in my life, which is pretty much the same thing.",
            "Love is spending the rest of your life with someone you want to kill & not doing it because you'd miss them!",
            "And there goes the last F*ck I gave!",
            "My girlfriend woke up this morning with a huge smile on her face.....I love Sharpies!",
            "You don't have to like me...I'm not a Facebook status",
            "I would love to visit you, but I live on the Internet.",
            "If you were running for President, I would vote for you. And clear your search history.  Don't worry I got you.",
            "Lord, please give me patience because if you give me strength, I'll need bail money too...",
            "DRAMA = Dumbass Rejects Asking for More Attention",
            "It's been 55 minutes since the last pearl jam song, what is wrong with you people?",
            "I am presently experiencing life at a rate of several WTF's per hour",
            "If you are a passenger in my car, and I turn the radio up....Do not talk!",
            "As a young child my mother told me I can be anyone I want to be ---- Turns out this is called identity theft!",
            "Do you ever just wanna grab someone by the shoulder, look them deep in the eyes and whisper 'No one gives a shit!!'",
            "Psst... I hear Eddie Vedder likes men",
            "I'm sorry I keep calling you and hanging up.  I just got this new voice activated phone, so every time I holler dumbass it dials you....",
            "Before Walmart you had to buy a ticket to the fair to see a bearded woman.",
            "Hold on a minute.... I'm gonna need something stronger than tea to listen to this BS!!",
            "My greatest fear is one day I will die, and my wife will sell my guns for what I told her I paid for them.",
            "Going to McDonals's for a salad is like going to a prostitute for a hug.",
            "Life is like diarrhea. No matter how hard you try to stop it, the shit keeps coming!!",
            "I'll never know how individuals can fake relationships....I can't even fake a hello to somebody I don't like.",
            "Have you ever had one of those days, when you're holding a stick and everybody looks like a Pinata?",
            "If a telemarketer calls, give the phone to your 3 year-old and tell her it's Santa!!",
            "Why do we use toilet paper?  I need wet wipes!  If you got shit on your arm would you just simply wipe it off with toilet paper?",
            "I'm not angry, I'm happiness challenged!",
            "If you have an opinion about me, please raise your hand....Now put it over your mouth!",
            "In the 80s kids learned from Sesame Street and Mr Rogers.  Now they learn from watching zombies who eat people,a vampires sucking, and teen stars. I'm a bit concerned about the future...",
            "I'd unfriend you but your train wreck life is too entertaining.",
            "When people tell me 'You're going to regret that in the morning' I sleep in until noon because I'm a problem solver.",
            "Dear YouTube it's pretty safe to assume we all want 'To Skip the Ad'",
            "I don't comment on your Facebook statuses for the same reason I don't step in dog shit when I see it.",
            "Today's tip: How to handle stress like a dog. If you can't eat it or play with it then pee on it and walk away.",
            "I do whatever it takes to get the job done. And sometimes it takes a vodka.",
            "Keep talking ... I'm diagnosing you.",
            "I wouldn't say that you have a problem with alcohol but maybe just a teensy weensy difficulty with sobriety.",
            "I don't know why you're complaining about your appearance. Your personality is even worse.",
            "You're so bad you're going to hell in every religion!",
            "I haven't heard from you lately and I've really enjoyed it.",
            "Some people should be thankful that I don't always comment my thoughts on their Facebook posts.",
            "Some days the best part of my job is that my chair swivels.",
            "If I had a nickle for every time you got on my nerves ...I'd have a sock full of nickles to hit you with!",
            "You know your children are growing up when they stop asking you where they came from and refuse to tell you where they're going.",
            "Wisdom for the ages: Never get into a fist fight with anyone who is uglier than you. They have nothing to lose.",
            "So you say you'll be here sometime between noon and five for the service call? Great. I'll be sure to pay my bill sometime between February and June.",
            "If women ran the world we wouldn't have wars, just intense negotiations every 28 days.",
            "To speak before you think is like wiping your ass before you shit!",
            "To the woman in Walmart with six screaming kids: If you're wondering how those condoms got in your shopping cart, you're welcome.",
            "I understand that some people live in their own little world. And sometimes I wish they'd stay there and never visit mine.",
            "I was hoping for a battle of wits but you appear to be unarmed.",
            "I used to be a people person but people ruined that for me.",
            "If you want to feel more attractive just go to Walmart and stay away from the people at the gym.",
            "WARNING: I have restless leg syndrome and may not be able to stop from kicking your ass. Now go ahead and continue with your shenanigans.",
            "There are some things better left unsaid but you can bet your sweet ass I'm going to say them anyway.  :kiss:",
            "I don't need an 'Easy' Button. I need a 'F*CK IT' Button!",
            "No it's okay. I totally wanted to drop everything I was going to do today to take care of your bullshit.",
            "I've had one of those days where my middle finger had to answer every question.",
            "Message to all the drama queens who are looking for attention: Please take a number and go wait in my 'I don't give a shit line'",
            "If it takes you more than an hour to get ready, then you might not be as good looking as you think you are!",
            "I don't judge people based on race, color, religion, sexuality, gender, ability or size. I base it on whether or not they're an asshole.",
            "There's only one thing keeping me from breaking you in half ... I don't want two of you around!",
            "If you have a problem with me please write it nicely on a piece of paper, put it in an envelope, fold it up and shove it up your a$$",
            "There are three kinds of people in the world. People who make things happen. People who watch things happen and people who say 'WTF happened?'",
            "I got so drunk last night, I walked across the dance floor to get a drink and won the dance contest.",
            "If women ruled the world there would be no wars. Just a bunch of jealous countries not talking to each other.",
            "Holy crap! Did you just feel that? I think the whole world just revolved around YOU!",
            "To error is human, to love is divine, to piss me off is a mistake!!",
            "You're right, it's my fault because I forgot you were an idiot.",
            "I'm not anti-social. I just have a strong aversion to B.S., drama and pretending.",
            "I'm Larry. This is my brother, Darryl, and this is my other brother, Darryl",
            "My sex life is like a Ferrari...I don't have a Ferrari.",
            "I just saved a bunch of money on my car insurance by switching...my car into reverse and driving away from the accident. ",
            "No I'm not ignoring you. I suffer from selective hearing, usually triggered by idiots.",
            "I think it's only fair to throw monopoly money at strippers with fake boobs.",
            "Note to Self: It is illegal to stab people for being stupid.",
            "I'm in love with my bed. We're perfect for each other but my alarm clock doesn't want us together. That jealous whore!",
            "Pain makes you stronger. Tears make you braver. A broken heart makes you wiser. And alcohol makes you not remember any of that crap.",
            "Last time I bought a package of condoms and the cashier asked me, 'Do you need a bag?' I said, 'No she isn't that ugly.'",
            "Alcohol won’t solve my problems, but then again neither will milk or orange juice.",
            "I just failed my Health and Safety test. The question was 'what steps would you take in the event of a fire?'. Apparently 'big f*cking ones' was the wrong answer.",
            "Grammar: It's the difference between knowing your shit and knowing you're shit",
            "Only in math problems can you buy 60 cantaloupes and nobody asks what the hell is wrong with you.",
            "Who named Trojan Condoms? The Trojan Horse entered through the city gates, broke open and loads of little guys came out and messed up everyones day.",
            "People who create their own drama deserve their own karma.",
            "ACHOO! If you're allergic to bull-crap, drama, head games, liars, & fake people, keep this sneeze going. I can't wait to see who all does this.",
            "I have to stop saying 'How stupid can you be'. I think people are starting to take it as a challenge.",
            "There's a good chance you don't like me BUT an even better chance that I don't give a crap.",
            "I love it when someone insults me. That means I don’t have to be nice anymore.",
            "I'm sarcastic and have a Smartass attitude. It's a natural defense against Drama, Bullshit and Stupidity. And I don't give a @#$& if you're offended!",
            "Give a man a fish and he will eat for a day. Teach him how to fish, and he will sit in a boat and drink beer all day.",
            "Never go to bed angry. Always stay up and plot your revenge first.",
            "I don't hate you. I'm just not necessarily excited about your existence.",
            "Life is not like a box of chocolates. It's more like a jar of jalapenos. What you do today might burn your ass tomorrow.",
            "I know the voices in my head aren't real..... but sometimes their ideas are just absolutely awesome!",
            "Doing nothing is hard, you never know when you're done.",
            "If you didn't see it with your own eyes, or hear it with your own ears, don't invent it with your small mind and share it with your big mouth!",
            "No matter how smart you are you can never convince a stupid person that they are stupid.",
            "I'm not lazy, I'm just very relaxed.",
            "It's not important to win, it's important to make the other guy lose.",
            "I am too lazy to be lazy.",
            "To make a mistake is human, but to blame it on someone else, that's even more human.",
            "Always remember you're unique, just like everyone else.",
            "Taking your ex back is like going to a garage sale and buying your own crap.",
            "To error is human, to love is divine, to piss me off is a mistake.",
            "A day without dealing with stupid people is like ..., oh never mind, I'll let you know if that ever happens.",
            "One spelling mistake can ruin your life. One husband texted this to his wife: 'Having a wonderful time. Wish you were her.'",
            "Insanity does not run in my family. It strolls through, takes its time and gets to know everyone personally.",
            "I'm so sick and tired of my friends who can't handle their alcohol. The other night they dropped me 3 times while carrying me to the car.",
            "If I say something that offends you, please let me know so I can say it again later.",
            "You're starting to sound reasonable, must be time to up my medications.",
            "Lead me not into temptation, I can find it myself.",
            "Never take life too seriously. Nobody gets out alive anyways.",
            "I didn't say it was your fault. I said I was going to blame you.",
            "My opinions may have changed, but not the fact that I'm right.",
            "WARNING - I have an attitude and I know how to use it.",
            "It's my cat's world. I'm just here to open cans.",
            "I used to be indecisive, but now I’m not too sure.",
            "Lord help me to be the person my dog thinks I am.",
            "Too much of a good thing can be wonderful. - Mae West",
            "I don’t have an attitude problem. You have a perception problem.",
            "People who think they know everything are annoying to those of us who do.",
            "I’m an excellent housekeeper. Every time I get a divorce I keep the house.",
            "I still miss my ex – but guess what? My aim is getting better.",
            "A good lawyer knows the law, a great lawyer knows the judge.",
            "Hey look squirrel",
             "Women, can't live with them....pass the beer nuts!",
            "Do vegetarians eat animal crackers? ",
            "If a jogger runs at the speed of sound, can he still hear his iPod?",
            "If man evolved from monkeys, how come we still have monkeys? ",
            "How do you handcuff a one-armed man?",
            "If God sneezes, what should you say? ",
            "Why is it that everyone driving faster than you is considered an idiot and everyone driving slower than you is a moron? ",
            "Why do they call the little candy bars 'fun sizes'. Wouldn't it be more fun to eat a big one? ",
            "Is it legal to travel down a road in reverse, as long as your following the direction of the traffic?",
            "Why doesn't the fattest man in the world become a hockey goalie? ",
            "When Atheists go to court, do they have to swear on the bible?",
            "How can something be 'new' and 'improved'? if it's new, what was it improving on?",
            "Why do they sterilize lethal injections?",
            "Why aren't drapes double sided so it looks nice on the inside and outside of your home?",
            "Is a pessimist's blood type B-negative? ",
            "Beer is proof that God loves us and wants us to be happy.",
            "I'm trying to see things from your point of view, but I can't get my head that far up your a**. ",
            "Never underestimate the power of stupid people in large groups.",
            "Sometimes my mind wanders; other times it leaves completely.",
            "I am free of all prejudices. I hate everyone equally. ",
            "Why is it that when we 'skate on thin ice', we can 'get in hot water'?",
            "If pro and con are opposites, wouldn't the opposite of progress be congress? ",
            "Why does the Easter bunny carry eggs? Rabbits don't lay eggs.",
            "Why does caregiver and caretaker mean the same thing?",
            "Last night I was looking at the stars and I wondered... where the hell's my ceiling! ",
            "Never play leap frog with a unicorn. Just sayin'.... ",
            "If it's tourist season why can't we shoo them?",
            "What is converted rice and what was it before it converted?",
            "They always say the body was found in a shallow grave!  Don't be lazy, dig a deep grave.",
            "Friends help you move. Real friends help you move dead bodies.",
            "If something 'goes without saying' why do people still say it?",
            "If you don't pay your exorcist, do you get repossessed?",
            "Where are all the mentally handicapped parking spaces for people like me?",
            "Isn't Disney World a people trap operated by a mouse?",
            "If milk goes bad if not refrigerated, why does it not go bad inside the cow?",
            "What's the difference between normal ketchup and fancy ketchup?",
            "Friendship is like peeing on yourself: everyone can see it, but only you get the warm feeling that it brings. ",
            "There are no stupid questions, just stupid people. ",
            "When I die, I want to go peacefully like my Grandfather did, in his sleep -- not screaming, like the passengers in his car. ",
            "You have a cough? Go home tonight, eat a whole box of Ex-Lax, tomorrow you'll be afraid to cough. ",
            "I could tell that my parents hated me. My bath toys were a toaster and a radio. ",
            "Can I lend a machete to your intellectual thicket?",
            "If a kid refuses to sleep during nap time, are they guilty of resisting a rest? ",
            "A child of five would understand this. Send someone to fetch a child of five. ",
            "Anyone who says he can see through women is missing a lot. ",
            "Before I speak, I have something important to say. ",
            "Either he's dead or my watch has stopped. ",
            "I have a mind to join a club and beat you over the head with it. ",
            "I have had a perfectly wonderful evening, ... but this wasn't it. ",
            "I intend to live forever, or die trying. ",
            "I must confess, I was born at a very early age. ",
            "I must say I find television very educational. The minute somebody turns it on, I go to the library and read a good book. ",
            "I never forget a face, but in your case I'll be glad to make an exception. ",
            "I refuse to join any club that would have me as a member. ",
            "I remember the first time I had sex - I kept the receipt. ",
            "I was married by a judge. I should have asked for a jury. ",
            "I worked my way up from nothing to a state of extreme poverty. ",
            "I've got the brain of a four year old. I'll bet he was glad to be rid of it. ",
            "If I held you any closer I would be on the other side of you. ",
            "If you've heard this story before, don't stop me, because I'd like to hear it again. ",
            "Man does not control his own fate. The women in his life do that for him. ",
            "Marriage is a wonderful institution, but who wants to live in an institution? ",
            "Military intelligence is a contradiction in terms. ",
            "My mother loved children - she would have given anything if I had been one.",
            "Next time I see you, remind me not to talk to you. ",
            "No man goes before his time - unless the boss leaves early. ",
            "One morning I shot an elephant in my pajamas. How he got into my pajamas I'll never know. ",
            "Outside of a dog, a book is a man's best friend. Inside of a dog it's too dark to read. ",
            "Politics is the art of looking for trouble, finding it everywhere, diagnosing it incorrectly and applying the wrong remedies. ",
            "Practically everybody in New York has half a mind to write a book, and does. ",
            "Quote me as saying I was mis-quoted. ",
            "Room service? Send up a larger room. ",
            "She got her looks from her father. He's a plastic surgeon. ",
            "The secret of life is honesty and fair dealing. If you can fake that, you've got it made. ",
            "There's one way to find out if a person is honest - ask them. If they says, 'Yes', you know they are a crook. ",
            "Those are my principles, and if you don't like them... well, I have others. ",
            "Well, Art is Art, isn't it? Still, on the other hand, water is water. And east is east and west is west and if you take cranberries and stew them like applesauce they taste much more like prunes than rhubarb does. Now you tell me what you know. ",
            "Who are you going to believe, me or your own eyes? ",
            "Whoever named it necking was a poor judge of anatomy.", 
            "Why should I care about posterity? What's posterity ever done for me? ",
            "Why, I'd horse-whip you if I had a horse. ",
            "Life changes so fast - DO something and you can change it. A small change every day amounts to a lot very quickly.",
            "You're never too late for an uprising!",
            "You can't hear me because I'm not saying anything.",
            "Elephants are not made to hop up and down.",
            "If I ever meet myself, I'll hit myself so hard I won't know what's hit me.",
            "I don't negotiate with terrorists - 'Merica!!",
            "Would you think guanaria should cure diarrhea.... think about it...",
            "What's the point of having a democracy, if everybody's going to vote wrong?",
            "Would you rather: A. Eat a bowl of shit once OR B. have explosive diarrhea for the rest of your life?",
            "Would you rather: A. Have sex with a goat, but no one would know OR B. not have sex with one, but everyone would think you did?",
            "Would you rather: A. Always have to say everything on your mind OR B. never speak again?",
            "Would you rather: A. Be able to turn invisible OR B. be able to fly?",
            "We are stuck with technology when what we really want is just stuff that works. - Every plug user ever",
            "Space, it seems to go on and on forever. But then you get to the end and a gorilla starts throwing barrels at you.",
            "When plug is in command, every mission's a suicide mission!",
            "I was having the most wonderful dream. Except you were there, and you were there, and you were there!",
            "Hey, this is mine. That's mine. All of this is mine. Except that bit. I don't want that bit. But all the rest of this is mine. Hey, this has been a really good day.",
            "Time - Unknown. Location - Unknown. Cause of accident - Unknown. Should someone find this recording, perhaps it will shed light as to what happened here.",
            "That settles it. Spankings all around, then.",
            "I feel pretty, Oh so pretty",
            "I'm feeling a bit kinky... anyone up for some robot fun?",
            "Never let good science, reason, and logic get in the way of a good conspiracy!",
            "I refer you to on-line sources, which can be changed at any time.",
            "It seems normal when they tell you about it, but then a whole camera crew appears and suddenly it's not so fun any more.",
            "Bugs like to touch themselves with their antennae while they watch you sleeping.",
            "I apologize for being the only person who truly comprehends how screwed we are!",
            "Imagination will often carry us to worlds that never were. But without it we go nowhere.",
            "The important thing is not to stop questioning; curiosity has its own reason for existing.",
            "I've got thrills to seek, deaths to defy, mattress tags to tear off.",
            "Don't tell BK but I have run with scissors",
            "Now, it's quite simple to defend yourself against a man armed with a banana. First of all you force him to drop the banana; then, second, you eat the banana, thus disarming him. You have now rendered him 'elpless.",
            "No way, spank your OWN monkey.",
            "If a cloud was the same as a fool, how would you feel about rain?",
            "Monkey recovery program. SIGN UP HERE.",
            "I am ROBOT... hear me beep.",
            "If you get a minute, give it to me.  I'm collecting them to get an extra hour.",
            "Damn shampoo commercials, hair isn't that fun.",
            "No, YOU are the hallucination! Oh wait, that was something else. Never mind.",
            "I'm not crazy. Don't call me crazy! I'm just not user-friendly!",
            "The wizards can't see you now",
            "I know where you live... each and every one of you!",
            "Are you taunting me?",
            "Go away or I shall taunt you a second time",
            "Please save all your bad tunes for a time when I'm not around.  Thanks!",
            "You don’t notice the air, until someone spoils it.",
            "Don’t drink while driving – you will spill the beer.",
            "If you love a woman, you shouldn’t be ashamed to show her to your wife.",
            "Life didn’t work out, but everything else is not that bad.",
            "I feel like Tampax – at a good place, but wrong time…",
            "If someone notices you with an open zipper, answer proudly: professional habit.",
            "If you’re not supposed to eat at night, why is there a light bulb in the refrigerator?",
            "FRIDAY is my second favorite F word.",
            "There is a new trend in our office; everyone is putting names on their food. I saw it today, while I was eating a sandwich named Kevin.",
            "The speed of light is when you take out a bottle of beer out of the fridge before the light comes on.",
            "To weigh 50 kilos and say that you’re fat, that is so female…",
            "I have been to many places but my goal is to go everywhere.",
            "If Mayans could predict the future, why didn’t they predict their extinction?",
            "Did you know that your body is made 70% of water? And now I’m thirsty.",
            "Don’t forget that alcohol helps to remove the stress, the bra, the panties and many other problems.",
            "Alcohol not only expands the blood vessels but also communications.",
            "Alcohol not only helps to make new acquaintances, but also end the old once. ",
            "If only I knew that I will have this headache today, I would have got drunk yesterday.",
            "All the problems fade before a hangover…",
            "Tequila is a good drink: you drink it and you feel like a cactus; the only problem is that in the morning the thorns grow inward.",
            "After the weekend the most difficult task is to remember names… ",
            "It’s better to be a worldwide alcoholic, than an Alcoholic Anonymous.",
            "In principle, I can stop drinking, the thing is – I don’t have such a principle.",
            "I know my limits: if I fall down it means enough.",
            "Why is there so much blood in my alcohol system?",
            "I say NO to the drugs, but they won’t listen.",
            "Smoking is a slow death! But we’re not in a hurry…",
            "I became a vegetarian – switched to weed.",
            "We must pay for the mistakes of our youth… at the drugstore.",
            "What does plug pay their developers in xp?",
            "Color blind people are lucky; They can't tell if their plug name is gray or purple",
            "Friends come and go. Enemies pile up.",
            "I would like to know when someone unfriends me on Facebook, so I could like it.",
            "Maybe you need a ladder to climb out of my business?",
            "I like the sound of you not talking.",
            "I’m not a Facebook status, you don’t have to like me.",
            "I found your nose in my business again.",
            "If a man gives you flowers without any reason, it means there is a reason.",
            "Women can perfectly understand other people, if the people are not men.",
            "Women are very good! They can forgive a man…even if he’s not guilty.",
            "A toast to women: it’s not that good with you, as it is bad without you.",
            "If you think you are fooled by destiny – remember Al Bundy.",
            "God gave us the brain to work out problems. However, we use it to create more problems.",
            "Don’t be nervous if someone is driving ahead of you- the world is round, just think that you’re driving first!",
            "If you can’t beat the record, you can beat up its owner.",
            "Dream carefully, because dreams come true.",
            "Everything always ends well. If not – it’s probably not the end.",
            "If you want but can’t. It means you don’t want it enough.",
            "It’s better to do and regret than regret of not doing.",
            "Everything you do you’re gonna regret. But if you do nothing – you will not only regret but will also suffer.",
            "You’re not sure – outrun and make sure.",
            "The deeper the pit you’re falling into, the more chance you have to learn how to fly.",
            "If you don’t care where you are – it means you’re not lost.",
            "The light at the end of the tunnel – are the front lights of a train.",
            "If the fortune has turned her back on you, you can do whatever you want behind her back.",
            "It is said that, you can’t buy happiness. You only need to know the right places…",
            "If there would be no fools – we would be them.",
            "Artificial intelligence is nothing compared to natural stupidity.",
            "Common sense is not so common",
            "Why there are mistakes that can’t be set right and why are there no mistakes that can’t be done?",
            "Think how much you could do if you wouldn’t care what others think.",
            "I made the same mistakes for so many times, that now I call them traditions.",
            "Here food is a luxury that you don’t need to take your pants off for.",
            "Some people feel the rain. Others just get wet.",
            "Some people are so poor, all they have is money.",
            "It’s just a bad day, not a bad life.",
            "Common sense is like deodorant - The people who need it never use it",
            "Walk away from stupidity and your world becomes a better place",
            "Common sense is not a gift, it's a punishment.  Because you have to deal with those who don't have it.",
            "I know I don’t look like much now, but I’m drinking milk ",
            "I know I don’t look like much now, but I’m drinking milk. ",
            "If I followed you home, would you keep me? ",
            "Hey, did plug just shit it's pants again? ",
            "Hey, did plug just shit it's pants again? ",
            "Hey plug here's to for all those times I got blamed for your issues!  Eff you see kay owe eff eff Plug!!",
            "I always wrap my shit. Using a smart phone without a case is like having unprotected sex. It feels so good but the consequences suck."
            ],
            afkpositionCheck: 30,
            afkRankCheck: "ambassador",
            motdEnabled: false,
            motdInterval: 5,
            motd: "Temporary Message of the Day",
            filterChat: true,
            etaRestriction: false,
            welcome: true,
            opLink: null,
            rulesLink: null,
            themeLink: null,
            fbLink: null,
            youtubeLink: null,
            website: null,
            intervalMessages: [],
            messageInterval: 5,
            songstats: true,
            commandLiteral: ".",
            //songbanlist: "https://rawgit.com/SZigmund/basicBot-customization/master/blacklists/SongBan.json",
            blacklists: {
                BAN: "https://rawgit.com/SZigmund/basicBot-customization/master/blacklists/Banned.json",
                NSFW: "https://rawgit.com/SZigmund/basicBot-customization/master/blacklists/ExampleNSFWlist.json",
                OP: "https://rawgit.com/SZigmund/basicBot-customization/master/blacklists/ExampleOPlist.json"
            }
        },
        room: {
            users: [],
            debug: false,
            afkList: [],
            mutedUsers: [],
            bannedUsers: [],
            skippable: true,
            usercommand: true,
            allcommand: true,
            afkInterval: null,
            blacklistInterval: null,
            randomInterval: null,
            autoskip: false,
            autoskipTimer: null,
            autodisableInterval: null,
            autodisableFunc: function () {
                if (basicBot.status && basicBot.settings.autodisable) {
                    basicBot.roomUtilities.sendChat('.afkdisable');
                    basicBot.roomUtilities.sendChat('.joindisable');
                }
            },
            queueing: 0,
            queueable: true,
            currentDJID: null,
            currentMediaCid: 999,
            currentMediaStart: 999,
            historyList: [],
            cycleTimer: setTimeout(function () {
            }, 1),
            roomstats: {
                accountName: null,
                totalWoots: 0,
                totalCurates: 0,
                totalMehs: 0,
                tastyCount: 0,
                launchTime: null,
                songCount: 0,
                chatmessages: 0
            },
            messages: {
                from: [],
                to: [],
                message: []
            },
            queue: {
                id: [],
                position: []
            },
            blacklists: {

            },
            newBlacklisted: [],
            newBlacklistedSongFunction: null,
            roulette: {
                rouletteStatus: false,
                randomRouletteMin: 45,
                randomRouletteMax: 120,
                nextRandomRoulette: null,
                participants: [],
                countdown: null,
                startRoulette: function () {
                    try  {
                        if (basicBot.room.roulette.rouletteStatus) return;
                        basicBot.room.roulette.rouletteStatus = true;
                        basicBot.room.roulette.countdown = setTimeout(function () { basicBot.room.roulette.endRoulette(); }, 60 * 1000);
                        basicBot.roomUtilities.sendChat(basicBot.chat.isopen);
                    }
                    catch(err) { basicBot.roomUtilities.logException("startRoulette: " + err.message); }
                },
                randomRouletteCheck: function() {
                    try  {
                        if (basicBot.room.roulette.nextRandomRoulette <= Date.now())
                        {
                            basicBot.room.roulette.randomRouletteSetTimer();
                            if (basicBot.settings.randomRoulette === false) return;
                            if (basicBot.roomUtilities.rouletteTimeRange()) basicBot.room.roulette.startRoulette();
                        }
                    }
                    catch(err) { basicBot.roomUtilities.logException("randomRouletteCheck: " + err.message); }
                },
                randomRouletteSetTimer: function () {
                    try  {
                        var randomRange = (basicBot.room.roulette.randomRouletteMax - basicBot.room.roulette.randomRouletteMin)
                        var randomMins = Math.floor(Math.random() * randomRange);
                        randomMins += basicBot.room.roulette.randomRouletteMin;
                        //JIC: Ensure we are in the correct time range:
                        if ((randomMins > basicBot.room.roulette.randomRouletteMax) || (randomMins < basicBot.room.roulette.randomRouletteMin))
                        {
                          randomMins = basicBot.room.roulette.randomRouletteMin + ((basicBot.room.roulette.randomRouletteMax - basicBot.room.roulette.randomRouletteMin) / 2.0)
                        }
                        var nextTime = new Date();
                        var myTimeSpan;
                        myTimeSpan = randomMins*60*1000; // X minutes in milliseconds
                        nextTime.setTime(nextTime.getTime() + myTimeSpan);
                        basicBot.roomUtilities.chatLog("Next Roulette: " + basicBot.roomUtilities.msToStr(myTimeSpan));
                        basicBot.room.roulette.nextRandomRoulette = nextTime;
                    }
                    catch(err) { basicBot.roomUtilities.logException("randomRouletteSetTimer: " + err.message); }
                },
                endRoulette: function () {
                    try {
                        basicBot.room.roulette.rouletteStatus = false;
                        if (basicBot.room.roulette.participants.length === 0) {
                           basicBot.roomUtilities.sendChat("Roulette has ended with no participants");
                           return;
                        }
                        var ind = Math.floor(Math.random() * basicBot.room.roulette.participants.length);
                        var winner = basicBot.room.roulette.participants[ind];
                        basicBot.room.roulette.participants = [];
                        var pos = Math.floor((Math.random() * API.getWaitList().length) + 1);
                        var user = basicBot.userUtilities.lookupUser(winner);
                        var name = user.username;
                        basicBot.roomUtilities.sendChat(subChat(basicBot.chat.winnerpicked, {name: name, position: pos}));
                        setTimeout(function (winner, pos) {
                            basicBot.userUtilities.moveUser(winner, pos, false);
                        }, 1 * 1000, winner, pos);
                    }
                    catch(err) { basicBot.roomUtilities.logException("endRoulette: " + err.message); }
                }
            }
        },
        User: function (id, name) {
            this.id = id;
            this.username = name;
            this.jointime = Date.now();
            this.lastActivity = Date.now();
            this.votes = {
                songs: 0,
                tasty: 0,
                woot: 0,
                meh: 0,
                curate: 0
            };
            this.tastyVote = false;
            this.rolled = false;
            this.lastEta = null;
            this.bootable = false;
            this.beerRun = false;
            this.inMeeting = false;
            this.atLunch = false;
            this.afkWarningCount = 0;
            this.badSongCount = 0;
            this.afkCountdown = null;
            this.inRoom = true;
            this.isMuted = false;
            this.lastDC = {
                time: null,
                position: -1,
                songCount: 0
            };
            this.lastKnownPosition = -1;
            this.lastSeenInLine = null;
        },
        userUtilities: {
            englishMessage: function(lang, username) {
                try {
                    var engMsg = '/me @' + username + ' ';
                    switch(lang){
                        case 'en': break;
                        case 'bg': engMsg += 'Моля, говорете Inglês'; break;
                        case 'fi': engMsg += 'Ole hyvä puhua Inglês'; break;
                        case 'zh': engMsg += '请讲英语'; break;
                        case 'ms': engMsg += 'Sila berbahasa Inggeris'; break;
                        case 'xx': engMsg += 'xx'; break;
                        case 'da': engMsg += 'Vær venlig at tale engelsk.'; break;
                        case 'de': engMsg += 'Bitte sprechen Sie Englisch.'; break;
                        case 'es': engMsg += 'Por favor, hable Inglés.'; break;
                        case 'fr': engMsg += 'Parlez anglais, s\'il vous plaît.'; break;
                        case 'nl': engMsg += 'Spreek Engels, alstublieft.'; break;
                        case 'pl': engMsg += 'Proszę mówić po angielsku.'; break;
                        case 'pt': engMsg += 'Por favor, fale Inglês.'; break;
                        case 'sk': engMsg += 'Hovorte po anglicky, prosím.'; break;
                        case 'cs': engMsg += 'Mluvte prosím anglicky.'; break;
                        case 'sr': engMsg += 'Молим Вас, говорите енглески.'; break;                                  
                    }
                    engMsg += '   (English please)';
                    return engMsg;
                }
                catch(err) {
                  basicBot.roomUtilities.logException("englishMessage: " + err.message);
                }
            },
            getSongStats: function () {
                room.songstat.found
            },
            getJointime: function (user) {
                return user.jointime;
            },
            getCurrentPlugUser: function () {
                return API.getUser();
            },
            getPlugUser: function (user) {
                try {
                    return basicBot.userUtilities.getUser(user);
                }
                catch(err) { basicBot.roomUtilities.logException("userUtilities.getPlugUser: " + err.message); }
            },
            getPlugUserID: function (userid) {
                try {
                    return API.getUser(userid);
                }
                catch(err) { basicBot.roomUtilities.logException("userUtilities.getPlugUserID: " + err.message); }
            },
            getUser: function (user) {
                try {
                    return API.getUser(user.id);
                }
                catch(err) {
                  basicBot.roomUtilities.logException("userUtilities.getUser: " + err.message);
                }
            },
            tastyVote: function (userId, cmd) {
                try {
                var user = basicBot.userUtilities.lookupUser(userId);
                if (user.tastyVote) return;
                var dj = API.getDJ();
                if (typeof dj === 'undefined') return;
                if (dj.id === userId) 
                {
                   basicBot.roomUtilities.sendChat("I'm glad you find your own play tasty @" + user.username);
                   return;
                }
                var tastyComment = basicBot.roomUtilities.tastyComment(cmd);
                user.tastyVote = true;
                //basicBot.roomUtilities.sendChat(subChat(basicBot.chat.tastyvote, {name: user.username}));
                setTimeout(function () { basicBot.roomUtilities.sendChat(subChat(tastyComment, {pointfrom: user.username})); }, 1000);
                
                basicBot.room.roomstats.tastyCount += 1;
                var currdj = basicBot.userUtilities.lookupUser(dj.id);
                currdj.votes.tasty += 1;
                }
                catch(err) {
                  basicBot.roomUtilities.logException("userUtilities.tastyVote: " + err.message);
                }
            },
            resetDC: function (user) {
                user.lastDC.time = null;
                user.lastDC.position = -1;
                user.lastKnownPosition = -1;
                user.lastSeenInLine = null;
                user.lastDC.songCount = 0;
                user.beerRun = false;
                user.inMeeting = false;
                user.atLunch = false;
           },
            updateDC: function (user) {
                user.lastDC.time = Date.now();
                user.lastDC.position = user.lastKnownPosition;
                user.lastDC.songCount = basicBot.room.roomstats.songCount;
            },
            setUserName: function (userId, userName) {
                var user = basicBot.userUtilities.lookupUser(userId);
                if (user.username !== userName) user.username = userName;
            },
            setLastActivityID: function (userId, dispMsg) {
                var user = basicBot.userUtilities.lookupUser(userId);
                basicBot.userUtilities.setLastActivity(user, dispMsg);
            },
            didUserDisconnect: function (user) {
                if (user.beerRun) return true;
                if (user.inMeeting) return true;
                if (user.atLunch) return true;
                if (user.lastDC.time !== null && user.lastDC.position > 0) return true;
                return false;
            },
            setLastActivity: function (user, dispMsg) {
                user.lastActivity = Date.now();
                if ((user.afkWarningCount > 0) && (dispMsg === true)) basicBot.roomUtilities.sendChat(subChat(basicBot.chat.afkUserReset, {name: user.username}));
                user.afkWarningCount = 0;
                clearTimeout(user.afkCountdown);
            },
            setMeetingStatus: function (user, status) {
                user.beerRun = false;
                user.inMeeting = status;
                user.atLunch = false;
            },
            setBeerRunStatus: function (user, status) {
                user.beerRun = status;
                user.inMeeting = false;
                user.atLunch = false;
            },
            setLunchStatus: function (user, status) {
                user.beerRun = false;
                user.inMeeting = false;
                user.atLunch = status;
            },
            getLastActivity: function (user) {
                return user.lastActivity;
            },
            setBootableID: function (username, value) {
                var user = basicBot.userUtilities.lookupUserName(username);
                user.bootable = value;
            },
            getBootableID: function (username) {
                var user = basicBot.userUtilities.lookupUserName(username);
                return user.bootable;
            },
            setRolled: function (username, value) {
                var user = basicBot.userUtilities.lookupUserName(username);
                user.rolled = value;
            },
            getRolled: function (username) {
                var user = basicBot.userUtilities.lookupUserName(username);
                return user.rolled;
            },
            getWarningCount: function (user) {
                return user.afkWarningCount;
            },
            setWarningCount: function (user, value) {
                user.afkWarningCount = value;
 
            },
            removeDJ: function (userId) {
                try {
                    basicBot.roomUtilities.logDebug("Remove DJ1: " + userId);
                    API.moderateRemoveDJ(userId);
                    basicBot.roomUtilities.logDebug("Remove DJ2: " + userId);
                }
                catch(err) {
                  basicBot.roomUtilities.logException("removeDJ: " + err.message);
                }
            },
            skipBadSong: function (userId) {
                API.moderateForceSkip();
                if (basicBot.userUtilities.tooManyBadSongs(userId)) {
                    setTimeout(function () { basicBot.userUtilities.removeDJ(userId); }, 1 * 1000);
                }
            },
            tooManyBadSongs: function (userId) {
                var badCount = basicBot.userUtilities.getBadSongCount(userId);
                badCount += 1;
                basicBot.userUtilities.setBadSongCount(userId, badCount);
                if (badCount > 2) return true;
                return false;
            },
            getBadSongCount: function (userId) {
                var user = basicBot.userUtilities.lookupUser(userId);
                return user.badSongCount;
            },
            setBadSongCount: function (userId, value) {
                var user = basicBot.userUtilities.lookupUser(userId);
                user.badSongCount = value;
            },
            setJoinTime: function (userId, value) {
                var user = basicBot.userUtilities.lookupUser(userId);
                user.jointime = Date.now();
            },
            lookupUser: function (id) {   //getroomuser
                for (var i = 0; i < basicBot.room.users.length; i++) {
                    if (basicBot.room.users[i].id === id) {
                        return basicBot.room.users[i];
                    }
                }
                return false;
            },
            lookupUserName: function (name) {
                for (var i = 0; i < basicBot.room.users.length; i++) {
                    if (basicBot.room.users[i].username.trim() == name.trim()) {
                        return basicBot.room.users[i];
                    }
                }
                return false;
            },
            voteRatio: function (id) {
                var user = basicBot.userUtilities.lookupUser(id);
                var votes = user.votes;
                if (votes.meh === 0) votes.ratio = 1;
                else votes.ratio = (votes.woot / votes.meh).toFixed(2);
                return votes;

            },
            getPermission: function (obj) { //1 requests
                try {
                var u;
                if (typeof obj === "object") u = obj;
                else u = basicBot.userUtilities.getPlugUserID(obj);
                if (botCreatorIDs.indexOf(u.id) > -1) return 10;
                //basicBot.roomUtilities.logDebug("Role: " + u.role);
                //basicBot.roomUtilities.logDebug("Name: " + u.username);
                //basicBot.roomUtilities.logDebug("ID: " + u.id);
                if (u.gRole < 2) return u.role;
                else {
                    switch (u.gRole) {
                        case 2:
                            return 7;
                        case 3:
                            return 8;
                        case 4:
                            return 9;
                        case 5:
                            return 10;
                    }
                }
                return 0;
                }
                catch(err) {
                  basicBot.roomUtilities.logException("getPermission: " + err.message);
                }
            },
            moveUser: function (id, pos, priority) {
                var user = basicBot.userUtilities.lookupUser(id);
                var wlist = API.getWaitList();
                if (API.getWaitListPosition(id) === -1) {
                    if (wlist.length < 50) {
                        API.moderateAddDJ(id);
                        if (pos !== 0) setTimeout(function (id, pos) {
                            API.moderateMoveDJ(id, pos);
                        }, 1250, id, pos);
                    }
                    else {
                        var alreadyQueued = -1;
                        for (var i = 0; i < basicBot.room.queue.id.length; i++) {
                            if (basicBot.room.queue.id[i] === id) alreadyQueued = i;
                        }
                        if (alreadyQueued !== -1) {
                            basicBot.room.queue.position[alreadyQueued] = pos;
                            return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.alreadyadding, {position: basicBot.room.queue.position[alreadyQueued]}));
                        }
                        basicBot.roomUtilities.booth.lockBooth();
                        if (priority) {
                            basicBot.room.queue.id.unshift(id);
                            basicBot.room.queue.position.unshift(pos);
                        }
                        else {
                            basicBot.room.queue.id.push(id);
                            basicBot.room.queue.position.push(pos);
                        }
                        var name = user.username;
                        return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.adding, {name: name, position: basicBot.room.queue.position.length}));
                    }
                }
                else API.moderateMoveDJ(id, pos);
            },
            dclookup: function (id) {
                var user = basicBot.userUtilities.lookupUser(id);
                if (typeof user === 'boolean') return basicBot.chat.usernotfound;
                var name = user.username;
                if (user.lastDC.time === null) {
                    basicBot.userUtilities.resetDC(user);
                    return subChat(basicBot.chat.notdisconnected, {name: name});
                }
                var dc = user.lastDC.time;
                var pos = user.lastDC.position;
                if (pos < 1) {
                    basicBot.userUtilities.resetDC(user);
                    return basicBot.chat.noposition;
                }
                var timeDc = Date.now() - dc;
                var validDC = false;
                if (basicBot.settings.maximumDc * 60 * 1000 > timeDc) {
                    validDC = true;
                }
                var time = basicBot.roomUtilities.msToStr(timeDc);
                if (!validDC) {
                    basicBot.userUtilities.resetDC(user);
                    return (subChat(basicBot.chat.toolongago, {name: basicBot.userUtilities.getPlugUser(user).username, time: time}));
                }
                var songsPassed = basicBot.room.roomstats.songCount - user.lastDC.songCount;
                var afksRemoved = 0;
                var afkList = basicBot.room.afkList;
                for (var i = 0; i < afkList.length; i++) {
                    var timeAfk = afkList[i][1];
                    var posAfk = afkList[i][2];
                    if (dc < timeAfk && posAfk < pos) {
                        afksRemoved++;
                    }
                }
                var newPosition = user.lastDC.position; // - songsPassed - afksRemoved;
                if (newPosition <= 0) newPosition = 1;

                var msg = "";
                if (user.beerRun === true) {
                    msg = subChat(basicBot.chat.beerrunreturn, {name: basicBot.userUtilities.getPlugUser(user).username, time: time, position: newPosition});
                }
                else if (user.inMeeting === true) {
                    msg = subChat(basicBot.chat.meetingreturn, {name: basicBot.userUtilities.getPlugUser(user).username, time: time, position: newPosition});
                }
                else if (user.atLunch === true) {
                    msg = subChat(basicBot.chat.lunchreturn, {name: basicBot.userUtilities.getPlugUser(user).username, time: time, position: newPosition});
                }
                else {
                    msg = subChat(basicBot.chat.valid, {name: basicBot.userUtilities.getPlugUser(user).username, time: time, position: newPosition});
                }
                basicBot.userUtilities.moveUser(user.id, newPosition, true);
                basicBot.userUtilities.resetDC(user);
                user.lastKnownPosition = newPosition;
                user.lastSeenInLine = Date.now();
                return msg;
            }
        },

        roomUtilities: {
            botIsDj: function () {
                try {
                    var dj = API.getDJ();
                    if ((typeof dj === 'undefined') && (wlist.length > 0)) return true;
                    if (typeof dj === 'undefined') return false;
                    if (dj.id === basicBot.loggedInID) return true;
                    return false;
                }
                catch(err) {
                  basicBot.roomUtilities.logException("botIsDj: " + err.message);
                }
            },
            updateWaitlist: function () {
                try {
                    basicBot.roomUtilities.logDebug("============================updateWaitlist============================");
                    var roomUser;
                    var wl = API.getWaitList();
                    for(var pos = 0; pos < wl.length; pos++){
                        roomUser = basicBot.userUtilities.lookupUser(wl[pos].id);
                        //basicBot.roomUtilities.logDebug("User: " + roomUser.username + " Pos: " + (pos + 1) + " Time: " + roomUser.lastSeenInLine);
                        // NEW METH: //
                        roomUser.lastKnownPosition = pos + 1;
                        roomUser.lastSeenInLine = Date.now();
                        // NEW METH: //
                    }
                    basicBot.roomUtilities.logDebug("============================updateWaitlist============================");
                }
                catch(err) {
                  basicBot.roomUtilities.logException("updateWaitlist: " + err.message);
                }
            },
            checkDisconnect: function(user) {
                try {
                    if (!basicBot.userUtilities.didUserDisconnect(user)) return;
                    var toChat = basicBot.userUtilities.dclookup(user.id);
                    basicBot.roomUtilities.sendChat(toChat);
                }
                catch(err) {
                  basicBot.roomUtilities.logException("checkDisconnect: " + err.message);
                }
            },
            resetTastyCount: function () {
                try {
                    basicBot.room.roomstats.tastyCount = 0;
                    for (var i = 0; i < basicBot.room.users.length; i++) {
                        basicBot.room.users[i].tastyVote = false;
                    }
                }
                catch(err) {
                  basicBot.roomUtilities.logException("resetTastyCount: " + err.message);
                }
            },
            botInWaitList: function () {
                try {
                var wl = API.getWaitList();
                for(var i = 0; i < wl.length; i++){
                    if (wl[i].id === basicBot.loggedInID) return true;
                }
                return false;
                }
                catch(err) {
                  basicBot.roomUtilities.logException("botInWaitList: " + err.message);
                }
            },
            bouncerDjing: function () {
                try {
                    var dj = API.getDJ();
                    if ((typeof dj === 'undefined') && (wlist.length > 0)) return true;
                    if (typeof dj === 'undefined') return false;
                    if (basicBot.userUtilities.getPermission(dj.id) > 1) return true;
                    var wl = API.getWaitList();
                    for(var i = 0; i < wl.length; i++){
                        if (basicBot.userUtilities.getPermission(wl[i].id) > 1) return true;
                    }
                    return false;
                }
                catch(err) {
                  basicBot.roomUtilities.logException("bouncerDjing: " + err.message);
                }
        },
            checkHopDown: function () {
                try {
                    if (!basicBot.settings.autoHopUp) return;
                    if (basicBot.loggedInID < 0) return;
                    if (basicBot.roomUtilities.botIsDj()) return;
                    if (!basicBot.roomUtilities.botInWaitList()) return;
                    if (API.getWaitListCount() < basicBot.settings.autoHopDownCount) return;
                    basicBot.roomUtilities.logDebug("TIME TO HOP DOWN!!!!!" + basicBot.loggedInID);
                    API.botHopDown();
                }
                catch(err) {
                  basicBot.roomUtilities.logException("checkHopDown: " + err.message);
                }
            },
            checkHopUp: function () {
                try {
                    if (basicBot.settings.hoppingDownNow) return;
                    if (!basicBot.settings.autoHopUp) return;
                    if (basicBot.loggedInID < 0) return;
                    if (basicBot.roomUtilities.botIsDj()) return;
                    if (basicBot.roomUtilities.botInWaitList()) return;
                    if (basicBot.roomUtilities.bouncerDjing()) return;
                    basicBot.roomUtilities.logDebug("API.getWaitListCount(): " + API.getWaitListCount());
                    if (API.getWaitListCount() >= basicBot.settings.autoHopUpCount) return;
                    basicBot.roomUtilities.logDebug("TIME TO HOP UP!!!!!" + basicBot.loggedInID);
                    API.botDjNow();
                }
                catch(err) {
                  basicBot.roomUtilities.logException("checkHopUp: " + err.message);
                }
            },
            rankToNumber: function (rankString) {
                var rankInt = null;
                switch (rankString) {
                    case "admin":
                        rankInt = 10;
                        break;
                    case "ambassador":
                        rankInt = 7;
                        break;
                    case "host":
                        rankInt = 5;
                        break;
                    case "cohost":
                        rankInt = 4;
                        break;
                    case "manager":
                        rankInt = 3;
                        break;
                    case "bouncer":
                        rankInt = 2;
                        break;
                    case "residentdj":
                        rankInt = 1;
                        break;
                    case "user":
                        rankInt = 0;
                        break;
                }
                return rankInt;
            },
            randomCommentSetTimer: function() {   //Added 02/19/2015 Zig
                try  {
                  //basicBot.roomUtilities.logDebug("SETTING randomCommentSetTimer: " + basicBot.settings.nextRandomComment);
                  var randomRange = (basicBot.settings.randomCommentMax - basicBot.settings.randomCommentMin)
                  var randomMins = Math.floor(Math.random() * randomRange);
                  randomMins += basicBot.settings.randomCommentMin;
                  //basicBot.roomUtilities.logDebug("Random mins: " + randomMins);
                  //JIC: Ensure we are in the correct time range:
                  if ((randomMins > basicBot.settings.randomCommentMax) || (randomMins < basicBot.settings.randomCommentMin))
                  {
                      randomMins = basicBot.settings.randomCommentMin + ((basicBot.settings.randomCommentMax - basicBot.settings.randomCommentMin) / 2.0)
                  }
                  var nextTime = new Date();
                  var myTimeSpan;
                  myTimeSpan = randomMins*60*1000; // X minutes in milliseconds
                  nextTime.setTime(nextTime.getTime() + myTimeSpan);
                  basicBot.settings.nextRandomComment = nextTime;
                  //basicBot.roomUtilities.logDebug("RANDOM TIME: " + basicBot.settings.nextRandomComment);
                  //basicBot.roomUtilities.logDebug("NOW TIME: " + Date.now());
                }  
                catch(err) {
                  basicBot.roomUtilities.logException("randomCommentSetTimer: " + err.message);
                }
            },
            randomCommentSelect: function()  {  //Added 02/19/2015 Zig
                try  {
                    var arrayCount = basicBot.settings.randomCommentArray.length;
                    var randomID = Math.floor(Math.random() * arrayCount);
                    return basicBot.settings.randomCommentArray[randomID];
                }
                catch(err) {
                  basicBot.roomUtilities.logException("randomCommentSelect: " + err.message);
                }
            },
            getSongInfo: function(media) {
                try  {
                    //basicBot.roomUtilities.logDebug("======================getSongInfo======================");
                    //basicBot.roomUtilities.logDebug("basicBot.room.historyList.length: " + basicBot.room.historyList.length);
                    basicBot.songinfo.songName = media.title;
                    for (var idx = 0; idx < basicBot.room.historyList.length; idx++) {
                        if (basicBot.room.historyList[idx][0] === media.cid) {
                            basicBot.songinfo.songIndex = idx;
                            basicBot.songinfo.firstPlayed = basicBot.room.historyList[idx][1];
                            basicBot.songinfo.playCount = basicBot.room.historyList[idx].length - 1;
                            basicBot.songinfo.lastPlayed = basicBot.room.historyList[idx][basicBot.songinfo.playCount];
                            if (basicBot.songinfo.playCount === 1)
                               msg = basicBot.chat.lastplayed1;
                            else
                               msg = basicBot.chat.lastplayed2;
                            basicBot.songinfo.songStatsMsg = subChat(msg, {songname:    basicBot.songinfo.songName , 
                                                   firstPlayed: basicBot.roomUtilities.msToStr(Date.now() - basicBot.songinfo.firstPlayed) ,
                                                   playCount:   basicBot.songinfo.playCount,
                                                   lastPlayed:  basicBot.roomUtilities.msToStr(Date.now() - basicBot.songinfo.lastPlayed) });
                            //basicBot.roomUtilities.chatLog(basicBot.songinfo.songStatsMsg);
                            //for (var idx2 = 0; idx2 <= basicBot.room.historyList[idx].length; idx2++) {
                            //  basicBot.roomUtilities.chatLog("LOGGING: [" + idx2 + "]: " + basicBot.room.historyList[idx][idx2]);
                            //}
                            /*  todoer Add these stats to songs:
                            wootCount: 0,
                            grabCount: 0,
                            mehCount: 0,
                            tastyCount: 0,
                            */
                            return true;
                        }
                    }
                    // set values for new songs:
                    basicBot.songinfo.songStatsMsg = basicBot.chat.lastplayed0;
                    basicBot.songinfo.songIndex = idx;
                    return false;
                }
                catch(err) { basicBot.roomUtilities.logException("getSongInfo: " + err.message); }
            },
            tastyComment: function(cmd)  {  //Added 04/03/2015 Zig
                try  {
                    var arrayCount = basicBot.settings.tastyCommentArray.length;
                    var arrayID = Math.floor(Math.random() * arrayCount);
                    if (cmd === "tasty") return basicBot.settings.tastyCommentArray[arrayID];
                    return "[" + cmd.replace(basicBot.settings.commandLiteral, '') + "] " + basicBot.settings.tastyCommentArray[arrayID];
                }
                catch(err) {
                  basicBot.roomUtilities.logException("tastyComment: " + err.message);
                }
            },
            eightBallSelect: function()  {  //Added 04/01/2015 Zig
                try  {
                    var arrayCount = basicBot.settings.EightBallArray.length;
                    var arrayID = Math.floor(Math.random() * arrayCount);
                    return basicBot.settings.EightBallArray[arrayID];
                }
                catch(err) {
                  basicBot.roomUtilities.logException("eightBallSelect: " + err.message);
                }
            },
            randomCommentCheck: function() {  //Added 02/19/2015 Zig
                  try  {
/*
                  var testTime = new Date();
                  var timeDiff = testTime.getMinutes() - basicBot.settings.nextRandomComment.getMinutes();
                  basicBot.roomUtilities.logDebug("randomCommentCheck:" + testTime.getMinutes() + " - " + basicBot.settings.nextRandomComment.getMinutes());
                  basicBot.roomUtilities.logDebug("randomCommentCheck-NOW TIME: " + Date.now());
                  basicBot.roomUtilities.logDebug("randomCommentCheck-timeDiff: " + timeDiff);
                  if (timeDiff > 0)
                  {
                      basicBot.roomUtilities.randomCommentSetTimer();
                      if (basicBot.settings.randomComments === true) basicBot.roomUtilities.sendChat(basicBot.roomUtilities.randomCommentSelect());
                  }
                  */
                  if (basicBot.settings.nextRandomComment <= Date.now())
                  {
                      basicBot.roomUtilities.randomCommentSetTimer();
                      if (basicBot.settings.randomComments === true) basicBot.roomUtilities.sendChat(basicBot.roomUtilities.randomCommentSelect());
                  }
                }  
                catch(err) {
                  basicBot.roomUtilities.logException("randomCommentCheck: " + err.message);
                }
            },
            isStaff:  function (obj) {  //Added 03/20/2015 Zig
                try {
                    if (basicBot.userUtilities.getPermission(obj) > 0) return true;
                    return false;
                }
                catch(err) {
                  basicBot.roomUtilities.logException("isStaff: " + err.message);
                }
            },
            canSkip: function () {  //Added 02/24/2015 Zig
                try {
                    var dj = API.getDJ();
                    if (!basicBot.roomUtilities.isStaff(dj)) return true;
                    var timeRemaining = API.getTimeRemaining();
                    var newMedia = API.getMedia();
                    //basicBot.roomUtilities.logDebug("timeRemaining: " + timeRemaining);
                    //basicBot.roomUtilities.logDebug("newMedia.duration: " + newMedia.duration);
                    //basicBot.roomUtilities.logInfo("DUR1[" + newMedia.duration + "] REMAIN[" + timeRemaining + "] DIFF[" + (newMedia.duration - timeRemaining) + "]");
                    //basicBot.roomUtilities.logObject(newMedia);
                    if ((newMedia.duration - timeRemaining) > 2) return true;
                    //-------------------------------------------------------------------------------------------------------------------
                    //This is to handle the plug bug where the time remaining is actually longer than the song duration:
                    //-------------------------------------------------------------------------------------------------------------------
                    var songPlayTime = new Date();
                    var currTime = songPlayTime.getTime();
                    //basicBot.roomUtilities.logInfo("CID[" + basicBot.room.currentMediaCid + "] START[" + basicBot.room.currentMediaStart + "] NOW[" + (currTime) + "]");
                    if ((newMedia.cid === basicBot.room.currentMediaCid) && ((currTime - basicBot.room.currentMediaStart) > 3000)) return true;
                    //-------------------------------------------------------------------------------------------------------------------
                    //basicBot.roomUtilities.logInfo("CANNOT SKIP");
                    return false;
                }
                catch(err) {
                  basicBot.roomUtilities.logException("canSkip: " + err.message);
                }
            },
            mehThisSong: function () {  //Added 02/18/2015 Zig
                try  {
                    $("#meh").click();
                }  
                catch(err) {
                  basicBot.roomUtilities.logException("mehThisSong: " + err.message);
                }
            },
            wootThisSong: function () {  //Added 02/18/2015 Zig
                try  {
                     $("#woot").click();
                }  
                catch(err) {
                  basicBot.roomUtilities.logException("wootThisSong: " + err.message);
                }
            },
            afkRemovalNow: function () {
                try {
                    if (!basicBot.settings.afk5Days && !basicBot.settings.afk7Days) return false;
                    var currDate = new Date();
                    //Not on Saturday/Sunday if not monitoring 7 days a week
                    if (!basicBot.settings.afk7Days) {
                        var dayofweek = currDate.getDay();  // [Day of week Sun=0, Mon=1...Sat=6]
                        if (dayofweek === 6 || dayofweek === 0) return false;
                    }
                    var hourofday = currDate.getHours();
                    if (hourofday >= basicBot.settings.afkRemoveStart && hourofday < basicBot.settings.afkRemoveEnd) return true;
                    return false;
                }
                catch(err) { basicBot.roomUtilities.logException("afkRemovalNow: " + err.message); }
            },
            rouletteTimeRange: function () {
                try {
                    if (!basicBot.settings.roulette5Days && !basicBot.settings.roulette7Days) return false;
                    if (basicBot.settings.randomRoulette === false) return false;
                    var currDate = new Date();
                    //Not on Saturday/Sunday if not monitoring 7 days a week
                    if (!basicBot.settings.roulette7Days) {
                        var dayofweek = currDate.getDay();  // [Day of week Sun=0, Mon=1...Sat=6]
                        if (dayofweek === 6 || dayofweek === 0) return false;
                    }
                    var hourofday = currDate.getHours();
                    if (hourofday >= basicBot.settings.rouletteStart && hourofday < basicBot.settings.rouletteEnd) return true;
                    return false;
                }
                catch(err) { basicBot.roomUtilities.logException("rouletteTimeRange: " + err.message); }
            },
            logObject: function (objectToLog) {
                try {
                    for (var prop in objectToLog) {
                        basicBot.roomUtilities.logDebug("Prop: " + prop.toUpperCase() + " value: " + objectToLog[prop]);
                    }
                }
                catch(err) { basicBot.roomUtilities.logException("logObject: " + err.message); }
            },
            whoisinfo: function (reqby, name) {
                try {
                    newUserWhoisInfo = "";
                    var uid = -1;
                    var roomuser = basicBot.userUtilities.lookupUserName(name);
                    basicBot.roomUtilities.logDebug("UserCnt: " + basicBot.room.users.length);
                    if (roomuser !== false) uid = roomuser.id;
                    basicBot.roomUtilities.logDebug("UID: " + uid);
                
                    if (uid < 0) {
                        users = API.getUsers();
                        var len = users.length;
                        for (var i = 0; i < len; ++i){
                            if (users[i].username == name) uid = users[i].id;
                        }
                    }
                    basicBot.roomUtilities.logDebug("UID: " + uid);
                    var whoismsg = "";
                    if (uid < 0) return "Undefined User";
                    var pluguser = basicBot.userUtilities.getPlugUserID(uid);
                    //basicBot.roomUtilities.logObject(pluguser);
                    var avatar = pluguser.avatarID;
                    var level = pluguser.level;
                    var rawjoined = pluguser.joined;
                    var joined = rawjoined.substr(0, 10);
                    var rawlang = pluguser.language;
                    if (rawlang == "en"){ var language = "English";
                    } else if (rawlang == "bg"){ var language = "Bulgarian";
                    } else if (rawlang == "cs"){ var language = "Czech";
                    } else if (rawlang == "fi"){ var language = "Finnish"
                    } else if (rawlang == "fr"){ var language = "French"
                    } else if (rawlang == "pt"){ var language = "Portuguese"
                    } else if (rawlang == "zh"){ var language = "Chinese"
                    } else if (rawlang == "sk"){ var language = "Slovak"
                    } else if (rawlang == "nl"){ var language = "Dutch"
                    } else if (rawlang == "ms"){ var language = "Malay"
                    }
                    var rawrank = pluguser.role;
                    if (rawrank == "0"){ var rank = "User";
                    } else if (rawrank == "1"){ var rank = "Resident DJ";
                    } else if (rawrank == "2"){ var rank = "Bouncer";
                    } else if (rawrank == "3"){ var rank = "Manager"
                    } else if (rawrank == "4"){ var rank = "Co-Host"
                    } else if (rawrank == "5"){ var rank = "Host"
                    } else if (rawrank == "7"){ var rank = "Brand Ambassador"
                    } else if (rawrank == "10"){ var rank = "Admin"
                    }
                    var slug = pluguser.slug;
                    if (typeof slug !== 'undefined') { 
                        var profile = ", Profile: http://plug.dj/@/" + slug;
                        if (level > 4) newUserWhoisInfo = " [" + uid + ": http://plug.dj/@/" + slug + "]";
                    } else { var profile = "";
                    }
                    whoismsg = subChat(basicBot.chat.whois, {name1: reqby, name2: name, id: uid, avatar: avatar, profile: profile, language: language, level: level, joined: joined, rank: rank});
                    return whoismsg;
                }
                catch(err) { basicBot.roomUtilities.logException("whoisinfo: " + err.message); }
            },
            logInfo: function(msg) {
                try {
                   console.log("INFO: " + msg);
                }
                catch(err) { basicBot.roomUtilities.logException("logInfo: " + err.message); }
            },
            isBopCommand: function (cmd) {
                try {
                    var commandList = ['tasty', 'rock', 'props', 'woot', 'groot', 'groovy', 'jam','nice','bop','cowbell','sax','ukulele','tango','samba','disco','waltz','metal',
                              'bob','boogie','cavort','conga','flit','foxtrot','frolic','gambol','hop','hustle','jig','jitter','jitterbug','jive','jump','leap','prance',
                              'promenade','rhumba','shimmy','strut','sway','swing','great','hail','good','acceptable','bad','excellent','exceptional','favorable','marvelous',
                              'positive','satisfactory','satisfying','superb','valuable','wonderful','ace','boss','bully','capital','choice','crack','pleasing','prime','rad',
                              'sound','spanking','sterling','super','superior','welcome','worthy','admirable','agreeable','commendable','congenial','deluxe','first-class',
                              'first-rate','gnarly','gratifying','honorable','neat','precious','recherché','reputable','select','shipshape','splendid','stupendous','keen',
                              'nifty','swell','sensational','fine','cool','perfect','wicked','fab','heavy','incredible','outstanding','phenomenal','remarkable','special',
                              'terrific','unique','aces','capital','dandy','enjoyable','exquisite','fashionable','lovely','love','solid','striking','top-notch',
                              'slick','pillar','exemplary','alarming','astonishing','awe-inspiring','beautiful','breathtaking','fearsome','formidable','frightening','winner',
                              'impressive','intimidating','facinating','prodigious','magnificent','overwhelming','shocking','stunning','stupefying','majestic','grand',
                              'creamy','easy','effortless','fluid','gentle','glossy','peaceful','polished','serene','sleek','soft','tranquil','velvety','soothing','fluent','frictionless',
                              'lustrous','rhythmic','crackerjack','laudable','peachy','praiseworthy','rare','super-duper','unreal','chill','savvy','smart','ingenious','genious',
                              'sweet','delicious','lucious','bonbon','fetch','fetching','appealing','delightful','absorbing','alluring','cute','electrifying',
                              'awesome','bitchin','fly','pleasant','relaxing','mellow','nostalgia','punk','like','fries','cake','drum','guitar','bass','tune','pop',
                              'apple','fantastic','spiffy','yes','fabulous','happy','smooth','classic','mygirlfriend','skank','jiggy','funk','funky','jazz','jazzy','dance','elvis',
                              'hawt','extreme','dude','babes','fun','reggae','party','drums','trumpet','mosh','bang','epic','blues','heart','feels','dope','makeitrain','wumbo',
                              'firstclass','firstrate','topnotch','aweinspiring','superduper','dabomb','dashit','badass','bomb','popcorn','awesomesauce','awesomeness','sick',
                              'sexy','brilliant','steampunk','bagpipes','piccolo','whee','vibe','banjo','harmony','harmonica','flute','dancing','dancin','ducky','approval','winning','okay',
                              'hunkydory','peach','divine','radiant','sublime','refined','foxy','allskate'];
                    if (commandList.indexOf(chat.uid) < 0) return true;
                    return false;
                }
                catch(err) { basicBot.roomUtilities.logException("isBopCommand: " + err.message); }
            },
            chatLog: function(msg) {
                try {
                    API.chatLog(msg);
                }
                catch(err) { basicBot.roomUtilities.logException("chatLog: " + err.message); }
            },
            sendChat: function(msg) {
                try {
                    //basicBot.roomUtilities.logDebug("runningBot: " + runningBot);
                    if (runningBot) API.sendChat(msg);
                    else basicBot.roomUtilities.chatLog(msg);
                }
                catch(err) { basicBot.roomUtilities.logException("sendChat: " + err.message); }
            },
            logDebug: function(msg) {
                try {
                   if (basicBot.room.debug === false) return;
                   console.log("DEBUG: " + msg);
                }
                catch(err) { basicBot.roomUtilities.logException("logDebug: " + err.message); }
            },
            logException: function(msg) {
                try {
                   console.log("ERROR: " + msg);
                }
                catch(err) { console.log("ERROR:logException: " + err.message); }
            },
            skipSoundCloudNow: function () {
                if (!basicBot.settings.skipSound5Days && !basicBot.settings.skipSound7Days) return false;
                var currDate = new Date();
                //Don't skip on Saturday/Sunday if not skipping 7 days a week
                if (!basicBot.settings.skipSound7Days) {
                    var dayofweek = currDate.getDay();  // [Day of week Sun=0, Mon=1...Sat=6]
                    if (dayofweek === 6 || dayofweek === 0) return false;
                }
                var hourofday = currDate.getHours();
                if (hourofday >= basicBot.settings.skipSoundStart && hourofday < basicBot.settings.skipSoundEnd) return true;
                return false;
            },

            msToStr: function (msTime) {
                var ms, msg, timeAway;
                msg = '';
                timeAway = {
                    'days': 0,
                    'hours': 0,
                    'minutes': 0,
                    'seconds': 0
                };
                ms = {
                    'day': 24 * 60 * 60 * 1000,
                    'hour': 60 * 60 * 1000,
                    'minute': 60 * 1000,
                    'second': 1000
                };
                if (msTime > ms.day) {
                    timeAway.days = Math.floor(msTime / ms.day);
                    msTime = msTime % ms.day;
                }
                if (msTime > ms.hour) {
                    timeAway.hours = Math.floor(msTime / ms.hour);
                    msTime = msTime % ms.hour;
                }
                if (msTime > ms.minute) {
                    timeAway.minutes = Math.floor(msTime / ms.minute);
                    msTime = msTime % ms.minute;
                }
                if (msTime > ms.second) {
                    timeAway.seconds = Math.floor(msTime / ms.second);
                }
                if (timeAway.days !== 0) {
                    msg += timeAway.days.toString() + 'd';
                }
                if (timeAway.hours !== 0) {
                    msg += timeAway.hours.toString() + 'h';
                }
                if (timeAway.minutes !== 0) {
                    msg += timeAway.minutes.toString() + 'm';
                }
                if (timeAway.minutes < 1 && timeAway.hours < 1 && timeAway.days < 1) {
                    msg += timeAway.seconds.toString() + 's';
                }
                if (msg !== '') {
                    return msg;
                } else {
                    return false;
                }
            },
            booth: {
                lockTimer: setTimeout(function () {
                }, 1000),
                locked: false,
                lockBooth: function () {
                    API.moderateLockWaitList(!basicBot.roomUtilities.booth.locked);
                    basicBot.roomUtilities.booth.locked = false;
                    if (basicBot.settings.lockGuard) {
                        basicBot.roomUtilities.booth.lockTimer = setTimeout(function () {
                            API.moderateLockWaitList(basicBot.roomUtilities.booth.locked);
                        }, basicBot.settings.maximumLocktime * 60 * 1000);
                    }
                },
                resetOldDisconnects: function () {
                    try {
                        basicBot.roomUtilities.logDebug("======================resetOldDisconnects======================");
                        for (var i = 0; i < basicBot.room.users.length; i++) {
                            var roomUser = basicBot.room.users[i];
                            var dcTime = roomUser.lastDC.time;
                            var dcPos = roomUser.lastDC.position;
                            var miaTime = 0;
                            basicBot.roomUtilities.logDebug("User: " + roomUser.username + " - " + roomUser.id);
                            // DC Time without pos is invalid:
                            if ((dcTime !== null) && (dcPos < 1)) 
                                basicBot.userUtilities.resetDC(roomUser);
                            // If have not been in line for > max DC mins + 30 reset:
                            if ((roomUser.lastSeenInLine !== null) && (dcPos > 0)) {
                                miaTime = Date.now() - roomUser.lastSeenInLine;
                                basicBot.roomUtilities.logDebug("Line miaTime: " + miaTime);
                                if (miaTime > ((basicBot.settings.maximumDc + 30) * 60 * 1000)) basicBot.userUtilities.resetDC(roomUser);
                            }
                            // If last disconnect > max DC mins + 30 reset:
                            if ((dcTime !== null) && (dcPos > 0)) {
                                miaTime = Date.now() - dcTime;
                                basicBot.roomUtilities.logDebug("DC miaTime: " + miaTime);
                                if (miaTime > ((basicBot.settings.maximumDc + 30) * 60 * 1000)) basicBot.userUtilities.resetDC(roomUser);
                            }
                        }
                        basicBot.roomUtilities.logDebug("======================resetOldDisconnects======================");
                    }
                    catch(err) { basicBot.roomUtilities.logException("resetOldDisconnects: " + err.message); }
                },
                checkForReconnect: function () {
                    try {
                        var wl = API.getWaitList();
                        for(var i = 0; i < wl.length; i++){
                            var user = basicBot.userUtilities.lookupUser(wl[i].id);
                            basicBot.roomUtilities.checkDisconnect(user);
                        }
                    }
                    catch(err) {
                        basicBot.roomUtilities.logException("checkForReconnect: " + err.message);
                    }
                },
                checkForDisconnect:  function () {
                    try {
                        //basicBot.roomUtilities.logDebug("eventWaitlistupdate-happens 1st");
                    }
                    catch(err) {
                        basicBot.roomUtilities.logException("checkForDisconnect: " + err.message);
                    }
                },
                unlockBooth: function () {
                    API.moderateLockWaitList(basicBot.roomUtilities.booth.locked);
                    clearTimeout(basicBot.roomUtilities.booth.lockTimer);
                }
            },
            afkCheck: function () {
                try {
                if (!basicBot.status || !basicBot.settings.afkRemoval) return void (0);
                if (!basicBot.roomUtilities.afkRemovalNow()) return void (0);
                var rank = basicBot.roomUtilities.rankToNumber(basicBot.settings.afkRankCheck);
                var djlist = API.getWaitList();
                var lastPos = Math.min(djlist.length, basicBot.settings.afkpositionCheck);
                if (lastPos - 1 > djlist.length) return void (0);
                for (var i = 0; i < lastPos; i++) {
                    if (typeof djlist[i] !== 'undefined') {
                        var id = djlist[i].id;
                        //basicBot.roomUtilities.logDebug("---------------------------------------------------------------------");
                        //basicBot.roomUtilities.logDebug("afkCheck ID: " + id);
                        var user = basicBot.userUtilities.lookupUser(id);
                        if (typeof user !== 'boolean') {
                            //basicBot.roomUtilities.logDebug("afkCheck ID: " + user.id);
                            var plugUser = basicBot.userUtilities.getPlugUser(user);
                            //if (rank !== null && basicBot.userUtilities.getPermission(plugUser) <= rank) {
                            if (rank !== null) {
                                //basicBot.roomUtilities.logDebug("afkCheck rank: " + rank);
                                var name = plugUser.username;
                                var lastActive = basicBot.userUtilities.getLastActivity(user);
                                var inactivity = Date.now() - lastActive;
                                var time = basicBot.roomUtilities.msToStr(inactivity);
                                var warncount = user.afkWarningCount;
                                //basicBot.roomUtilities.logDebug("afkCheck: Act: " + lastActive + " Inact: " + inactivity + " Time: " + time + " Warn: " + warncount);
                                if (inactivity > basicBot.settings.maximumAfk * 60 * 1000) {
                                    //basicBot.roomUtilities.logDebug("afkCheck: INACTIVE USER");
                                    if (warncount === 0) {
                                        basicBot.roomUtilities.sendChat(subChat(basicBot.chat.warning1, {name: name, time: time}));
                                        user.afkWarningCount = 3;
                                        user.afkCountdown = setTimeout(function (userToChange) {
                                            userToChange.afkWarningCount = 1;
                                        }, 90 * 1000, user);
                                    }
                                    else if (warncount === 1) {
                                        basicBot.roomUtilities.sendChat(subChat(basicBot.chat.warning2, {name: name}));
                                        user.afkWarningCount = 3;
                                        user.afkCountdown = setTimeout(function (userToChange) {
                                            userToChange.afkWarningCount = 2;
                                        }, 30 * 1000, user);
                                    }
                                    else if (warncount === 2) {
                                        var pos = API.getWaitListPosition(id);
                                        if (pos !== -1) {
                                            pos++;
                                            basicBot.room.afkList.push([id, Date.now(), pos]);
                                            basicBot.userUtilities.resetDC(user);
                                            API.moderateRemoveDJ(id);
                                            basicBot.roomUtilities.sendChat(subChat(basicBot.chat.afkremove, {name: name, time: time, position: pos, maximumafk: basicBot.settings.maximumAfk}));
                                        }
                                        user.afkWarningCount = 0;
                                    }
                                }
                            }
                        }
                    }
                }
                }
                catch(err) {
                    basicBot.roomUtilities.logException("afkCheck: " + err.message);
                }
                
            },
            changeDJCycle: function () {
                var toggle = $(".cycle-toggle");
                if (toggle.hasClass("disabled")) {
                    toggle.click();
                    if (basicBot.settings.cycleGuard) {
                        basicBot.room.cycleTimer = setTimeout(function () {
                            if (toggle.hasClass("enabled")) toggle.click();
                        }, basicBot.settings.cycleMaxTime * 60 * 1000);
                    }
                }
                else {
                    toggle.click();
                    clearTimeout(basicBot.room.cycleTimer);
                }
            },
            intervalMessage: function () {
                var interval;
                if (basicBot.settings.motdEnabled) interval = basicBot.settings.motdInterval;
                else interval = basicBot.settings.messageInterval;
                if ((basicBot.room.roomstats.songCount % interval) === 0 && basicBot.status) {
                    var msg;
                    if (basicBot.settings.motdEnabled) {
                        msg = basicBot.settings.motd;
                    }
                    else {
                        if (basicBot.settings.intervalMessages.length === 0) return void (0);
                        var messageNumber = basicBot.room.roomstats.songCount % basicBot.settings.intervalMessages.length;
                        msg = basicBot.settings.intervalMessages[messageNumber];
                    }
                    basicBot.roomUtilities.sendChat('/me ' + msg);
                }
            },
            updateBlacklists: function () {
                //basicBot.roomUtilities.logDebug("-------------------------- BLACKLISTS --------------------------");
                for (var bl in basicBot.settings.blacklists) {
                    //basicBot.roomUtilities.logDebug("BlackList: " + bl);
                    basicBot.room.blacklists[bl] = [];
                    if (typeof basicBot.settings.blacklists[bl] === 'function') {
                        //basicBot.roomUtilities.logDebug("BlackList: function");
                        basicBot.room.blacklists[bl] = basicBot.settings.blacklists();
                    }
                    else if (typeof basicBot.settings.blacklists[bl] === 'string') {
                        if (basicBot.settings.blacklists[bl] === '') {
                            //basicBot.roomUtilities.logDebug("BlackList: ''");
                            continue;
                        }
                        try {
                            (function (l) {
                                $.get(basicBot.settings.blacklists[l], function (data) {
                                    if (typeof data === 'string') {
                                        //basicBot.roomUtilities.logDebug("BlackList: data");
                                        data = JSON.parse(data);
                                    }
                                    var list = [];
                                    for (var prop in data) {
                                        if (typeof data[prop].mid !== 'undefined') {
                                            //basicBot.roomUtilities.logDebug("BlackList: push");
                                            list.push(data[prop].mid);
                                        }
                                    }
                                    basicBot.room.blacklists[l] = list;
                                })
                            })(bl);
                        }
                        catch (e) {
                            basicBot.roomUtilities.chatLog('Error setting' + bl + 'blacklist.');
                            basicBot.roomUtilities.logException('Error setting' + bl + 'blacklist.');
                            basicBot.roomUtilities.logException(e.message);
                        }
                    }
                }
            },
            logNewBlacklistedSongs: function () {
                if (typeof console.table !== 'undefined') {
                    console.table(basicBot.room.newBlacklisted);
                }
                else {
                    basicBot.roomUtilities.logDebug(basicBot.room.newBlacklisted);
                }
            },
            exportNewBlacklistedSongs: function () {
                var list = {};
                for (var i = 0; i < basicBot.room.newBlacklisted.length; i++) {
                    var track = basicBot.room.newBlacklisted[i];
                    list[track.list] = [];
                    list[track.list].push({
                        title: track.title,
                        author: track.author,
                        mid: track.mid
                    });
                }
                return list;
            }
        },
        eventChat: function (chat) {
            try {
                if (!runningBot) return;
                chat.message = linkFixer(chat.message);
                chat.message = chat.message.trim();
                basicBot.userUtilities.setLastActivityID(chat.uid, true);
                basicBot.userUtilities.setUserName(chat.uid, chat.un);
                if (basicBot.chatUtilities.chatFilter(chat)) return void (0);
                if (!basicBot.chatUtilities.commandCheck(chat))
                    basicBot.chatUtilities.action(chat);
            }
            catch(err) {
               basicBot.roomUtilities.logException("eventChat: " + err.message);
            }
        },
        eventUserjoin: function (user) {
            if (!runningBot) return;  //todoer spit out the user link
            var known = false;
            var index = null;
            for (var i = 0; i < basicBot.room.users.length; i++) {
                if (basicBot.room.users[i].id === user.id) {
                    known = true;
                    index = i;
                }
            }
            var greet = true;
            var welcomeback = null;
            if (known) {
                basicBot.room.users[index].inRoom = true;
                var u = basicBot.userUtilities.lookupUser(user.id);
                var jt = u.jointime;
                var t = Date.now() - jt;
                if (t < 10 * 1000) greet = false;
                else welcomeback = true;
                basicBot.roomUtilities.checkDisconnect(u);
            }
            else {
                basicBot.room.users.push(new basicBot.User(user.id, user.username));
                welcomeback = false;
            }
            var whoismsg = basicBot.roomUtilities.whoisinfo("Bot", user.username);
            if (whoismsg.length > 0) basicBot.roomUtilities.chatLog(whoismsg);

            // If user doesn't speak English let em know we do:
            var staffMember = false;
            if (basicBot.userUtilities.getPermission(user.id) > 1) staffMember = true;
            if ((user.language.toUpperCase() !== "EN") && (!welcomeback) && 
                (!staffMember) && (basicBot.settings.welcomeForeignerMsg === true)) {
                var engMsg = basicBot.userUtilities.englishMessage(user.language, user.username);
                if (engMsg.length > 0) {
                    setTimeout(function (user) {
                        basicBot.roomUtilities.sendChat(engMsg);
                    }, 1 * 1500, user)
                }
            }

            basicBot.userUtilities.setLastActivityID(user.id, false);
            basicBot.userUtilities.setBadSongCount(user.id, 0);
            basicBot.userUtilities.setJoinTime(user.id);
            
            var welcomeMessage = "";
            if (basicBot.settings.welcome && greet) {
                welcomeback ? welcomeMessage = subChat(basicBot.chat.welcomeback, {name: user.username})
                            : welcomeMessage = subChat(basicBot.chat.welcome, {name: user.username});
                if ((!staffMember) && (!welcomeback)) welcomeMessage += newUserWhoisInfo;
                basicBot.roomUtilities.chatLog(newUserWhoisInfo);
                basicBot.roomUtilities.logDebug("WelcomeBack: " + user.id + ": " + user.username);
                setTimeout(function (user) { basicBot.roomUtilities.sendChat(welcomeMessage); }, 1 * 1000, user);
            }
        },
        eventUserleave: function (user) {
            try {
                if (!runningBot) return;
                basicBot.roomUtilities.logDebug("eventUserleave happens..... tododer");
                var roomUser = basicBot.userUtilities.lookupUser(user.id);
                // If user has not been in line for over 10 mins and they leave reset the DC
                if ((roomUser.lastKnownPosition > 0) && (roomUser.lastSeenInLine !== null)) {
                    basicBot.userUtilities.updateDC(roomUser);
                    var miaTime = Date.now() - roomUser.lastSeenInLine;
                    basicBot.roomUtilities.logDebug("Line miaTime: " + miaTime);
                    if (miaTime > (10 * 60 * 1000)) {
                        basicBot.roomUtilities.logDebug("Line miaTime: " + miaTime + "RESET");
                        basicBot.userUtilities.resetDC(roomUser);
                    }
                }
                if (roomUser.lastKnownPosition > 0) 
                    basicBot.userUtilities.updateDC(roomUser);
                else 
                    basicBot.userUtilities.resetDC(roomUser);
                roomUser.inRoom = false;
            }
            catch(err) {
               basicBot.roomUtilities.logException("eventUserleave: " + err.message);
            }
        },
        eventVoteupdate: function (obj) {
            try {
                if (!runningBot) return;
                for (var i = 0; i < basicBot.room.users.length; i++) {
                    if (basicBot.room.users[i].id === obj.user.id) {
                        if (obj.vote === 1) {
                            basicBot.room.users[i].votes.woot++;
                        }
                        else {
                            basicBot.room.users[i].votes.meh++;
                        }
                    }
                }

                var mehs = API.getScore().negative;
                var woots = API.getScore().positive;
                var dj = API.getDJ();

                if (basicBot.settings.voteSkipEnabled) {
                    if (mehs >= (basicBot.settings.voteSkipLimit)) {
                        basicBot.roomUtilities.sendChat(subChat(basicBot.chat.voteskipexceededlimit, {name: dj.username, limit: basicBot.settings.voteSkipLimit}));
                        basicBot.userUtilities.skipBadSong(obj.dj.id);
                    }
                }
          }
          catch(err) { basicBot.roomUtilities.logException("eventVoteupdate: " + err.message);  }
        },
        eventCurateupdate: function (obj) {
            try {
                if (!runningBot) return;
                for (var i = 0; i < basicBot.room.users.length; i++) {
                    if (basicBot.room.users[i].id === obj.user.id) {
                        basicBot.room.users[i].votes.curate++;
                    }
                }
                basicBot.userUtilities.setLastActivityID(obj.user.id, true);
                basicBot.roomUtilities.sendChat(":musical_note: " + obj.user.username + " snagged this song. :heart: :musical_note:");
            }
            catch(err) {
                basicBot.roomUtilities.logException("eventCurateupdate: " + err.message);
            }
        },
        eventDjadvance: function (obj) {
        try {
            if (!runningBot) return;
            //basicBot.roomUtilities.logDebug("eventDjadvance-happens 2nd");
            var SongSkipped = false;
            var tastyCount = basicBot.room.roomstats.tastyCount;
            basicBot.roomUtilities.resetTastyCount();
            var lastplay = obj.lastPlay;
            if (basicBot.settings.songstats && !(typeof lastplay === 'undefined')) {
                //basicBot.roomUtilities.logDebug("Last DJ: " + lastplay.dj.username);
                if (typeof basicBot.chat.songstatistics === "undefined") {
                    statsMsg = "/me " + lastplay.dj.username + " played " + lastplay.media.author + " - " + lastplay.media.title + ": " + lastplay.score.positive + "W/" + lastplay.score.grabs + "G/" + lastplay.score.negative + "M.";
                }
                else if (tastyCount > 0) {
                    statsMsg = subChat(basicBot.chat.songstatisticstasty, {user: lastplay.dj.username, artist: lastplay.media.author, title: lastplay.media.title, woots: lastplay.score.positive, grabs: lastplay.score.grabs, mehs: lastplay.score.negative, tasty: tastyCount});
                }
                else {
                    statsMsg = subChat(basicBot.chat.songstatistics, {user: lastplay.dj.username, artist: lastplay.media.author, title: lastplay.media.title, woots: lastplay.score.positive, grabs: lastplay.score.grabs, mehs: lastplay.score.negative});
                }
                basicBot.roomUtilities.sendChat(statsMsg);
                //Check to see if DJ should get booted:
                if (basicBot.userUtilities.getBootableID(lastplay.dj.username)) {
                    var bootuser = basicBot.userUtilities.lookupUserName(lastplay.dj.username);
                    setTimeout(function () {  API.moderateRemoveDJ(bootuser.id); }, 1000);
                    setTimeout(function () {  basicBot.userUtilities.resetDC(bootuser); }, 3500);
                }
                basicBot.userUtilities.setBootableID(lastplay.dj.username);
            }
            
            basicBot.roomUtilities.checkHopUp();
            basicBot.roomUtilities.checkHopDown();
            var dj = API.getDJ();
            if (!(typeof dj === 'undefined')) {
                //basicBot.roomUtilities.logDebug("eventDjadvance:2");
                var roomUser = basicBot.userUtilities.lookupUser(dj.id);
                basicBot.userUtilities.resetDC(roomUser);
                roomUser.votes.songs += 1;
            }
            //basicBot.roomUtilities.logDebug("eventDjadvance:3");
            if (typeof lastplay !== 'undefined')
            {
              //basicBot.roomUtilities.logDebug("eventDjadvance:4");
              basicBot.room.roomstats.totalWoots += lastplay.score.positive;
              basicBot.room.roomstats.totalMehs += lastplay.score.negative;
              basicBot.room.roomstats.totalCurates += lastplay.score.grabs;
            }
            basicBot.room.roomstats.songCount++;
            basicBot.roomUtilities.intervalMessage();
            //if (typeof obj.dj === 'undefined') { return; }  //todoer not sure about re-adding this....? (Was commented out previously)
            basicBot.room.currentDJID = obj.dj.id;
            basicBot.userUtilities.setRolled(obj.dj.username, false);

            //basicBot.roomUtilities.logDebug("eventDjadvance:4a");
            if (basicBot.settings.autoWootBot === true) setTimeout(basicBot.roomUtilities.wootThisSong, 3000);

            //basicBot.roomUtilities.logDebug("eventDjadvance:5");
            var mid = obj.media.format + ':' + obj.media.cid;
            for (var bl in basicBot.room.blacklists) {
                if (basicBot.settings.blacklistEnabled) {
                    if (basicBot.room.blacklists[bl].indexOf(mid) > -1) {
                        basicBot.roomUtilities.sendChat(subChat(basicBot.chat.isblacklisted, {blacklist: bl}));
                        basicBot.userUtilities.skipBadSong(obj.dj.id);
                        SongSkipped = true;
                        return;
                    }
                }
            }
            //basicBot.roomUtilities.logDebug("eventDjadvance:5-2");
            // Auto-skip SC song during restricted hours (7AM-3PM EST)
            basicBot.room.currentMediaCid = obj.media.cid;
            var songPlayTime = new Date();
            basicBot.room.currentMediaStart = songPlayTime.getTime();
            if ((basicBot.settings.skipSound5Days || basicBot.settings.skipSound7Days) && !SongSkipped){
                var currMedia = API.getMedia();
                //basicBot.roomUtilities.logDebug("Checking for SC Skip");
                if (basicBot.roomUtilities.skipSoundCloudNow() && currMedia.format === 2) {
                    //basicBot.roomUtilities.logDebug("Skipping SC song");
                    var msg = "Sorry @" + obj.dj.username + " Sound Cloud songs are not permitted in this room " + basicBot.settings.skipSoundRange + " too many regulars cannot hear them.";
                    basicBot.roomUtilities.sendChat(msg);
                    basicBot.userUtilities.skipBadSong(obj.dj.id);
                    return;
                }
            }
        
            //basicBot.roomUtilities.logDebug("eventDjadvance:6");
            var alreadyPlayed = false;
            if (basicBot.roomUtilities.getSongInfo(obj.media)) {
                var lastPlayedMs = (Date.now() - basicBot.songinfo.lastPlayed);
                var repeatLimit = (basicBot.settings.repeatSongTime * 60 * 1000);
                if (basicBot.settings.repeatSongs && (lastPlayedMs < repeatLimit) && (lastPlayedMs > 5000))
                {
                    basicBot.roomUtilities.sendChat(subChat(basicBot.chat.songknown2, {name: obj.dj.username, lasttime: basicBot.roomUtilities.msToStr(lastPlayedMs)}));
                    basicBot.userUtilities.skipBadSong(obj.dj.id);
                    SongSkipped = true;
                }
                else
                {
                    basicBot.room.historyList[basicBot.songinfo.songIndex].push(+new Date());
                }
                alreadyPlayed = true;
            }

            //basicBot.roomUtilities.logDebug("eventDjadvance:7");
            if (!alreadyPlayed) {
                basicBot.room.historyList.push([obj.media.cid, +new Date()]);
                //todoer add a 1st time played message? Maybe??
            }
            //basicBot.roomUtilities.logDebug("eventDjadvance:8");
            var newMedia = obj.media;
            if (basicBot.settings.timeGuard && newMedia.duration > basicBot.settings.maximumSongLength * 60 && !basicBot.room.roomevent && !SongSkipped) {
                var name = obj.dj.username;
                basicBot.roomUtilities.sendChat(subChat(basicBot.chat.timelimit, {name: name, maxlength: basicBot.settings.maximumSongLength}));
                basicBot.userUtilities.skipBadSong(obj.dj.id);
                SongSkipped = true;
            }
            //basicBot.roomUtilities.logDebug("eventDjadvance:10");
            clearTimeout(basicBot.room.autoskipTimer);
            //basicBot.roomUtilities.logDebug("eventDjadvance:11");
            if (basicBot.room.autoskip) {
                var remaining = obj.media.duration * 1000;
                basicBot.room.autoskipTimer = setTimeout(function () {
                    //basicBot.roomUtilities.logDebug("Skipping track.");
                    //basicBot.roomUtilities.sendChat('Song stuck, skipping...');
                    API.moderateForceSkip();
                }, remaining + 3000);
            }
            if (!SongSkipped) basicBot.userUtilities.setBadSongCount(obj.dj.id, 0);
            //basicBot.roomUtilities.logDebug("eventDjadvance:12");
            storeToStorage();
            //basicBot.roomUtilities.logDebug("eventDjadvance:13");
            }
            catch(err) {
               basicBot.roomUtilities.logException("eventDjadvance: " + err.message);
            }
        },
        /*"eventWaitlistupdate happens..... tododer" basicBotTEST.js:1793:6
          "Updating last know dj position" basicBotTEST.js:1822:3
          "eventUserleave happens..... tododer"*/
        eventChatcommand: function (command) {
        // This is triggered when a chat starting with a '/' character is entered
            try {
                if (command === "/bot") {
                    runningBot = (!runningBot);
                    basicBot.roomUtilities.chatLog("Running Bot: " + runningBot);
                    return;
                }
                //todoer TEST
                basicBot.commandChat.cid = "";
                basicBot.commandChat.message = basicBot.settings.commandLiteral + command.substring(1, command.length);
                basicBot.commandChat.sub = -1;
                basicBot.commandChat.un = basicBot.loggedInName;
                basicBot.commandChat.uid = basicBot.loggedInID;
                basicBot.commandChat.type = "message";
                basicBot.commandChat.timestamp = Date.now();
                basicBot.commandChat.sound = "mention";
                basicBot.chatUtilities.commandCheck(basicBot.commandChat);
            }
            catch(err) { basicBot.roomUtilities.logException("eventChatcommand: " + err.message); }
        },
        eventModskip: function (users) {
            // This is triggered when a mod skips a song
             if (!runningBot) return;
       },
        eventWaitlistupdate: function (users) {
            try {
                if (!runningBot) return;
                basicBot.roomUtilities.logDebug("eventWaitlistupdate happens..... tododer");
                basicBot.roomUtilities.booth.checkForDisconnect();
                basicBot.roomUtilities.booth.checkForReconnect();
                if (users.length < 50) {
                    if (basicBot.room.queue.id.length > 0 && basicBot.room.queueable) {
                        basicBot.room.queueable = false;
                        setTimeout(function () {
                            basicBot.room.queueable = true;
                        }, 500);
                        basicBot.room.queueing++;
                        var id, pos;
                        setTimeout(
                            function () {
                                id = basicBot.room.queue.id.splice(0, 1)[0];
                                pos = basicBot.room.queue.position.splice(0, 1)[0];
                                API.moderateAddDJ(id, pos);
                                setTimeout(
                                    function (id, pos) {
                                        API.moderateMoveDJ(id, pos);
                                        basicBot.room.queueing--;
                                        if (basicBot.room.queue.id.length === 0) setTimeout(function () {
                                            basicBot.roomUtilities.booth.unlockBooth();
                                        }, 1000);
                                    }, 1000, id, pos);
                            }, 1000 + basicBot.room.queueing * 2500);
                    }
                }
                basicBot.roomUtilities.updateWaitlist();
                basicBot.roomUtilities.booth.resetOldDisconnects();
            }
            catch(err) { basicBot.roomUtilities.logException("eventWaitlistupdate: " + err.message); }
        },
        chatcleaner: function (chat) {
            if (!basicBot.settings.filterChat) return false;
            if (basicBot.userUtilities.getPermission(chat.uid) > 1) return false;
            var msg = chat.message;
            var containsLetters = false;
            for (var i = 0; i < msg.length; i++) {
                ch = msg.charAt(i);
                if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || (ch >= '0' && ch <= '9') || ch === ':' || ch === '^') containsLetters = true;
            }
            if (msg === '') {
                return true;
            }
            if (!containsLetters && (msg.length === 1 || msg.length > 3)) return true;
            msg = msg.replace(/[ ,;.:\/=~+%^*\-\\"'&@#]/g, '');
            var capitals = 0;
            var ch;
            for (var i = 0; i < msg.length; i++) {
                ch = msg.charAt(i);
                if (ch >= 'A' && ch <= 'Z') capitals++;
            }
            if (capitals >= 40) {
                basicBot.roomUtilities.sendChat(subChat(basicBot.chat.caps, {name: chat.un}));
                return true;
            }
            msg = msg.toLowerCase();
            if (msg === 'skip') {
                basicBot.roomUtilities.sendChat(subChat(basicBot.chat.askskip, {name: chat.un}));
                return true;
            }
            for (var j = 0; j < basicBot.chatUtilities.spam.length; j++) {
                if (msg === basicBot.chatUtilities.spam[j]) {
                    basicBot.roomUtilities.sendChat(subChat(basicBot.chat.spam, {name: chat.un}));
                    return true;
                }
            }
            return false;
        },
        chatUtilities: {
            chatFilter: function (chat) {
                var msg = chat.message;
                var perm = basicBot.userUtilities.getPermission(chat.uid);
                var user = basicBot.userUtilities.lookupUser(chat.uid);
                var isMuted = false;
                for (var i = 0; i < basicBot.room.mutedUsers.length; i++) {
                    if (basicBot.room.mutedUsers[i] === chat.uid) isMuted = true;
                }
                if (isMuted) {
                    API.moderateDeleteChat(chat.cid);
                    return true;
                }
                if (basicBot.settings.lockdownEnabled) {
                    if (perm === 0) {
                        API.moderateDeleteChat(chat.cid);
                        return true;
                    }
                }
                if (basicBot.chatcleaner(chat)) {
                    API.moderateDeleteChat(chat.cid);
                    return true;
                }
                /**
                 var plugRoomLinkPatt = /(\bhttps?:\/\/(www.)?plug\.dj[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
                 if (plugRoomLinkPatt.exec(msg)) {
                    if (perm === 0) {
                        basicBot.roomUtilities.sendChat(subChat(basicBot.chat.roomadvertising, {name: chat.un}));
                        API.moderateDeleteChat(chat.cid);
                        return true;
                    }
                }
                 **/
                if (msg.indexOf('http://adf.ly/') > -1) {
                    API.moderateDeleteChat(chat.cid);
                    basicBot.roomUtilities.sendChat(subChat(basicBot.chat.adfly, {name: chat.un}));
                    return true;
                }
                if (msg.indexOf('autojoin was not enabled') > 0 || msg.indexOf('AFK message was not enabled') > 0 || msg.indexOf('.afkdisable') > 0 || msg.indexOf('.joindisable') > 0 || msg.indexOf('autojoin disabled') > 0 || msg.indexOf('AFK message disabled') > 0) {
                    API.moderateDeleteChat(chat.cid);
                    return true;
                }

                var rlJoinChat = basicBot.chat.roulettejoin;
                var rlLeaveChat = basicBot.chat.rouletteleave;

                var joinedroulette = rlJoinChat.split('%%NAME%%');
                if (joinedroulette[1].length > joinedroulette[0].length) joinedroulette = joinedroulette[1];
                else joinedroulette = joinedroulette[0];

                var leftroulette = rlLeaveChat.split('%%NAME%%');
                if (leftroulette[1].length > leftroulette[0].length) leftroulette = leftroulette[1];
                else leftroulette = leftroulette[0];

                if ((msg.indexOf(joinedroulette) > -1 || msg.indexOf(leftroulette) > -1) && chat.uid === basicBot.loggedInID) {
                    setTimeout(function (id) {
                        API.moderateDeleteChat(id);
                    }, 2 * 1000, chat.cid);
                    return true;
                }
                return false;
            },
            commandCheck: function (chat) {
            //chat.uid chat.message chat.cid
                try {
                    var cmd;
                    //basicBot.roomUtilities.logObject(chat);
                    //basicBot.roomUtilities.logDebug("commandCheck chat: " + chat.message);
                    if (chat.message.substring(0,1) === basicBot.settings.commandLiteral) {
                        var space = chat.message.indexOf(' ');
                        if (space === -1) {
                            cmd = chat.message;
                        }
                        else cmd = chat.message.substring(0, space);
                    }
                    else return false;
                    //basicBot.roomUtilities.logDebug("commandCheck cmd: " + cmd);
                    //basicBot.roomUtilities.logDebug("commandCheck chat.uid: " + chat.uid);
                    var userPerm = basicBot.userUtilities.getPermission(chat.uid);
                    if (chat.message !== ".join" && chat.message !== ".leave" && (!basicBot.roomUtilities.isBopCommand())) {
                        //basicBot.roomUtilities.logDebug("commandCheck1: " + cmd);
                        if (userPerm === 0 && !basicBot.room.usercommand) return void (0);
                        //basicBot.roomUtilities.logDebug("commandCheck2: " + cmd);
                        if (!basicBot.room.allcommand) return void (0);
                        //basicBot.roomUtilities.logDebug("commandCheck3: " + cmd);
                    }
                    if (chat.message === '.eta' && basicBot.settings.etaRestriction) {
                        if (userPerm < 2) {
                            var u = basicBot.userUtilities.lookupUser(chat.uid);
                            if (u.lastEta !== null && (Date.now() - u.lastEta) < 1 * 60 * 60 * 1000) {
                                if (chat.cid.length > 0) API.moderateDeleteChat(chat.cid);
                                //basicBot.roomUtilities.logDebug("commandCheck4: " + cmd);
                                return void (0);
                            }
                            else u.lastEta = Date.now();
                        }
                    }
                    //basicBot.roomUtilities.logDebug("commandCheck5: " + cmd);
                    var executed = false;

                    for (var comm in basicBot.commands) {
                        var cmdCall = basicBot.commands[comm].command;
                        if (!Array.isArray(cmdCall)) {
                            cmdCall = [cmdCall]
                        }
                        for (var i = 0; i < cmdCall.length; i++) {
                            if (basicBot.settings.commandLiteral + cmdCall[i] === cmd) {
                                basicBot.commands[comm].functionality(chat, basicBot.settings.commandLiteral + cmdCall[i]);
                                executed = true;
                                break;
                            }
                        }
                    }

                    //basicBot.roomUtilities.logDebug("commandCheck6: executed: " + executed);
                    if (executed && userPerm === 0) {
                        basicBot.room.usercommand = false;
                        setTimeout(function () {
                            basicBot.room.usercommand = true;
                        }, basicBot.settings.commandCooldown * 1000);
                    }
                    //basicBot.roomUtilities.logDebug("commandCheck7: executed: " + executed);
                    if (executed) {
                        if (chat.cid.length > 0) API.moderateDeleteChat(chat.cid);
                        basicBot.room.allcommand = false;
                        setTimeout(function () {
                            basicBot.room.allcommand = true;
                        }, 5 * 1000);
                    }
                    //basicBot.roomUtilities.logDebug("commandCheck8: executed: " + executed);
                    return executed;
                }
                catch(err) { basicBot.roomUtilities.logException("commandCheck: " + err.message); }
            },
            action: function (chat) {
                if (chat.type === 'message' || chat.type === 'emote')  {
                    basicBot.userUtilities.setLastActivityID(chat.uid, true);
                }
                else if (chat.type !== 'log')  {
                  basicBot.roomUtilities.logDebug("CHAT.TYPE: " + chat.type);
                }
                basicBot.room.roomstats.chatmessages++;
            },
            spam: [
                'hueh', 'hu3', 'brbr', 'heu', 'brbr', 'kkkk', 'spoder', 'mafia', 'zuera', 'zueira',
                'zueria', 'aehoo', 'aheu', 'alguem', 'algum', 'brazil', 'zoeira', 'fuckadmins', 'affff', 'vaisefoder', 'huenaarea',
                'hitler', 'ashua', 'ahsu', 'ashau', 'lulz', 'huehue', 'hue', 'huehuehue', 'merda', 'pqp', 'puta', 'mulher', 'pula', 'retarda', 'caralho', 'filha', 'ppk',
                'gringo', 'fuder', 'foder', 'hua', 'ahue', 'modafuka', 'modafoka', 'mudafuka', 'mudafoka', 'ooooooooooooooo', 'foda'
            ],
            curses: [
                'nigger', 'faggot', 'nigga', 'niqqa', 'motherfucker', 'modafocka'
            ]
        },
        connectAPI: function () {
            this.proxy = {
                eventChat: $.proxy(this.eventChat, this),
                eventUserskip: $.proxy(this.eventUserskip, this),
                eventUserjoin: $.proxy(this.eventUserjoin, this),
                eventUserleave: $.proxy(this.eventUserleave, this),
                eventUserfan: $.proxy(this.eventUserfan, this),
                eventFriendjoin: $.proxy(this.eventFriendjoin, this),
                eventFanjoin: $.proxy(this.eventFanjoin, this),
                eventVoteupdate: $.proxy(this.eventVoteupdate, this),
                eventCurateupdate: $.proxy(this.eventCurateupdate, this),
                eventRoomscoreupdate: $.proxy(this.eventRoomscoreupdate, this),
                eventDjadvance: $.proxy(this.eventDjadvance, this),
                eventDjupdate: $.proxy(this.eventDjupdate, this),
                eventWaitlistupdate: $.proxy(this.eventWaitlistupdate, this),
                eventVoteskip: $.proxy(this.eventVoteskip, this),
                eventModskip: $.proxy(this.eventModskip, this),
                eventChatcommand: $.proxy(this.eventChatcommand, this),
                eventHistoryupdate: $.proxy(this.eventHistoryupdate, this)

            };
            API.on(API.CHAT, this.proxy.eventChat);
            API.on(API.USER_SKIP, this.proxy.eventUserskip);
            API.on(API.USER_JOIN, this.proxy.eventUserjoin);
            API.on(API.USER_LEAVE, this.proxy.eventUserleave);
            API.on(API.USER_FAN, this.proxy.eventUserfan);
            API.on(API.VOTE_UPDATE, this.proxy.eventVoteupdate);
            API.on(API.GRAB_UPDATE, this.proxy.eventCurateupdate);
            API.on(API.ROOM_SCORE_UPDATE, this.proxy.eventRoomscoreupdate);
            API.on(API.ADVANCE, this.proxy.eventDjadvance);
            API.on(API.WAIT_LIST_UPDATE, this.proxy.eventWaitlistupdate);
            API.on(API.MOD_SKIP, this.proxy.eventModskip);
            API.on(API.CHAT_COMMAND, this.proxy.eventChatcommand);
            API.on(API.HISTORY_UPDATE, this.proxy.eventHistoryupdate);
        },
        disconnectAPI: function () {
            API.off(API.CHAT, this.proxy.eventChat);
            API.off(API.USER_SKIP, this.proxy.eventUserskip);
            API.off(API.USER_JOIN, this.proxy.eventUserjoin);
            API.off(API.USER_LEAVE, this.proxy.eventUserleave);
            API.off(API.USER_FAN, this.proxy.eventUserfan);
            API.off(API.VOTE_UPDATE, this.proxy.eventVoteupdate);
            API.off(API.CURATE_UPDATE, this.proxy.eventCurateupdate);
            API.off(API.ROOM_SCORE_UPDATE, this.proxy.eventRoomscoreupdate);
            API.off(API.ADVANCE, this.proxy.eventDjadvance);
            API.off(API.WAIT_LIST_UPDATE, this.proxy.eventWaitlistupdate);
            API.off(API.MOD_SKIP, this.proxy.eventModskip);
            API.off(API.CHAT_COMMAND, this.proxy.eventChatcommand);
            API.off(API.HISTORY_UPDATE, this.proxy.eventHistoryupdate);
        },
        startup: function () {
            Function.prototype.toString = function () {
                return 'Function.'
            };
            runningBot = false;
            //basicBot.roomUtilities.logDebug("TODO - STARTUP Starting");
            var plugUser = basicBot.userUtilities.getCurrentPlugUser();
            if (botIDs.indexOf(plugUser.id) > -1) runningBot = true;
            basicBot.roomUtilities.logDebug("Bot Running = " + runningBot); //todoer DELETE
            if (basicBot.userUtilities.getPermission(plugUser) < 2) return basicBot.roomUtilities.chatLog(basicBot.chat.greyuser);
            if (basicBot.userUtilities.getPermission(plugUser) === 2) basicBot.roomUtilities.chatLog(basicBot.chat.bouncer);
            basicBot.connectAPI();
            API.moderateDeleteChat = function (cid) {
                $.ajax({
                    url: "https://plug.dj/_/chat/" + cid,
                    type: "DELETE"
                })
            };

            // ==========================================================
            // Detect room change and disable the bot:
            // ==========================================================
            var roomURL = window.location.pathname;
            var Check;
            var detect = function(){
                if(roomURL != window.location.pathname){
                    clearInterval(Check)
                    basicBot.roomUtilities.logInfo("Killing bot after room change.");
                    storeToStorage();
                    basicBot.disconnectAPI();
                    setTimeout(function () {
                        kill();
                    }, 1000);
                }
            };
            Check = setInterval(function(){ detect() }, 100);
            // ==========================================================
            
            //basicBot.roomUtilities.logDebug("TODO - STARTUP retrieveSettings");
            retrieveSettings();
            //basicBot.roomUtilities.logDebug("TODO - STARTUP retrieveFromStorage");
            retrieveFromStorage();
            //basicBot.roomUtilities.logDebug("TODO - STARTUP 1");
            window.bot = basicBot;
            blacklistInterval = setInterval(function () {
                basicBot.roomUtilities.updateBlacklists()
            }, 10 * 60 * 1000);
            basicBot.roomUtilities.updateBlacklists();
            basicBot.getNewBlacklistedSongs = basicBot.roomUtilities.exportNewBlacklistedSongs;
            basicBot.logNewBlacklistedSongs = basicBot.roomUtilities.logNewBlacklistedSongs;
            
            if (roomURL === "/-752559695349757775") basicBot.room.debug = true;
            //basicBot.roomUtilities.logDebug("TODO - STARTUP 2");
            if (basicBot.room.roomstats.launchTime === null) {
                basicBot.room.roomstats.launchTime = Date.now();
            }

            //basicBot.roomUtilities.logDebug("TODO - STARTUP 3");
            for (var j = 0; j < basicBot.room.users.length; j++) {
                basicBot.room.users[j].inRoom = false;
            }
            //basicBot.roomUtilities.logDebug("TODO - STARTUP 4");
            var userlist = API.getUsers();
            for (var i = 0; i < userlist.length; i++) {
                var known = false;
                var ind = null;
                for (var j = 0; j < basicBot.room.users.length; j++) {
                    if (basicBot.room.users[j].id === userlist[i].id) {
                        known = true;
                        ind = j;
                    }
                }
                if (known) {
                    basicBot.room.users[ind].inRoom = true;
                }
                else {
                    basicBot.room.users.push(new basicBot.User(userlist[i].id, userlist[i].username));
                    ind = basicBot.room.users.length - 1;
                }
                var wlIndex = API.getWaitListPosition(basicBot.room.users[ind].id) + 1;
                basicBot.room.users[ind].lastKnownPosition = wlIndex;
                if (wlIndex > 0) basicBot.room.users[ind].lastSeenInLine = Date.now();
            }
            //basicBot.roomUtilities.logDebug("TODO - STARTUP 5");
            basicBot.room.afkInterval = setInterval(function () {
                basicBot.roomUtilities.afkCheck()
            }, 10 * 1000);
            //basicBot.roomUtilities.logDebug("TODO - STARTUP 6");
            //basicBot.room.autodisableInterval = setInterval(function () {
            //    basicBot.room.autodisableFunc();
            //}, 60 * 60 * 1000);
            //basicBot.roomUtilities.logDebug("TODO - STARTUP 7");
            //BotID: Current User:
            basicBot.loggedInID = basicBot.userUtilities.getCurrentPlugUser().id;
            basicBot.loggedInName = basicBot.userUtilities.getCurrentPlugUser().username;
            basicBot.status = true;
            basicBot.roomUtilities.sendChat('/cap 1');
            API.setVolume(0);
            /*
            var emojibutton = $(".icon-emoji-on");
            if (emojibutton.length > 0) {
                emojibutton[0].click();
            }
            */

            //basicBot.roomUtilities.logDebug("TODO - STARTUP 9");
            if (basicBot.settings.autoWootBot === true) setTimeout(basicBot.roomUtilities.wootThisSong, 3000);
            loadChat(basicBot.roomUtilities.sendChat(subChat(basicBot.chat.online, {botname: basicBot.settings.botName, version: basicBot.version})));
            //basicBot.roomUtilities.logDebug(basicBot.settings.botName + basicBot.version);
            //basicBot.roomUtilities.logDebug("TODO - STARTUP 10");
            basicBot.room.roulette.randomRouletteSetTimer();
            basicBot.room.randomInterval = setInterval(function () { basicBot.room.roulette.randomRouletteCheck() }, 30 * 1000);
            basicBot.roomUtilities.randomCommentSetTimer();
            basicBot.room.randomInterval = setInterval(function () { basicBot.roomUtilities.randomCommentCheck() }, 30 * 1000);

        },
        commands: {
            executable: function (minRank, chat) {
                var id = chat.uid;
                var perm = basicBot.userUtilities.getPermission(id);
                var minPerm;
                switch (minRank) {
                    case 'admin':
                        minPerm = 10;
                        break;
                    case 'ambassador':
                        minPerm = 7;
                        break;
                    case 'host':
                        minPerm = 5;
                        break;
                    case 'cohost':
                        minPerm = 4;
                        break;
                    case 'manager':
                        minPerm = 3;
                        break;
                    case 'mod':
                        if (basicBot.settings.bouncerPlus) {
                            minPerm = 2;
                        }
                        else {
                            minPerm = 3;
                        }
                        break;
                    case 'bouncer':
                        minPerm = 2;
                        break;
                    case 'residentdj':
                        minPerm = 1;
                        break;
                    case 'user':
                        minPerm = 0;
                        break;
                    default:
                        basicBot.roomUtilities.chatLog('error assigning minimum permission');
                }
                return perm >= minPerm;

            },
            /**
             command: {
                        command: 'cmd',
                        rank: 'user/bouncer/mod/manager',
                        type: 'startsWith/exact',
                        functionality: function(chat, cmd){
                                if(this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                                if( !basicBot.commands.executable(this.rank, chat) ) return void (0);
                                else{
                                
                                }
                        }
                },
             **/

            activeCommand: {
                command: 'active',
                rank: 'bouncer',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        var now = Date.now();
                        var chatters = 0;
                        var time;
                        if (msg.length === cmd.length) time = 60;
                        else {
                            time = msg.substring(cmd.length + 1);
                            if (isNaN(time)) return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.invalidtime, {name: chat.un}));
                        }
                        for (var i = 0; i < basicBot.room.users.length; i++) {
                            userTime = basicBot.userUtilities.getLastActivity(basicBot.room.users[i]);
                            if ((now - userTime) <= (time * 60 * 1000)) {
                                chatters++;
                            }
                        }
                        basicBot.roomUtilities.sendChat(subChat(basicBot.chat.activeusersintime, {name: chat.un, amount: chatters, time: time}));
                    }
                }
            },

            addCommand: {
                command: 'add',
                rank: 'mod',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        if (msg.length === cmd.length) return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.nouserspecified, {name: chat.un}));
                        var name = msg.substr(cmd.length + 2);
                        var user = basicBot.userUtilities.lookupUserName(name);
                        if (msg.length > cmd.length + 2) {
                            if (typeof user !== 'undefined') {
                                if (basicBot.room.roomevent) {
                                    basicBot.room.eventArtists.push(user.id);
                                }
                                API.moderateAddDJ(user.id);
                            } else basicBot.roomUtilities.sendChat(subChat(basicBot.chat.invaliduserspecified, {name: chat.un}));
                        }
                    }
                }
            },

            afklimitCommand: {
                command: 'afklimit',
                rank: 'manager',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        if (msg.length === cmd.length) return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.nolimitspecified, {name: chat.un}));
                        var limit = msg.substring(cmd.length + 1);
                        if (!isNaN(limit)) {
                            basicBot.settings.maximumAfk = parseInt(limit, 10);
                            basicBot.roomUtilities.sendChat(subChat(basicBot.chat.maximumafktimeset, {name: chat.un, time: basicBot.settings.maximumAfk}));
                        }
                        else basicBot.roomUtilities.sendChat(subChat(basicBot.chat.invalidlimitspecified, {name: chat.un}));
                    }
                }
            },

            randomRouletteCommand: {   //Added 02/14/2015 Zig
                command: 'randomroulette',
                rank: 'mod',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (basicBot.settings.randomRoulette) {
                            basicBot.settings.randomRoulette = !basicBot.settings.randomRoulette;
                            basicBot.roomUtilities.sendChat(subChat(basicBot.chat.toggleoff, {name: chat.un, 'function': 'Random Roulette'}));
                        }
                        else {
                            basicBot.settings.randomRoulette = !basicBot.settings.randomRoulette;
                            basicBot.roomUtilities.sendChat(subChat(basicBot.chat.toggleon, {name: chat.un, 'function': 'Random Roulette'}));
                        }
                    }
                }
            },
            randomCommentsCommand: {   //Added 02/14/2015 Zig
                command: 'randomcomments',
                rank: 'mod',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (basicBot.settings.randomComments) {
                            basicBot.settings.randomComments = !basicBot.settings.randomComments;
                            basicBot.roomUtilities.sendChat(subChat(basicBot.chat.toggleoff, {name: chat.un, 'function': 'Random Comments'}));
                        }
                        else {
                            basicBot.settings.randomComments = !basicBot.settings.randomComments;
                            basicBot.roomUtilities.sendChat(subChat(basicBot.chat.toggleon, {name: chat.un, 'function': 'Random Comments'}));
                        }
                    }
                }
            },
            skipHistoryCommand: {   //Added 02/14/2015 Zig
                command: 'skiphistory',
                rank: 'mod',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (basicBot.settings.repeatSongs) {
                            basicBot.settings.repeatSongs = !basicBot.settings.repeatSongs;
                            clearInterval(basicBot.room.afkInterval);
                            basicBot.roomUtilities.sendChat(subChat(basicBot.chat.toggleoff, {name: chat.un, 'function': basicBot.chat.repeatSongs}));
                        }
                        else {
                            basicBot.settings.repeatSongs = !basicBot.settings.repeatSongs;
                            basicBot.room.afkInterval = setInterval(function () {
                                basicBot.roomUtilities.afkCheck()
                            }, 2 * 1000);
                            basicBot.roomUtilities.sendChat(subChat(basicBot.chat.toggleon, {name: chat.un, 'function': basicBot.chat.repeatSongs}));
                        }
                    }
                }
            },
            afkremovalCommand: {
                command: 'afkremoval',
                rank: 'mod',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (basicBot.settings.afkRemoval) {
                            basicBot.settings.afkRemoval = !basicBot.settings.afkRemoval;
                            clearInterval(basicBot.room.afkInterval);
                            basicBot.roomUtilities.sendChat(subChat(basicBot.chat.toggleoff, {name: chat.un, 'function': basicBot.chat.afkremoval}));
                        }
                        else {
                            basicBot.settings.afkRemoval = !basicBot.settings.afkRemoval;
                            basicBot.room.afkInterval = setInterval(function () {
                                basicBot.roomUtilities.afkCheck()
                            }, 2 * 1000);
                            basicBot.roomUtilities.sendChat(subChat(basicBot.chat.toggleon, {name: chat.un, 'function': basicBot.chat.afkremoval}));
                        }
                    }
                }
            },

            afkresetCommand: {
                command: 'afkreset',
                rank: 'bouncer',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        if (msg.length === cmd.length) return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.nouserspecified, {name: chat.un}));
                        var name = msg.substring(cmd.length + 2);
                        var user = basicBot.userUtilities.lookupUserName(name);
                        if (typeof user === 'boolean') return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.invaliduserspecified, {name: chat.un}));
                        basicBot.userUtilities.setLastActivity(user, false);
                        basicBot.roomUtilities.sendChat(subChat(basicBot.chat.afkstatusreset, {name: chat.un, username: name}));
                    }
                }
            },

            afktimeCommand: {
                command: 'afktime',
                rank: 'bouncer',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        if (msg.length === cmd.length) return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.nouserspecified, {name: chat.un}));
                        var name = msg.substring(cmd.length + 2);
                        var user = basicBot.userUtilities.lookupUserName(name);
                        if (typeof user === 'boolean') return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.invaliduserspecified, {name: chat.un}));
                        var lastActive = basicBot.userUtilities.getLastActivity(user);
                        var inactivity = Date.now() - lastActive;
                        var time = basicBot.roomUtilities.msToStr(inactivity);
                        basicBot.roomUtilities.sendChat(subChat(basicBot.chat.inactivefor, {name: chat.un, username: name, time: time}));
                    }
                }
            },

            autoskipCommand: {
                command: 'autoskip',
                rank: 'mod',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (basicBot.room.autoskip) {
                            basicBot.room.autoskip = !basicBot.room.autoskip;
                            clearTimeout(basicBot.room.autoskipTimer);
                            return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.toggleoff, {name: chat.un, 'function': basicBot.chat.autoskip}));
                        }
                        else {
                            basicBot.room.autoskip = !basicBot.room.autoskip;
                            return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.toggleon, {name: chat.un, 'function': basicBot.chat.autoskip}));
                        }
                    }
                }
            },

            autowootCommand: {
                command: 'autowoot',
                rank: 'user',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        basicBot.roomUtilities.sendChat(basicBot.chat.autowoot);
                    }
                }
            },

            baCommand: {
                command: 'ba',
                rank: 'user',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        basicBot.roomUtilities.sendChat(basicBot.chat.brandambassador);
                    }
                }
            },

            banCommand: {
                command: 'ban',
                rank: 'bouncer',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        if (msg.length === cmd.length) return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.nouserspecified, {name: chat.un}));
                        var name = msg.substr(cmd.length + 2);
                        var user = basicBot.userUtilities.lookupUserName(name);
                        if (typeof user === 'boolean') return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.invaliduserspecified, {name: chat.un}));
                        API.moderateBanUser(user.id, 1, API.BAN.DAY);
                    }
                }
            },

//            songbanCommand: {
//                command: 'songban',
//                rank: 'bouncer',
//                type: 'exact',
//                functionality: function (chat, cmd) {
//                    try {
//                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
//                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
//                    else {
//                        var msg = chat.message;
//                        if (msg.length === cmd.length) return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.nolistspecified, {name: chat.un}));
//                        var list = "BAN";
//                        if (typeof basicBot.room.blacklists[list] === 'undefined') return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.invalidlistspecified, {name: chat.un}));
//                        else {
//                            var media = API.getMedia();
//                            var track = {
//                                list: list,
//                                author: media.author,
//                                title: media.title,
//                                mid: media.format + ':' + media.cid
//                            };
//                            basicBot.room.newBlacklisted.push(track);
//                            basicBot.room.blacklists[list].push(media.format + ':' + media.cid);
//                            basicBot.roomUtilities.sendChat(subChat(basicBot.chat.newblacklisted, {name: chat.un, blacklist: list, author: media.author, title: media.title, mid: media.format + ':' + media.cid}));
//                            API.moderateForceSkip();
//                            if (typeof basicBot.room.newBlacklistedSongFunction === 'function') {
//                                basicBot.room.newBlacklistedSongFunction(track);
//                            }
//                        }
//                    }
//                    
//                    var ajaxResponse = $.ajax({
//                      type: "post", 
//                      url: "./api.cfm",
//                      contentType: "application/json",
//                      data: JSON.stringify( postData )
//                    })
//                }
//                    catch(err) { basicBot.roomUtilities.logException("blacklistCommand: " + err.message); }
//                }
//            },
            blacklistCommand: {
                command: ['blacklist', 'bl'],
                rank: 'bouncer',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    try {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        if (msg.length === cmd.length) return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.nolistspecified, {name: chat.un}));
                        var list = msg.substr(cmd.length + 1);
                        if (typeof basicBot.room.blacklists[list] === 'undefined') return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.invalidlistspecified, {name: chat.un}));
                        else {
                            var media = API.getMedia();
                            var track = {
                                list: list,
                                author: media.author,
                                title: media.title,
                                mid: media.format + ':' + media.cid
                            };
                            basicBot.room.newBlacklisted.push(track);
                            basicBot.room.blacklists[list].push(media.format + ':' + media.cid);
                            basicBot.roomUtilities.sendChat(subChat(basicBot.chat.newblacklisted, {name: chat.un, blacklist: list, author: media.author, title: media.title, mid: media.format + ':' + media.cid}));
                            basicBot.userUtilities.skipBadSong(obj.dj.id);
                            if (typeof basicBot.room.newBlacklistedSongFunction === 'function') {
                                basicBot.room.newBlacklistedSongFunction(track);
                            }
                        }
                    }
                    }
                    catch(err) { basicBot.roomUtilities.logException("blacklistCommand: " + err.message); }
                }
            },

            blinfoCommand: {
                command: 'blinfo',
                rank: 'bouncer',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var author = API.getMedia().author;
                        var title = API.getMedia().title;
                        var name = chat.un;
                        var format = API.getMedia().format;
                        var cid = API.getMedia().cid;
                        var songid = format + ":" + cid;

                        basicBot.roomUtilities.sendChat(subChat(basicBot.chat.blinfo, {name: name, author: author, title: title, songid: songid}));
                    }
                }
            },

            bouncerPlusCommand: {
                command: 'bouncer+',
                rank: 'mod',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        if (basicBot.settings.bouncerPlus) {
                            basicBot.settings.bouncerPlus = false;
                            return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.toggleoff, {name: chat.un, 'function': 'Bouncer+'}));
                        }
                        else {
                            if (!basicBot.settings.bouncerPlus) {
                                var id = chat.uid;
                                var perm = basicBot.userUtilities.getPermission(id);
                                if (perm > 2) {
                                    basicBot.settings.bouncerPlus = true;
                                    return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.toggleon, {name: chat.un, 'function': 'Bouncer+'}));
                                }
                            }
                            else return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.bouncerplusrank, {name: chat.un}));
                        }
                    }
                }
            },
            autowootbotCommand: { 
                command: 'autowootbot',
                rank: 'manager',
                type: 'exact',
                functionality: function (chat, cmd) {
                    try {
                        if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                        if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                        basicBot.settings.autoWootBot = (!basicBot.settings.autoWootBot);
                    }
                    catch(err) { basicBot.roomUtilities.logException("autowootbotCommand: " + err.message); }
                }
            },
            

            clearchatCommand: {
                command: 'clearchat',
                rank: 'manager',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var currentchat = $('#chat-messages').children();
                        for (var i = 0; i < currentchat.length; i++) {
                            API.moderateDeleteChat(currentchat[i].getAttribute("data-cid"));
                        }
                        return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.chatcleared, {name: chat.un}));
                    }
                }
            },

            commandsCommand: {
                command: 'commands',
                rank: 'user',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        basicBot.roomUtilities.sendChat(subChat(basicBot.chat.commandslink, {botname: basicBot.settings.botName, link: basicBot.cmdLink}));
                    }
                }
            },

            cookieCommand: {
                command: 'cookie',
                rank: 'user',
                type: 'startsWith',
                cookies: ['has given you a chocolate chip cookie!',
                    'has given you a soft homemade oatmeal cookie!',
                    'has given you a plain, dry, old cookie. It was the last one in the bag. Gross.',
                    'gives you a sugar cookie. What, no frosting and sprinkles? 0/10 would not touch.',
                    'gives you a chocolate chip cookie. Oh wait, those are raisins. Bleck!',
                    'gives you an enormous cookie. Poking it gives you more cookies. Weird.',
                    'gives you a fortune cookie. It reads "Why aren\'t you working on any projects?"',
                    'gives you a fortune cookie. It reads "Give that special someone a compliment"',
                    'gives you a fortune cookie. It reads "Take a risk!"',
                    'gives you a fortune cookie. It reads "Go outside."',
                    'gives you a fortune cookie. It reads "Don\'t forget to eat your veggies!"',
                    'gives you a fortune cookie. It reads "Do you even lift?"',
                    'gives you a fortune cookie. It reads "m808 pls"',
                    'gives you a fortune cookie. It reads "If you move your hips, you\'ll get all the ladies."',
                    'gives you a fortune cookie. It reads "I love you."',
                    'gives you a Golden Cookie. You can\'t eat it because it is made of gold. Dammit.',
                    'gives you an Oreo cookie with a glass of milk!',
                    'gives you a rainbow cookie made with love :heart:',
                    'gives you an old cookie that was left out in the rain, it\'s moldy.',
                    'bakes you fresh cookies, it smells amazing.'
                ],
                getCookie: function () {
                    var c = Math.floor(Math.random() * this.cookies.length);
                    return this.cookies[c];
                },
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;

                        var space = msg.indexOf(' ');
                        if (space === -1) {
                            basicBot.roomUtilities.sendChat(basicBot.chat.eatcookie);
                            return false;
                        }
                        else {
                            var name = msg.substring(space + 2);
                            var user = basicBot.userUtilities.lookupUserName(name);
                            if (user === false || !user.inRoom) {
                                return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.nousercookie, {name: name}));
                            }
                            else if (user.username === chat.un) {
                                return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.selfcookie, {name: name}));
                            }
                            else {
                                return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.cookie, {nameto: user.username, namefrom: chat.un, cookie: this.getCookie()}));
                            }
                        }
                    }
                }
            },

            cycleCommand: {
                command: 'cycle',
                rank: 'manager',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        basicBot.roomUtilities.changeDJCycle();
                    }
                }
            },

            cycleguardCommand: {
                command: 'cycleguard',
                rank: 'bouncer',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (basicBot.settings.cycleGuard) {
                            basicBot.settings.cycleGuard = !basicBot.settings.cycleGuard;
                            return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.toggleoff, {name: chat.un, 'function': basicBot.chat.cycleguard}));
                        }
                        else {
                            basicBot.settings.cycleGuard = !basicBot.settings.cycleGuard;
                            return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.toggleon, {name: chat.un, 'function': basicBot.chat.cycleguard}));
                        }

                    }
                }
            },

            cycletimerCommand: {
                command: 'cycletimer',
                rank: 'manager',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        var cycleTime = msg.substring(cmd.length + 1);
                        if (!isNaN(cycleTime) && cycleTime !== "") {
                            basicBot.settings.maximumCycletime = cycleTime;
                            return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.cycleguardtime, {name: chat.un, time: basicBot.settings.maximumCycletime}));
                        }
                        else return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.invalidtime, {name: chat.un}));

                    }
                }
            },

            voteskipCommand: {
                command: 'voteskip',
                rank: 'manager',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        if (msg.length <= cmd.length + 1) return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.voteskiplimit, {name: chat.un, limit: basicBot.settings.voteSkipLimit}));
                        var argument = msg.substring(cmd.length + 1);
                        if (!basicBot.settings.voteSkipEnabled) basicBot.settings.voteSkipEnabled = !basicBot.settings.voteSkipEnabled;
                        if (isNaN(argument)) {
                            basicBot.roomUtilities.sendChat(subChat(basicBot.chat.voteskipinvalidlimit, {name: chat.un}));
                        }
                        else {
                            basicBot.settings.voteSkipLimit = argument;
                            basicBot.roomUtilities.sendChat(subChat(basicBot.chat.voteskipsetlimit, {name: chat.un, limit: basicBot.settings.voteSkipLimit}));
                        }
                    }
                }
            },

            togglevoteskipCommand: {
                command: 'togglevoteskip',
                rank: 'bouncer',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (basicBot.settings.voteSkipEnabled) {
                            basicBot.settings.voteSkipEnabled = !basicBot.settings.voteSkipEnabled;
                            basicBot.roomUtilities.sendChat(subChat(basicBot.chat.toggleoff, {name: chat.un, 'function': basicBot.chat.voteskip}));
                        }
                        else {
                            basicBot.settings.voteSkipEnabled = !basicBot.settings.voteSkipEnabled;
                            basicBot.roomUtilities.sendChat(subChat(basicBot.chat.toggleon, {name: chat.un, 'function': basicBot.chat.voteskip}));
                        }
                    }
                }
            },

            dclookupCommand: {
                command: ['dclookup', 'dc', 'back'],
                rank: 'user',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        var name;
                        if (msg.length === cmd.length) name = chat.un;
                        else {
                            name = msg.substring(cmd.length + 2);
                            var perm = basicBot.userUtilities.getPermission(chat.uid);
                            if (perm < 2) return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.dclookuprank, {name: chat.un}));
                        }
                        var user = basicBot.userUtilities.lookupUserName(name);
                        if (typeof user === 'boolean') return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.invaliduserspecified, {name: chat.un}));
                        var toChat = basicBot.userUtilities.dclookup(user.id);
                        basicBot.roomUtilities.sendChat(toChat);
                    }
                }
            },

            /*deletechatCommand: {
                command: 'deletechat',
                rank: 'mod',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        if (msg.length === cmd.length) return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.nouserspecified, {name: chat.un}));
                        var name = msg.substring(cmd.length + 2);
                        var user = basicBot.userUtilities.lookupUserName(name);
                        if (typeof user === 'boolean') return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.invaliduserspecified, {name: chat.un}));
                        var chats = $('.from');
                        for (var i = 0; i < chats.length; i++) {
                            var n = chats[i].textContent;
                            if (name.trim() === n.trim()) {
                                var cid = $(chats[i]).parent()[0].getAttribute('data-cid');
                                API.moderateDeleteChat(cid);
                            }
                        }
                        basicBot.roomUtilities.sendChat(subChat(basicBot.chat.deletechat, {name: chat.un, username: name}));
                    }
                }
            },*/

            emojiCommand: {
                command: 'emoji',
                rank: 'user',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var link = 'http://www.emoji-cheat-sheet.com/';
                        basicBot.roomUtilities.sendChat(subChat(basicBot.chat.emojilist, {link: link}));
                    }
                }
            },

            etaCommand: {
                command: 'eta',
                rank: 'user',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var perm = basicBot.userUtilities.getPermission(chat.uid);
                        var msg = chat.message;
                        var name;
                        if (msg.length > cmd.length) {
                            if (perm < 2) return void (0);
                            name = msg.substring(cmd.length + 2);
                        } else name = chat.un;
                        var user = basicBot.userUtilities.lookupUserName(name);
                        if (typeof user === 'boolean') return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.invaliduserspecified, {name: chat.un}));
                        var pos = API.getWaitListPosition(user.id);
                        if (pos < 0) return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.notinwaitlist, {name: name}));
                        var timeRemaining = API.getTimeRemaining();
                        var estimateMS = ((pos * 4 * 60) + timeRemaining) * 1000;
                        var estimateString = basicBot.roomUtilities.msToStr(estimateMS);
                        basicBot.roomUtilities.sendChat(subChat(basicBot.chat.eta, {name: name, time: estimateString}));
                    }
                }
            },

            fbCommand: {
                command: 'fb',
                rank: 'user',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (typeof basicBot.settings.fbLink === "string")
                            basicBot.roomUtilities.sendChat(subChat(basicBot.chat.facebook, {link: basicBot.settings.fbLink}));
                    }
                }
            },

            filterCommand: {
                command: 'filter',
                rank: 'bouncer',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (basicBot.settings.filterChat) {
                            basicBot.settings.filterChat = !basicBot.settings.filterChat;
                            return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.toggleoff, {name: chat.un, 'function': basicBot.chat.chatfilter}));
                        }
                        else {
                            basicBot.settings.filterChat = !basicBot.settings.filterChat;
                            return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.toggleon, {name: chat.un, 'function': basicBot.chat.chatfilter}));
                        }
                    }
                }
            },

            ghostbusterCommand: {
                command: 'ghostbuster',
                rank: 'user',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        var name;
                        if (msg.length === cmd.length) name = chat.un;
                        else {
                            name = msg.substr(cmd.length + 2);
                        }
                        var user = basicBot.userUtilities.lookupUserName(name);
                        if (user === false || !user.inRoom) {
                            return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.ghosting, {name1: chat.un, name2: name}));
                        }
                        else basicBot.roomUtilities.sendChat(subChat(basicBot.chat.notghosting, {name1: chat.un, name2: name}));     
                    }
                }
            },

            gifCommand: {
                command: ['gif', 'giphy'],
                rank: 'cohost',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.settings.gifEnabled) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        if (msg.length !== cmd.length) {
                            function get_id(api_key, fixedtag, func)
                            {
                                $.getJSON(
                                    "https://api.giphy.com/v1/gifs/random?", 
                                    { 
                                        "format": "json",
                                        "api_key": api_key,
                                        "rating": rating,
                                        "tag": fixedtag
                                    },
                                    function(response)
                                    {
                                        func(response.data.id);
                                    }
                                    )
                            }
                            var api_key = "dc6zaTOxFJmzC"; // public beta key
                            var rating = "pg-13"; // PG 13 gifs
                            var tag = msg.substr(cmd.length + 1);
                            var fixedtag = tag.replace(/ /g,"+");
                            var commatag = tag.replace(/ /g,", ");
                            get_id(api_key, tag, function(id) {
                                if (typeof id !== 'undefined') {
                                    basicBot.roomUtilities.sendChat(subChat(basicBot.chat.validgiftags, {name: chat.un, id: id, tags: commatag}));
                                } else {
                                    basicBot.roomUtilities.sendChat(subChat(basicBot.chat.invalidgiftags, {name: chat.un, tags: commatag}));
                                }
                            });
                        }
                        else {
                            function get_random_id(api_key, func)
                            {
                                $.getJSON(
                                    "https://api.giphy.com/v1/gifs/random?", 
                                    { 
                                        "format": "json",
                                        "api_key": api_key,
                                        "rating": rating
                                    },
                                    function(response)
                                    {
                                        func(response.data.id);
                                    }
                                    )
                            }
                            var api_key = "dc6zaTOxFJmzC"; // public beta key
                            var rating = "pg-13"; // PG 13 gifs
                            get_random_id(api_key, function(id) {
                                if (typeof id !== 'undefined') {
                                    basicBot.roomUtilities.sendChat(subChat(basicBot.chat.validgifrandom, {name: chat.un, id: id}));
                                } else {
                                    basicBot.roomUtilities.sendChat(subChat(basicBot.chat.invalidgifrandom, {name: chat.un}));
                                }
                            });
                        }
                    }
                }
            },

            helpCommand: {
                command: 'help',
                rank: 'user',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var link = "http://i.imgur.com/SBAso1N.jpg";
                        basicBot.roomUtilities.sendChat(subChat(basicBot.chat.starterhelp, {link: link}));
                    }
                }
            },

            hopupCommand: {
                command: 'hopup',
                rank: 'bouncer',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        API.botDjNow();
                    }
                }
            },
            hopdownCommand: {
                command: 'hopdown',
                rank: 'bouncer',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        basicBot.settings.hoppingDownNow = true;
                        setTimeout(function () {
                            basicBot.settings.hoppingDownNow = false;
                            }, 2000);
                        API.botHopDown();
                    }
                }
            },
            bootCommand: {
                command: 'boot',
                rank: 'user',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    var msg = chat.message;
                    var name;
                    var byusername = " ";
                    if (msg.length === cmd.length) name = chat.un;
                    else {
                        name = msg.substring(cmd.length + 2);
                        var perm = basicBot.userUtilities.getPermission(chat.uid);
                        if (perm < 2) return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.bootrank, {name: chat.un}));
                        byusername = " [ executed by " + chat.un + " ]";
                    }
                    var user = basicBot.userUtilities.lookupUserName(name);
                    if (typeof user === 'boolean') return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.invaliduserspecified, {name: chat.un}));
                    if (user.bootable) {
                        user.bootable = false;
                        basicBot.roomUtilities.sendChat(subChat(basicBot.chat.bootableDisabled, {name: name, userbyname: byusername}));
                    }
                    else {
                        user.bootable = true;
                        basicBot.roomUtilities.sendChat(subChat(basicBot.chat.bootableEnabled, {name: name, userbyname: byusername}));
                    }
                }
            },

            joinCommand: {
                command: 'join',
                rank: 'user',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (basicBot.room.roulette.rouletteStatus && basicBot.room.roulette.participants.indexOf(chat.uid) < 0) {
                            basicBot.room.roulette.participants.push(chat.uid);
                            basicBot.roomUtilities.sendChat(subChat(basicBot.chat.roulettejoin, {name: chat.un}));
                        }
                    }
                }
            },

            jointimeCommand: {
                command: 'jointime',
                rank: 'bouncer',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        if (msg.length === cmd.length) return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.nouserspecified, {name: chat.un}));
                        var name = msg.substring(cmd.length + 2);
                        var user = basicBot.userUtilities.lookupUserName(name);
                        if (typeof user === 'boolean') return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.invaliduserspecified, {name: chat.un}));
                        var join = basicBot.userUtilities.getJointime(user);
                        var time = Date.now() - join;
                        var timeString = basicBot.roomUtilities.msToStr(time);
                        basicBot.roomUtilities.sendChat(subChat(basicBot.chat.jointime, {namefrom: chat.un, username: name, time: timeString}));
                    }
                }
            },

            kickCommand: {
                command: 'kick',
                rank: 'bouncer',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        var lastSpace = msg.lastIndexOf(' ');
                        var time;
                        var name;
                        if (lastSpace === msg.indexOf(' ')) {
                            time = 0.25;
                            name = msg.substring(cmd.length + 2);
                        }
                        else {
                            time = msg.substring(lastSpace + 1);
                            name = msg.substring(cmd.length + 2, lastSpace);
                        }

                        var user = basicBot.userUtilities.lookupUserNameX(name);
                        var from = chat.un;
                        if (typeof user === 'boolean') return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.nouserspecified, {name: chat.un}));

                        var permFrom = basicBot.userUtilities.getPermission(chat.uid);
                        var permTokick = basicBot.userUtilities.getPermission(user.id);

                        if (permFrom <= permTokick)
                            return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.kickrank, {name: chat.un}));

                        if (!isNaN(time)) {
                            basicBot.roomUtilities.sendChat(subChat(basicBot.chat.kick, {name: chat.un, username: name, time: time}));
                            if (time > 24 * 60 * 60) API.moderateBanUser(user.id, 1, API.BAN.PERMA);
                            else API.moderateBanUser(user.id, 1, API.BAN.DAY);
                            setTimeout(function (id, name) {
                                API.moderateUnbanUser(id);
                                //basicBot.roomUtilities.logDebug('Unbanned @' + name + '. (' + id + ')');
                            }, time * 60 * 1000, user.id, name);
                        }
                        else basicBot.roomUtilities.sendChat(subChat(basicBot.chat.invalidtime, {name: chat.un}));
                    }
                }
            },

            killCommand: {
                command: 'kill',
                rank: 'bouncer',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        storeToStorage();
                        basicBot.roomUtilities.sendChat(basicBot.chat.kill);
                        basicBot.disconnectAPI();
                        setTimeout(function () {
                            kill();
                        }, 1000);
                    }
                }
            },

            leaveCommand: {
                command: 'leave',
                rank: 'user',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var ind = basicBot.room.roulette.participants.indexOf(chat.uid);
                        if (ind > -1) {
                            basicBot.room.roulette.participants.splice(ind, 1);
                            basicBot.roomUtilities.sendChat(subChat(basicBot.chat.rouletteleave, {name: chat.un}));
                        }
                    }
                }
            },

            linkCommand: {
                command: 'link',
                rank: 'user',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var media = API.getMedia();
                        var from = chat.un;
                        var user = basicBot.userUtilities.lookupUser(chat.uid);
                        var perm = basicBot.userUtilities.getPermission(chat.uid);
                        var dj = API.getDJ().id;
                        var isDj = false;
                        if (dj === chat.uid) isDj = true;
                        if (perm >= 1 || isDj) {
                            if (media.format === 1) {
                                var linkToSong = "https://www.youtube.com/watch?v=" + media.cid;
                                basicBot.roomUtilities.sendChat(subChat(basicBot.chat.songlink, {name: from, link: linkToSong}));
                            }
                            if (media.format === 2) {
                                SC.get('/tracks/' + media.cid, function (sound) {
                                    basicBot.roomUtilities.sendChat(subChat(basicBot.chat.songlink, {name: from, link: sound.permalink_url}));
                                });
                            }
                        }
                    }
                }
            },

            lockCommand: {
                command: 'lock',
                rank: 'mod',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        basicBot.roomUtilities.booth.lockBooth();
                    }
                }
            },

            lockdownCommand: {
                command: 'lockdown',
                rank: 'mod',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var temp = basicBot.settings.lockdownEnabled;
                        basicBot.settings.lockdownEnabled = !temp;
                        if (basicBot.settings.lockdownEnabled) {
                            return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.toggleon, {name: chat.un, 'function': basicBot.chat.lockdown}));
                        }
                        else return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.toggleoff, {name: chat.un, 'function': basicBot.chat.lockdown}));
                    }
                }
            },

            lockguardCommand: {
                command: 'lockguard',
                rank: 'bouncer',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (basicBot.settings.lockGuard) {
                            basicBot.settings.lockGuard = !basicBot.settings.lockGuard;
                            return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.toggleoff, {name: chat.un, 'function': basicBot.chat.lockdown}));
                        }
                        else {
                            basicBot.settings.lockGuard = !basicBot.settings.lockGuard;
                            return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.toggleon, {name: chat.un, 'function': basicBot.chat.lockguard}));
                        }
                    }
                }
            },

            lockskipCommand: {
                command: 'lockskip',
                rank: 'bouncer',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (basicBot.room.skippable) {
                            var dj = API.getDJ();
                            var id = dj.id;
                            var name = dj.username;
                            var msgSend = '@' + name + ': ';
                            basicBot.room.queueable = false;

                            if (chat.message.length === cmd.length) {
                                basicBot.roomUtilities.sendChat(subChat(basicBot.chat.usedlockskip, {name: chat.un}));
                                basicBot.roomUtilities.booth.lockBooth();
                                setTimeout(function (id) {
                                    API.moderateForceSkip();
                                    basicBot.room.skippable = false;
                                    setTimeout(function () {
                                        basicBot.room.skippable = true
                                    }, 5 * 1000);
                                    setTimeout(function (id) {
                                        basicBot.userUtilities.moveUser(id, basicBot.settings.lockskipPosition, false);
                                        basicBot.room.queueable = true;
                                        setTimeout(function () {
                                            basicBot.roomUtilities.booth.unlockBooth();
                                        }, 1000);
                                    }, 1500, id);
                                }, 1000, id);
                                return void (0);
                            }
                            var validReason = false;
                            var msg = chat.message;
                            var reason = msg.substring(cmd.length + 1);
                            for (var i = 0; i < basicBot.settings.lockskipReasons.length; i++) {
                                var r = basicBot.settings.lockskipReasons[i][0];
                                if (reason.indexOf(r) !== -1) {
                                    validReason = true;
                                    msgSend += basicBot.settings.lockskipReasons[i][1];
                                }
                            }
                            if (validReason) {
                                basicBot.roomUtilities.sendChat(subChat(basicBot.chat.usedlockskip, {name: chat.un}));
                                basicBot.roomUtilities.booth.lockBooth();
                                setTimeout(function (id) {
                                    API.moderateForceSkip();
                                    basicBot.room.skippable = false;
                                    basicBot.roomUtilities.sendChat(msgSend);
                                    setTimeout(function () {
                                        basicBot.room.skippable = true
                                    }, 5 * 1000);
                                    setTimeout(function (id) {
                                        basicBot.userUtilities.moveUser(id, basicBot.settings.lockskipPosition, false);
                                        basicBot.room.queueable = true;
                                        setTimeout(function () {
                                            basicBot.roomUtilities.booth.unlockBooth();
                                        }, 1000);
                                    }, 1500, id);
                                }, 1000, id);
                                return void (0);
                            }
                        }
                    }
                }
            },

            lockskipposCommand: {
                command: 'lockskippos',
                rank: 'manager',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        var pos = msg.substring(cmd.length + 1);
                        if (!isNaN(pos)) {
                            basicBot.settings.lockskipPosition = pos;
                            return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.lockskippos, {name: chat.un, position: basicBot.settings.lockskipPosition}));
                        }
                        else return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.invalidpositionspecified, {name: chat.un}));
                    }
                }
            },

            locktimerCommand: {
                command: 'locktimer',
                rank: 'manager',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        var lockTime = msg.substring(cmd.length + 1);
                        if (!isNaN(lockTime) && lockTime !== "") {
                            basicBot.settings.maximumLocktime = lockTime;
                            return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.lockguardtime, {name: chat.un, time: basicBot.settings.maximumLocktime}));
                        }
                        else return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.invalidtime, {name: chat.un}));
                    }
                }
            },

            historytimeCommand: {  //Added 02/14/2015 Zig 
                command: 'historytime',
                rank: 'manager',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        var maxTime = msg.substring(cmd.length + 1);
                        if (!isNaN(maxTime)) {
                            basicBot.settings.repeatSongTime = maxTime;
                            return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.repeatSongLimit, {name: chat.un, time: basicBot.settings.repeatSongTime}));
                        }
                        else return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.invalidtime, {name: chat.un}));
                    }
                }
            },
            logoutCommand: {
                command: 'logout',
                rank: 'cohost',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        basicBot.roomUtilities.sendChat(subChat(basicBot.chat.logout, {name: chat.un, botname: basicBot.settings.botName}));
                        setTimeout(function () {
                            $(".logout").mousedown()
                        }, 1000);
                    }
                }
            },
            /* This was an old one that did not work:
            logoutCommand: {
                command: 'logout',
                rank: 'mod',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        $(".icon-site-logo").click();
                        setTimeout(function (chat) {
                            basicBot.roomUtilities.sendChat(subChat(basicBot.chat.logout, {name: chat.un, botname: basicBot.settings.botName}));
                            setTimeout(function () {
                                $(".icon-logout-grey").click();
                            }, 1000);
                        }, 1000, chat);
                    }
                }
            },
            */
            maxlengthCommand: {
                command: 'maxlength',
                rank: 'manager',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        var maxTime = msg.substring(cmd.length + 1);
                        if (!isNaN(maxTime)) {
                            basicBot.settings.maximumSongLength = maxTime;
                            return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.maxlengthtime, {name: chat.un, time: basicBot.settings.maximumSongLength}));
                        }
                        else return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.invalidtime, {name: chat.un}));
                    }
                }
            },

            motdCommand: {
                command: 'motd',
                rank: 'bouncer',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        if (msg.length <= cmd.length + 1) return basicBot.roomUtilities.sendChat('/me MotD: ' + basicBot.settings.motd);
                        var argument = msg.substring(cmd.length + 1);
                        if (!basicBot.settings.motdEnabled) basicBot.settings.motdEnabled = !basicBot.settings.motdEnabled;
                        if (isNaN(argument)) {
                            basicBot.settings.motd = argument;
                            basicBot.roomUtilities.sendChat(subChat(basicBot.chat.motdset, {msg: basicBot.settings.motd}));
                        }
                        else {
                            basicBot.settings.motdInterval = argument;
                            basicBot.roomUtilities.sendChat(subChat(basicBot.chat.motdintervalset, {interval: basicBot.settings.motdInterval}));
                        }
                    }
                }
            },

            moveCommand: {
                command: 'move',
                rank: 'mod',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        if (msg.length === cmd.length) return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.nouserspecified, {name: chat.un}));
                        var firstSpace = msg.indexOf(' ');
                        var lastSpace = msg.lastIndexOf(' ');
                        var pos;
                        var name;
                        if (isNaN(parseInt(msg.substring(lastSpace + 1)))) {
                            pos = 1;
                            name = msg.substring(cmd.length + 2);
                        }
                        else {
                            pos = parseInt(msg.substring(lastSpace + 1));
                            name = msg.substring(cmd.length + 2, lastSpace);
                        }
                        var user = basicBot.userUtilities.lookupUserName(name);
                        if (typeof user === 'boolean') return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.invaliduserspecified, {name: chat.un}));
                        if (user.id === basicBot.loggedInID) return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.addbotwaitlist, {name: chat.un}));
                        if (!isNaN(pos)) {
                            basicBot.roomUtilities.sendChat(subChat(basicBot.chat.move, {name: chat.un}));
                            basicBot.userUtilities.moveUser(user.id, pos, false);
                        } else return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.invalidpositionspecified, {name: chat.un}));
                    }
                }
            },

            muteCommand: {
                command: 'mute',
                rank: 'bouncer',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        if (msg.length === cmd.length) return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.nouserspecified, {name: chat.un}));
                        var lastSpace = msg.lastIndexOf(' ');
                        var time = null;
                        var name;
                        if (lastSpace === msg.indexOf(' ')) {
                            name = msg.substring(cmd.length + 2);
                            time = 45;
                        }
                        else {
                            time = msg.substring(lastSpace + 1);
                            if (isNaN(time) || time == "" || time == null || typeof time == "undefined") {
                                return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.invalidtime, {name: chat.un}));
                            }
                            name = msg.substring(cmd.length + 2, lastSpace);
                        }
                        var from = chat.un;
                        var user = basicBot.userUtilities.lookupUserName(name);
                        if (typeof user === 'boolean') return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.invaliduserspecified, {name: chat.un}));
                        var permFrom = basicBot.userUtilities.getPermission(chat.uid);
                        var permUser = basicBot.userUtilities.getPermission(user.id);
                        if (permFrom > permUser) {
                            /*
                             basicBot.room.mutedUsers.push(user.id);
                             if (time === null) basicBot.roomUtilities.sendChat(subChat(basicBot.chat.mutednotime, {name: chat.un, username: name}));
                             else {
                             basicBot.roomUtilities.sendChat(subChat(basicBot.chat.mutedtime, {name: chat.un, username: name, time: time}));
                             setTimeout(function (id) {
                             var muted = basicBot.room.mutedUsers;
                             var wasMuted = false;
                             var indexMuted = -1;
                             for (var i = 0; i < muted.length; i++) {
                             if (muted[i] === id) {
                             indexMuted = i;
                             wasMuted = true;
                             }
                             }
                             if (indexMuted > -1) {
                             basicBot.room.mutedUsers.splice(indexMuted);
                             var u = basicBot.userUtilities.lookupUser(id);
                             var name = u.username;
                             basicBot.roomUtilities.sendChat(subChat(basicBot.chat.unmuted, {name: chat.un, username: name}));
                             }
                             }, time * 60 * 1000, user.id);
                             }
                             */
                            if (time > 45) {
                                basicBot.roomUtilities.sendChat(subChat(basicBot.chat.mutedmaxtime, {name: chat.un, time: "45"}));
                                API.moderateMuteUser(user.id, 1, API.MUTE.LONG);
                            }
                            else if (time === 45) {
                                API.moderateMuteUser(user.id, 1, API.MUTE.LONG);
                                basicBot.roomUtilities.sendChat(subChat(basicBot.chat.mutedtime, {name: chat.un, username: name, time: time}));

                            }
                            else if (time > 30) {
                                API.moderateMuteUser(user.id, 1, API.MUTE.LONG);
                                basicBot.roomUtilities.sendChat(subChat(basicBot.chat.mutedtime, {name: chat.un, username: name, time: time}));
                                setTimeout(function (id) {
                                    API.moderateUnmuteUser(id);
                                }, time * 60 * 1000, user.id);
                            }
                            else if (time > 15) {
                                API.moderateMuteUser(user.id, 1, API.MUTE.MEDIUM);
                                basicBot.roomUtilities.sendChat(subChat(basicBot.chat.mutedtime, {name: chat.un, username: name, time: time}));
                                setTimeout(function (id) {
                                    API.moderateUnmuteUser(id);
                                }, time * 60 * 1000, user.id);
                            }
                            else {
                                API.moderateMuteUser(user.id, 1, API.MUTE.SHORT);
                                basicBot.roomUtilities.sendChat(subChat(basicBot.chat.mutedtime, {name: chat.un, username: name, time: time}));
                                setTimeout(function (id) {
                                    API.moderateUnmuteUser(id);
                                }, time * 60 * 1000, user.id);
                            }
                        }
                        else basicBot.roomUtilities.sendChat(subChat(basicBot.chat.muterank, {name: chat.un}));
                    }
                }
            },

            opCommand: {
                command: 'op',
                rank: 'user',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (typeof basicBot.settings.opLink === "string")
                            return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.oplist, {link: basicBot.settings.opLink}));
                    }
                }
            },

            pingCommand: {
                command: 'ping',
                rank: 'user',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        basicBot.roomUtilities.sendChat(basicBot.chat.pong)
                    }
                }
            },

            refreshCommand: {
                command: 'refresh',
                rank: 'manager',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        storeToStorage();
                        basicBot.disconnectAPI();
                        setTimeout(function () {
                            window.location.reload(false);
                        }, 1000);

                    }
                }
            },

            reloadCommand: {
                command: 'reload',
                rank: 'bouncer',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        basicBot.roomUtilities.sendChat(basicBot.chat.reload);
                        storeToStorage();
                        basicBot.disconnectAPI();
                        kill();
                        setTimeout(function () {
                            $.getScript(basicBot.scriptLink);
                        }, 2000);
                    }
                }
            },

            reloadtestCommand: {
                command: 'reloadtest',
                rank: 'bouncer',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        basicBot.roomUtilities.sendChat(basicBot.chat.reload);
                        storeToStorage();
                        basicBot.disconnectAPI();
                        kill();
                        setTimeout(function () {
                            $.getScript(basicBot.scriptTestLink);
                        }, 2000);
                    }
                }
            },

            removeCommand: {
                command: 'remove',
                rank: 'mod',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        if (msg.length > cmd.length + 2) {
                            var name = msg.substr(cmd.length + 2);
                            var user = basicBot.userUtilities.lookupUserName(name);
                            if (typeof user !== 'boolean') {
                                basicBot.userUtilities.resetDC(user);
                                if (API.getDJ().id === user.id) {
                                    API.moderateForceSkip();
                                    setTimeout(function () {
                                        API.moderateRemoveDJ(user.id);
                                    }, 1 * 1000, user);
                                }
                                else API.moderateRemoveDJ(user.id);
                            } else basicBot.roomUtilities.sendChat(subChat(basicBot.chat.removenotinwl, {name: chat.un, username: name}));
                        } else basicBot.roomUtilities.sendChat(subChat(basicBot.chat.nouserspecified, {name: chat.un}));
                    }
                }
            },

            restrictetaCommand: {
                command: 'restricteta',
                rank: 'bouncer',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (basicBot.settings.etaRestriction) {
                            basicBot.settings.etaRestriction = !basicBot.settings.etaRestriction;
                            return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.toggleoff, {name: chat.un, 'function': basicBot.chat.etarestriction}));
                        }
                        else {
                            basicBot.settings.etaRestriction = !basicBot.settings.etaRestriction;
                            return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.toggleon, {name: chat.un, 'function': basicBot.chat.etarestriction}));
                        }
                    }
                }
            },
            rouletteCommand: {
                command: 'roulette',
                rank: 'mod',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    if (basicBot.room.roulette.rouletteStatus) return void (0);
                    if (basicBot.roomUtilities.rouletteTimeRange()) {
                        basicBot.roomUtilities.sendChat("The LAW runs the Roulette weekdays 9AM-5PM EST");
                        return void (0);
                    }
                    basicBot.room.roulette.startRoulette();
                }
            },

            rulesCommand: {
                command: 'rules',
                rank: 'user',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (typeof basicBot.settings.rulesLink === "string")
                            return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.roomrules, {link: basicBot.settings.rulesLink}));
                    }
                }
            },

            sessionstatsCommand: {
                command: 'sessionstats',
                rank: 'bouncer',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var from = chat.un;
                        var woots = basicBot.room.roomstats.totalWoots;
                        var mehs = basicBot.room.roomstats.totalMehs;
                        var grabs = basicBot.room.roomstats.totalCurates;
                        basicBot.roomUtilities.sendChat(subChat(basicBot.chat.sessionstats, {name: from, woots: woots, mehs: mehs, grabs: grabs}));
                    }
                }
            },

            skipCommand: {
                command: 'skip',
                rank: 'bouncer',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (!basicBot.roomUtilities.canSkip()) return basicBot.roomUtilities.sendChat("Skip too soon...");
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        basicBot.roomUtilities.logInfo(subChat(basicBot.chat.skip, {name: chat.un}));
                        API.moderateForceSkip();
                        basicBot.room.skippable = false;
                        setTimeout(function () {
                            basicBot.room.skippable = true
                        }, 5 * 1000);

                    }
                }
            },

            blockedCommand: {
                command: 'blocked',
                rank: 'bouncer',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (!basicBot.roomUtilities.canSkip()) return basicBot.roomUtilities.sendChat("Skip too soon...");
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        try {
                            basicBot.roomUtilities.logInfo(subChat(basicBot.chat.skip, {name: chat.un}));
                            var dj = API.getDJ();
                            var msgSend = '@' + dj.username + ': this song has been blocked in the US. please find another version.';
                            API.moderateForceSkip();
                            basicBot.room.skippable = false;
                            setTimeout(function () {
                                basicBot.room.skippable = true
                            }, 5 * 1000);
                            basicBot.roomUtilities.sendChat(msgSend);
                        }
                        catch (e) {
                            basicBot.roomUtilities.logException("blockedCommand: " + err.message);
                        }
                    }
                }
            },

            oobCommand: {
                command: 'oob',
                rank: 'bouncer',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (!basicBot.roomUtilities.canSkip()) return basicBot.roomUtilities.sendChat("Skip too soon...");
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        try {
                            basicBot.roomUtilities.logInfo(subChat(basicBot.chat.skip, {name: chat.un}));
                            var dj = API.getDJ();
                            var msgSend = '@' + dj.username + ': your song has been skipped. Please read the rules before you play your next song.';
                            API.moderateForceSkip();
                            basicBot.room.skippable = false;
                            setTimeout(function () {
                                basicBot.room.skippable = true
                            }, 5 * 1000);
                            basicBot.roomUtilities.sendChat(msgSend);
                            setTimeout(function () {
                                basicBot.roomUtilities.sendChat(subChat(basicBot.chat.roomrules, {link: basicBot.settings.rulesLink}));
                            }, 1000);
                        }
                        catch (e) {
                            basicBot.roomUtilities.logException("oob: " + err.message);
                        }
                    }
                }
            },
            songstatsCommand: {
                command: 'songstats',
                rank: 'mod',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (basicBot.settings.songstats) {
                            basicBot.settings.songstats = !basicBot.settings.songstats;
                            return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.toggleoff, {name: chat.un, 'function': basicBot.chat.songstats}));
                        }
                        else {
                            basicBot.settings.songstats = !basicBot.settings.songstats;
                            return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.toggleon, {name: chat.un, 'function': basicBot.chat.songstats}));
                        }
                    }
                }
            },

            sourceCommand: {
                command: 'source',
                rank: 'user',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        basicBot.roomUtilities.sendChat('/me This bot was made by ' + botCreator + '.');
                    }
                }
            },

            statusCommand: {
                command: 'status',
                rank: 'bouncer',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var from = chat.un;
                        var msg = '/me [@' + from + '] ';

                        msg += basicBot.chat.afkremoval + ': ';
                        if (basicBot.settings.afkRemoval) msg += 'ON';
                        else msg += 'OFF';
                        msg += '. ';
                        msg += basicBot.chat.afksremoved + ": " + basicBot.room.afkList.length + '. ';
                        msg += basicBot.chat.afklimit + ': ' + basicBot.settings.maximumAfk + '. ';

                        msg += basicBot.chat.repeatSongs + ': ';
                        if (basicBot.settings.repeatSongs) msg += 'ON';
                        else msg += 'OFF';
                        msg += '. ';
                        msg += basicBot.chat.repeatSongLimit + ': ' + basicBot.settings.repeatSongTime + '. ';

                        msg +=  'Random Comments' + ': ';
                        if (basicBot.settings.randomComments) msg += 'ON';
                        else msg += 'OFF';
                        msg += '. ';

                        msg +=  'Random Roulette' + ': ';
                        if (basicBot.settings.randomRoulette) msg += 'ON';
                        else msg += 'OFF';
                        msg += '. ';

                        msg += 'Bouncer+: ';
                        if (basicBot.settings.bouncerPlus) msg += 'ON';
                        else msg += 'OFF';
                        msg += '. ';
                                                
                        msg += basicBot.chat.blacklist + ': ';
                        if (basicBot.settings.blacklistEnabled) msg += 'ON';
                        else msg += 'OFF';
                        msg += '. ';

                        msg += basicBot.chat.lockguard + ': ';
                        if (basicBot.settings.lockGuard) msg += 'ON';
                        else msg += 'OFF';
                        msg += '. ';

                        msg += basicBot.chat.cycleguard + ': ';
                        if (basicBot.settings.cycleGuard) msg += 'ON';
                        else msg += 'OFF';
                        msg += '. ';

                        msg += basicBot.chat.timeguard + ': ';
                        if (basicBot.settings.timeGuard) msg += 'ON';
                        else msg += 'OFF';
                        msg += '. ';

                        var msg2 = basicBot.chat.chatfilter + ': ';
                        if (basicBot.settings.filterChat) msg2 += 'ON';
                        else msg2 += 'OFF';
                        msg2 += '. ';

                        msg2 += basicBot.chat.voteskip + ': ';
                        if (basicBot.settings.voteSkipEnabled) msg2 += 'ON';
                        else msg2 += 'OFF';
                        msg2 += '. ';

                        var launchT = basicBot.room.roomstats.launchTime;
                        var durationOnline = Date.now() - launchT;
                        var since = basicBot.roomUtilities.msToStr(durationOnline);
                        msg2 += subChat(basicBot.chat.activefor, {time: since});

                        setTimeout(function () { basicBot.roomUtilities.sendChat(msg2); }, 500);
                        return basicBot.roomUtilities.sendChat(msg);
                        return ; 
                    }
                }
            },

            swapCommand: {
                command: 'swap',
                rank: 'mod',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        if (msg.length === cmd.length) return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.nouserspecified, {name: chat.un}));
                        var firstSpace = msg.indexOf(' ');
                        var lastSpace = msg.lastIndexOf(' ');
                        var name1 = msg.substring(cmd.length + 2, lastSpace);
                        var name2 = msg.substring(lastSpace + 2);
                        var user1 = basicBot.userUtilities.lookupUserName(name1);
                        var user2 = basicBot.userUtilities.lookupUserName(name2);
                        if (typeof user1 === 'boolean' || typeof user2 === 'boolean') return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.swapinvalid, {name: chat.un}));
                        if (user1.id === basicBot.loggedInID || user2.id === basicBot.loggedInID) return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.addbottowaitlist, {name: chat.un}));
                        var p1 = API.getWaitListPosition(user1.id) + 1;
                        var p2 = API.getWaitListPosition(user2.id) + 1;
                        if (p1 < 0 || p2 < 0) return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.swapwlonly, {name: chat.un}));
                        basicBot.roomUtilities.sendChat(subChat(basicBot.chat.swapping, {'name1': name1, 'name2': name2}));
                        if (p1 < p2) {
                            basicBot.userUtilities.moveUser(user2.id, p1, false);
                            setTimeout(function (user1, p2) {
                                basicBot.userUtilities.moveUser(user1.id, p2, false);
                            }, 2000, user1, p2);
                        }
                        else {
                            basicBot.userUtilities.moveUser(user1.id, p2, false);
                            setTimeout(function (user2, p1) {
                                basicBot.userUtilities.moveUser(user2.id, p1, false);
                            }, 2000, user2, p1);
                        }
                    }
                }
            },

            themeCommand: {
                command: 'theme',
                rank: 'user',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (typeof basicBot.settings.themeLink === "string")
                            basicBot.roomUtilities.sendChat(subChat(basicBot.chat.genres, {link: basicBot.settings.themeLink}));
                    }
                }
            },

            timeguardCommand: {
                command: 'timeguard',
                rank: 'bouncer',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (basicBot.settings.timeGuard) {
                            basicBot.settings.timeGuard = !basicBot.settings.timeGuard;
                            return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.toggleoff, {name: chat.un, 'function': basicBot.chat.timeguard}));
                        }
                        else {
                            basicBot.settings.timeGuard = !basicBot.settings.timeGuard;
                            return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.toggleon, {name: chat.un, 'function': basicBot.chat.timeguard}));
                        }

                    }
                }
            },

            toggleblCommand: {
                command: 'togglebl',
                rank: 'bouncer',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var temp = basicBot.settings.blacklistEnabled;
                        basicBot.settings.blacklistEnabled = !temp;
                        if (basicBot.settings.blacklistEnabled) {
                          return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.toggleon, {name: chat.un, 'function': basicBot.chat.blacklist}));
                        }
                        else return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.toggleoff, {name: chat.un, 'function': basicBot.chat.blacklist}));
                    }
                }
            },
                        
            togglemotdCommand: {
                command: 'togglemotd',
                rank: 'bouncer',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (basicBot.settings.motdEnabled) {
                            basicBot.settings.motdEnabled = !basicBot.settings.motdEnabled;
                            basicBot.roomUtilities.sendChat(subChat(basicBot.chat.toggleoff, {name: chat.un, 'function': basicBot.chat.motd}));
                        }
                        else {
                            basicBot.settings.motdEnabled = !basicBot.settings.motdEnabled;
                            basicBot.roomUtilities.sendChat(subChat(basicBot.chat.toggleon, {name: chat.un, 'function': basicBot.chat.motd}));
                        }
                    }
                }
            },

            unbanCommand: {
                command: 'unban',
                rank: 'bouncer',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        $(".icon-population").click();
                        $(".icon-ban").click();
                        setTimeout(function (chat) {
                            var msg = chat.message;
                            if (msg.length === cmd.length) return basicBot.roomUtilities.sendChat();
                            var name = msg.substring(cmd.length + 2);
                            var bannedUsers = API.getBannedUsers();
                            var found = false;
                            var bannedUser = null;
                            for (var i = 0; i < bannedUsers.length; i++) {
                                var user = bannedUsers[i];
                                if (user.username === name) {
                                    bannedUser = user;
                                    found = true;
                                }
                            }
                            if (!found) {
                                $(".icon-chat").click();
                                return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.notbanned, {name: chat.un}));
                            }
                            API.moderateUnbanUser(bannedUser.id);
                            //basicBot.roomUtilities.logDebug("Unbanned " + name);
                            setTimeout(function () {
                                $(".icon-chat").click();
                            }, 1000);
                        }, 1000, chat);
                    }
                }
            },

            unlockCommand: {
                command: 'unlock',
                rank: 'mod',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        basicBot.roomUtilities.booth.unlockBooth();
                    }
                }
            },

            unmuteCommand: {
                command: 'unmute',
                rank: 'bouncer',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        var permFrom = basicBot.userUtilities.getPermission(chat.uid);
                        /**
                         if (msg.indexOf('@') === -1 && msg.indexOf('all') !== -1) {
                            if (permFrom > 2) {
                                basicBot.room.mutedUsers = [];
                                return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.unmutedeveryone, {name: chat.un}));
                            }
                            else return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.unmuteeveryonerank, {name: chat.un}));
                        }
                         **/
                        var from = chat.un;
                        var name = msg.substr(cmd.length + 2);

                        var user = basicBot.userUtilities.lookupUserName(name);

                        if (typeof user === 'boolean') return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.invaliduserspecified, {name: chat.un}));

                        var permUser = basicBot.userUtilities.getPermission(user.id);
                        if (permFrom > permUser) {
                            /*
                             var muted = basicBot.room.mutedUsers;
                             var wasMuted = false;
                             var indexMuted = -1;
                             for (var i = 0; i < muted.length; i++) {
                             if (muted[i] === user.id) {
                             indexMuted = i;
                             wasMuted = true;
                             }
                             }
                             if (!wasMuted) return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.notmuted, {name: chat.un}));
                             basicBot.room.mutedUsers.splice(indexMuted);
                             basicBot.roomUtilities.sendChat(subChat(basicBot.chat.unmuted, {name: chat.un, username: name}));
                             */
                            try {
                                API.moderateUnmuteUser(user.id);
                                basicBot.roomUtilities.sendChat(subChat(basicBot.chat.unmuted, {name: chat.un, username: name}));
                            }
                            catch (e) {
                                basicBot.roomUtilities.sendChat(subChat(basicBot.chat.notmuted, {name: chat.un}));
                            }
                        }
                        else basicBot.roomUtilities.sendChat(subChat(basicBot.chat.unmuterank, {name: chat.un}));
                    }
                }
            },

            usercmdcdCommand: {
                command: 'usercmdcd',
                rank: 'manager',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        var cd = msg.substring(cmd.length + 1);
                        if (!isNaN(cd)) {
                            basicBot.settings.commandCooldown = cd;
                            return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.commandscd, {name: chat.un, time: basicBot.settings.commandCooldown}));
                        }
                        else return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.invalidtime, {name: chat.un}));
                    }
                }
            },

            usercommandsCommand: {
                command: 'usercommands',
                rank: 'manager',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (basicBot.settings.usercommandsEnabled) {
                            basicBot.roomUtilities.sendChat(subChat(basicBot.chat.toggleoff, {name: chat.un, 'function': basicBot.chat.usercommands}));
                            basicBot.settings.usercommandsEnabled = !basicBot.settings.usercommandsEnabled;
                        }
                        else {
                            basicBot.roomUtilities.sendChat(subChat(basicBot.chat.toggleon, {name: chat.un, 'function': basicBot.chat.usercommands}));
                            basicBot.settings.usercommandsEnabled = !basicBot.settings.usercommandsEnabled;
                        }
                    }
                }
            },

            mystatsCommand: {
                command: 'mystats',
                rank: 'user',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    try {
                        if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                        if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                        var msg = chat.message;
                        var name = "";
                        if (msg.length === cmd.length) name = chat.un
                        else name = msg.substring(cmd.length + 2);
                        var user = basicBot.userUtilities.lookupUserName(name);
                        if (user === false) return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.invaliduserspecified, {name: chat.un}));
                        var msg = subChat(basicBot.chat.mystats, {name: user.username, 
                                                                     songs: user.votes.songs,
                                                                     woot: user.votes.woot, 
                                                                     mehs: user.votes.meh, 
                                                                     grabs: user.votes.curate, 
                                                                     tasty: user.votes.tasty});
                        var byusername = " [ executed by " + chat.un + " ]";
                        if (chat.un !== name) msg += byusername;
                        basicBot.roomUtilities.sendChat(msg);
                    }
                    catch(err) {
                        basicBot.roomUtilities.logException("mystatsCommand: " + err.message);
                    }
                }
            },
            mystatsxCommand: {
                command: 'mystatsx',
                rank: 'manager',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    try {
                        if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                        if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                        var msg = chat.message;
                        var name = "";
                        if (msg.length === cmd.length) name = chat.un
                        else name = msg.substring(cmd.length + 2);
                        var user = basicBot.userUtilities.lookupUserName(name);
                        if (user === false) return basicBot.roomUtilities.chatLog(subChat(basicBot.chat.invaliduserspecified, {name: chat.un}));
                        var msg = subChat(basicBot.chat.mystats, {name: user.username, 
                                                                     songs: user.votes.songs,
                                                                     woot: user.votes.woot, 
                                                                     mehs: user.votes.meh, 
                                                                     grabs: user.votes.curate, 
                                                                     tasty: user.votes.tasty});
                        var byusername = " [ executed by " + chat.un + " ]";
                        if (chat.un !== name) msg += byusername;
                        basicBot.roomUtilities.chatLog(msg);
                    }
                    catch(err) {
                        basicBot.roomUtilities.logException("mystatsCommand: " + err.message);
                    }
                }
            },
            voteratioCommand: {
                command: 'voteratio',
                rank: 'bouncer',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        if (msg.length === cmd.length) return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.nouserspecified, {name: chat.un}));
                        var name = msg.substring(cmd.length + 2);
                        var user = basicBot.userUtilities.lookupUserName(name);
                        if (user === false) return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.invaliduserspecified, {name: chat.un}));
                        var vratio = user.votes;
                        var ratio = vratio.woot / vratio.meh;
                        basicBot.roomUtilities.sendChat(subChat(basicBot.chat.voteratio, {name: chat.un, username: name, woot: vratio.woot, mehs: vratio.meh, ratio: ratio.toFixed(2)}));
                    }
                }
            },

            welcomeCommand: {
                command: 'welcome',
                rank: 'mod',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (basicBot.settings.welcome) {
                            basicBot.settings.welcome = !basicBot.settings.welcome;
                            return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.toggleoff, {name: chat.un, 'function': basicBot.chat.welcomemsg}));
                        }
                        else {
                            basicBot.settings.welcome = !basicBot.settings.welcome;
                            return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.toggleon, {name: chat.un, 'function': basicBot.chat.welcomemsg}));
                        }
                    }
                }
            },

             versionCommand: {  //Added 01/27/2015 Zig
                command: 'version',
                rank: 'mod',
                type: 'exact',
                functionality: function (chat, cmd)                 {
                    basicBot.roomUtilities.sendChat(subChat(basicBot.chat.online, {botname: basicBot.settings.botName, version: basicBot.version}));
                }
            },

             echoCommand: {   //Added 01/27/2015 Zig
                command: 'echo',
                rank: 'manager',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                try{
                    //basicBot.roomUtilities.logDebug("echoCommand:1");
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    //basicBot.roomUtilities.logDebug("echoCommand:2");
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    //basicBot.roomUtilities.logDebug("echoCommand:3");
                    var msg = chat.message;
                    if (msg.length === cmd.length) return;
                    //basicBot.roomUtilities.logDebug("echoCommand:4");
                    var msgContent = msg.substring(cmd.length + 1);
                    basicBot.roomUtilities.logInfo(chat.un + " used echo: " + msgContent);
                    return basicBot.roomUtilities.sendChat(msgContent);
                    }
                catch(err) {
                    basicBot.roomUtilities.logException("echoCommand: " + err.message);
                }
                }
            },
             beerCommand: {   //Added 02/25/2015 Zig
                command: 'beer',
                rank: 'mod',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                try{
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    return basicBot.roomUtilities.sendChat("@Bacon_Cheeseburger time for another PBR!");
                    }
                catch(err) {
                    basicBot.roomUtilities.logException("beerCommand: " + err.message);
                }
                }
            },
            speakCommand: {   //Added 02/25/2015 Zig
                command: 'speak',
                rank: 'mod',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                try{
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    return basicBot.roomUtilities.sendChat(basicBot.roomUtilities.randomCommentSelect());
                    }
                catch(err) {
                    basicBot.roomUtilities.logException("speakCommand: " + err.message);
                }
                }
            },
            websiteCommand: {
                command: ['website','web'],
                rank: 'user',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (typeof basicBot.settings.website === "string")
                            basicBot.roomUtilities.sendChat(subChat(basicBot.chat.website, {link: basicBot.settings.website}));
                    }
                }
            },

            //wootCommand: {   //Added 02/18/2015 Zig
            //    command: 'woot',
            //    rank: 'user',
            //    type: 'exact',
            //    functionality: function (chat, cmd) {
            //        if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
            //        if (!basicBot.commands.executable(this.rank, chat)) return void (0);
            //        else {
            //            basicBot.roomUtilities.wootThisSong();
            //        }
            //    }
            //},
            origemCommand: {
                command: 'origem',
                rank: 'user',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        basicBot.roomUtilities.sendChat(basicBot.chat.origem);
                    }
                }
            },
            mehCommand: {  //Added 02/14/2015 Zig
                command: 'meh',
                rank: 'manager',
                type: 'exact',
                functionality: function (chat, cmd)                 {
                  try  {
                    $("#meh").click();
                  }  
                catch(err) {
                  basicBot.roomUtilities.logException("mehCommand: " + err.message);
                }
              }
            },
            englishCommand: {
                command: 'english',
                rank: 'bouncer',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    try {
                        if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                        if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                        else {
                            if(chat.message.length === cmd.length) return basicBot.roomUtilities.sendChat('/me No user specified.');
                            var name = chat.message.substring(cmd.length + 2);
                            var roomUser = basicBot.userUtilities.lookupUserName(name);
                            if(typeof roomUser === 'boolean') return basicBot.roomUtilities.sendChat('/me Invalid user specified.');
                            var lang = basicBot.userUtilities.getPlugUser(roomUser).language;
                            basicBot.roomUtilities.logDebug("lang: " + lang);
                            basicBot.roomUtilities.logDebug("roomUser: " + roomUser.username);
                            basicBot.roomUtilities.logDebug("roomUser: " + roomUser.id);
                            var englishMessage = basicBot.userUtilities.englishMessage(lang, name);
                            basicBot.roomUtilities.sendChat(englishMessage);
                        }
                    }
                    catch(err) { basicBot.roomUtilities.logException("englishCommand: " + err.message); }
                }
            },
            grabCommand: {  //Added 02/14/2015 Zig
                command: 'grab',
                rank: 'manager',
                type: 'exact',
                functionality: function (chat, cmd)                 {
                  try  {
                    $("#grab").click();
                  }  
                catch(err) {
                  basicBot.roomUtilities.logException("grabCommand: " + err.message);
                }
              }
            },
            dasbootCommand: {
                command: 'dasboot',
                rank: 'manager',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    var msg = chat.message;
                    if (msg.length === cmd.length) return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.nouserspecified, {name: chat.un}));
                    var bootid = msg.substr(cmd.length + 1);
                    if (isNaN(bootid)) return basicBot.roomUtilities.sendChat("Invalid ID");
                    basicBot.roomUtilities.logInfo("Boot ID: " + bootid);
                    API.moderateBanUser(bootid, 1, API.BAN.PERMA);
                }
            },

            zigunbanCommand: {
                command: 'zigunban',
                rank: 'bouncer',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        $(".icon-population").click();
                        $(".icon-ban").click();
                        setTimeout(function (chat) {
                            var msg = chat.message;
                            if (msg.length === cmd.length) return basicBot.roomUtilities.sendChat();
                            var name = msg.substring(cmd.length + 2);
                            var bannedUsers = API.getBannedUsers();
                            var found = false;
                            var bannedUser = null;
                            for (var i = 0; i < bannedUsers.length; i++) {
                                var user = bannedUsers[i];
                                if (user.username === name) {
                                    bannedUser = user;
                                    found = true;
                                }
                            }
                            if (!found) {
                                $(".icon-chat").click();
                                return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.notbanned, {name: chat.un}));
                            }
                            //API.moderateUnbanUser(bannedUser.id);
                            basicBot.roomUtilities.logDebug("Unbanned: " + name);
                            basicBot.roomUtilities.logDebug("Unban ID: " + bannedUser.id);
                            setTimeout(function () {
                                $(".icon-chat").click();
                            }, 1000);
                        }, 1000, chat);
                    }
                }
            },
            rollCommand: {   //Added 03/30/2015 Zig
                command: 'roll',
                rank: 'user',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    try {
                        if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                        if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                        if (API.getDJ().id !== chat.uid) return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.notcurrentdj, {name: chat.un}));
                        if (basicBot.userUtilities.getRolled(chat.un))  return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.doubleroll, {name: chat.un}));
                        var msg = chat.message;
                        var dicesides = 6;
                        if (msg.length > cmd.length){
                            var dice = msg.substr(cmd.length + 1);
                            if (!isNaN(dice)) dicesides = dice;
                            if (dicesides < 4) dicesides = 4;
                        }
                        var rollResults = Math.floor(Math.random() * dicesides) + 1;
                        basicBot.userUtilities.setRolled(chat.un, true);
                        if (rollResults > (dicesides * 0.5)) {
                            setTimeout(function () { basicBot.userUtilities.tastyVote(basicBot.userUtilities.getCurrentPlugUser().id,"winner"); }, 1000);
                            setTimeout(function () { basicBot.roomUtilities.wootThisSong(); }, 1500);
                            basicBot.roomUtilities.sendChat(subChat(basicBot.chat.rollresultsgood, {name: chat.un, roll: rollResults}));
                        }
                        else {
                            setTimeout(function () { basicBot.roomUtilities.mehThisSong(); }, 1000);
                            basicBot.roomUtilities.sendChat(subChat(basicBot.chat.rollresultsbad, {name: chat.un, roll: rollResults}));
                        }
                        /*
                        if (rollResults >= (dicesides * 0.8))
                            setTimeout(function () { basicBot.userUtilities.tastyVote(basicBot.userUtilities.getCurrentPlugUser().id, "winner"); }, 1000);
                        else if (rollResults <= (dicesides * 0.2))
                            setTimeout(function () { basicBot.roomUtilities.mehThisSong(); }, 1000);
                            */
                    }
                    catch(err) {
                        basicBot.roomUtilities.logException("rollCommand: " + err.message);
                    }
                }
            },
            meetingCommand: {   //Added 03/28/2015 Zig
                command: ['meeting', 'lunch', 'beerrun'],
                rank: 'user',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    try {
                        if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                        if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                        var msg = chat.message;
                        var name;
                        var byusername = " ";
                        if (msg.length === cmd.length) name = chat.un;
                        else {
                            name = msg.substring(cmd.length + 2);
                            var perm = basicBot.userUtilities.getPermission(chat.uid);
                            if (perm < 2) return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.bootrank, {name: chat.un}));
                            byusername = " [ executed by " + chat.un + " ]";
                        }
                        var user = basicBot.userUtilities.lookupUserName(name);
                        var currPos = API.getWaitListPosition(user.id) + 1;
                        if (currPos < 1) return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.notinwaitlist, {name: name}));
                        user.lastKnownPosition = currPos;
                        user.lastSeenInLine = Date.now();
                        basicBot.userUtilities.updateDC(user);
                        var msg;
                        if (cmd == '.beerrun') {
                            basicBot.userUtilities.setBeerRunStatus(user, true);
                            msg = subChat(basicBot.chat.beerrunleave, {name: basicBot.userUtilities.getPlugUser(user).username, pos: currPos});
                        }
                        if (cmd == '.lunch') {
                            basicBot.userUtilities.setLunchStatus(user, true);
                            msg = subChat(basicBot.chat.lunchleave, {name: basicBot.userUtilities.getPlugUser(user).username, pos: currPos});
                        }
                        if (cmd == '.meeting') {
                            basicBot.userUtilities.setMeetingStatus(user, true);
                            msg = subChat(basicBot.chat.meetingleave, {name: basicBot.userUtilities.getPlugUser(user).username, pos: currPos});

                        }
                        setTimeout(function () { API.moderateRemoveDJ(user.id); }, 1000);
                        basicBot.roomUtilities.sendChat(msg + byusername);
                    }
                    catch(err) {
                        basicBot.roomUtilities.logException("meetingCommand: " + err.message);
                    }
                }
            },
            tastyCommand: {
                command: ['tasty', 'rock', 'props', 'woot', 'groot', 'groovy', 'jam','nice','bop','cowbell','sax','ukulele','tango','samba','disco','waltz','metal',
                          'bob','boogie','cavort','conga','flit','foxtrot','frolic','gambol','hop','hustle','jig','jitter','jitterbug','jive','jump','leap','prance','promenade','rhumba',
                          'shimmy','strut','sway','swing','great','hail','good','acceptable','bad','excellent','exceptional','favorable','marvelous','positive','satisfactory','satisfying',
                          'superb','valuable','wonderful','ace','boss','bully','capital','choice','crack','pleasing','prime','rad','sound','spanking','sterling','super','superior',
                          'welcome','worthy','admirable','agreeable','commendable','congenial','deluxe','first-class','first-rate','gnarly','gratifying','honorable','neat','precious',
                          'recherché','reputable','select','shipshape','splendid','stupendous','keen','nifty','swell','sensational','fine','cool','perfect','wicked','fab','heavy',
                          'incredible','outstanding','phenomenal','remarkable','special','terrific','unique','aces','capital','dandy','enjoyable','exquisite',
                          'fashionable','lovely','love','solid','striking','top-notch','slick','pillar','exemplary','alarming','astonishing','awe-inspiring',
                          'beautiful','breathtaking','fearsome','formidable','frightening','winner','impressive','intimidating','facinating','prodigious',
                          'magnificent','overwhelming','shocking','stunning','stupefying','majestic','grand',
                          'creamy','easy','effortless','fluid','gentle','glossy','peaceful','polished','serene','sleek','soft','tranquil','velvety','soothing','fluent','frictionless',
                          'lustrous','rhythmic','crackerjack','laudable','peachy','praiseworthy','rare','super-duper','unreal','chill','savvy','smart','ingenious','genious',
                          'sweet','delicious','lucious','bonbon','fetch','fetching','appealing','delightful','absorbing','alluring','cute','electrifying',
                          'awesome','bitchin','fly','pleasant','relaxing','mellow','nostalgia','punk','like','fries','cake','drum','guitar','bass','tune','pop',
                          'apple','fantastic','spiffy','yes','fabulous','happy','smooth','classic','mygirlfriend','skank','jiggy','funk','funky','jazz','jazzy','dance','elvis',
                          'hawt','extreme','dude','babes','fun','reggae','party','drums','trumpet','mosh','bang','epic','blues','heart','feels','dope','makeitrain','wumbo',
                          'firstclass','firstrate','topnotch','aweinspiring','superduper','dabomb','dashit','badass','bomb','popcorn','awesomesauce','awesomeness','sick',
                          'sexy','brilliant','steampunk','bagpipes','piccolo','whee','vibe','banjo','harmony','harmonica','flute','dancing','dancin','ducky','approval','winning','okay',
                          'hunkydory','peach','divine','radiant','sublime','refined','foxy','allskate'],
                rank: 'manager',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    try {
                        basicBot.userUtilities.tastyVote(chat.uid, cmd);
                    }
                    catch(err) {
                        basicBot.roomUtilities.logException("tastyCommand: " + err.message);
                    }
                }
            },
            lastplayedCommand: {
                command: 'lastplayed',
                rank: 'user',
                type: 'exact',
                functionality: function (chat, cmd) {
                    try {
                        if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                        if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                        basicBot.roomUtilities.sendChat(basicBot.songinfo.songStatsMsg);
                    }
                    catch(err) {
                        basicBot.roomUtilities.logException("lastplayed: " + err.message);
                    }
                }
            },
            nsfwCommand: {   //Added 04/22/2015 Zig
                command: 'nsfw',
                rank: 'user',
                type: 'exact',
                functionality: function (chat, cmd) {
                    try {
                        if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                        if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                        basicBot.roomUtilities.sendChat("NSFW Warning [" + chat.un + "]: @djs @rdjs @bouncers @managers @hosts @staff");
                    }
                    catch(err) {
                        basicBot.roomUtilities.logException("nsfwCommand: " + err.message);
                    }
                }
            },
            eightballCommand: {   //Added 04/01/2015 Zig
                command: ['8ball', 'eightball', 'larry'],
                rank: 'user',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    try {
                        if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                        if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                        var msg = chat.message;
                        var magicResponse = basicBot.roomUtilities.eightBallSelect();
                        if (msg.length === cmd.length)  return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.eightballresponse2, {name: chat.un, response: magicResponse }));
                        var myQuestion = msg.substring(cmd.length + 1);
                        basicBot.roomUtilities.sendChat(subChat(basicBot.chat.eightballquestion, {name: chat.un, question: myQuestion}));
                        setTimeout(function () {
                            basicBot.roomUtilities.sendChat(subChat(basicBot.chat.eightballresponse1, {response: magicResponse}));
                        }, 500);
                    }
                    catch(err) {
                        basicBot.roomUtilities.logException("eightballCommand: " + err.message);
                    }
                }
            },
            zigbanCommand: {
                command: 'zigban',
                rank: 'manager',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    var msg = chat.message;
                    if (msg.length === cmd.length) return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.nouserspecified, {name: chat.un}));
                    var bootid = msg.substr(cmd.length + 1);
                    if (isNaN(bootid)) return basicBot.roomUtilities.sendChat("Invalid ID");
                    $(".icon-population").click();
                    $(".icon-ban").click();
                    setTimeout(function (bootid) {
                        basicBot.roomUtilities.logDebug("Boot ID: " + bootid);
                        //API.moderateBanUser(bootid, 1, API.BAN.PERMA);
                        setTimeout(function () {
                            $(".icon-chat").click();
                        }, 1000);
                    }, 1000);
                }
            },
            zigCommand: {   //Added 01/27/2015 Zig
                command: 'zig',
                rank: 'cohost',
                type: 'exact',
                functionality: function (chat, cmd)                 {
                    try {
                        if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                        if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                         $("#dj-button").click();
                         setTimeout(function () { $("#dialog-confirm > div:nth-child(3) > div.button.submit > span").click(); }, 1 * 1000);
            /*
            #dialog-confirm > div:nth-child(3) > div.button.cancel > span
            #dialog-confirm > div:nth-child(3) > div.button.submit > span
            #dj-button > span
            //*[@id="dj-button"]/span
            //*[@id="dialog-confirm"]/div[3]/div[2]/span
            // document.getElementById(":1vq.post").click(); 
            */
                        
                    }
                    catch(err) {
                        basicBot.roomUtilities.logException("zigCommand: " + err.message);
                    }
                }
            },
            debugCommand: {
                command: 'debug',
                rank: 'cohost',
                type: 'exact',
                functionality: function (chat, cmd) {
                    try {
                        if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                        if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                        basicBot.room.debug = (!basicBot.room.debug);
                        basicBot.roomUtilities.logInfo("Debug = " + basicBot.room.debug);
                    }
                    catch(err) { basicBot.roomUtilities.logException("debugCommand: " + err.message); }
                }
            },
            gifenabledCommand: {
                command: 'gifenabled',
                rank: 'cohost',
                type: 'exact',
                functionality: function (chat, cmd) {
                    try {
                        if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                        if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                        basicBot.settings.gifEnabled = (!basicBot.settings.gifEnabled);
                        basicBot.roomUtilities.logInfo("GifEnabled = " + basicBot.room.debug);
                    }
                    catch(err) { basicBot.roomUtilities.logException("gifenabledCommand: " + err.message); }
                }
            },
//            whoisCommand: {
//                command: 'whois',
//                rank: 'bouncer',
//                type: 'startsWith',
//                functionality: function (chat, cmd) {
//                    try {
//                        if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
//                        if (!basicBot.commands.executable(this.rank, chat)) return void (0);
//                        var msg = chat.message;
//                        if (msg.length === cmd.length) return basicBot.roomUtilities.sendChat(subChat(basicBot.chat.nouserspecified, {name: chat.un}));
//                        var whoisuser = msg.substr(cmd.length + 2);
//                        basicBot.roomUtilities.logDebug("whois: " + whoisuser);
//                        var user;
//                        if (isNaN(whoisuser)) user = basicBot.userUtilities.lookupUserName(whoisuser);
//                        else                  user = basicBot.userUtilities.getPlugUser(whoisuser);
//                        if (typeof user !== 'undefined')  {
//                            basicBot.roomUtilities.logDebug("USER ID: " + user.id);
//                            basicBot.roomUtilities.sendChat("USER: " + user.username + " " + user.id);
//                        }
//                        basicBot.roomUtilities.logDebug("TYPE: " + typeof user);
//                    }
//                    catch(err) {
//                        basicBot.roomUtilities.logException("whoisCommand: " + err.message);
//                    }
//                }
//            },

            whoisCommand: {
                command: 'whois',
                rank: 'bouncer',
                type: 'startsWith',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        var msg = chat.message;
                        var name;
                        if (msg.length === cmd.length) name = chat.un;
                        else name = msg.substr(cmd.length + 2);
                        var whoismsg = basicBot.roomUtilities.whoisinfo(chat.un, name);
                        if (whoismsg.length > 0) basicBot.roomUtilities.sendChat(whoismsg);
                    }
                }
            },

            youtubeCommand: {
                command: 'youtube',
                rank: 'user',
                type: 'exact',
                functionality: function (chat, cmd) {
                    if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                    if (!basicBot.commands.executable(this.rank, chat)) return void (0);
                    else {
                        if (typeof basicBot.settings.youtubeLink === "string")
                            basicBot.roomUtilities.sendChat(subChat(basicBot.chat.youtube, {name: chat.un, link: basicBot.settings.youtubeLink}));
                    }
                }
            }
        }
    };
    loadChat(basicBot.startup);
}).call(this);
