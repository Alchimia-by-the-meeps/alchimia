Alchimia, by the Meeps

https://seharlan.github.io/alchimia/

# Function Glossary

## localStorage

### gameState
Tracks the state of each "cell" in the game board grid as an array of arrays containing tile IDs.

const gameState = 
[
   [null, null, 7, null, null, 154, null, null, null, null]
   [null, null, null, null, null, null, null, 6, null, null]
   [null, null, 67, 73, 74, 76, 45, 63, null, null, null]
                                                             ]
### user 
Tracks name and meeple image.

### placedTiles
Tracks all tile objects that have been played on the game board. 

### Sample tile object:
```
{
    10: { 
        id: 10, 
        sides: ["city", "city", "grass", "grass"], 
        rotation: 0,
        }, 
    ...
}
```

## utils/api.js

### maxRows
A number that defines the max game board rows

### maxColumns
A number that defines for max game board columns

### addRiverToPlacedTiles()

### saveUser(user)

### getUser()

### initializeGameState()
Returns `gameState` object from localStorage.

### getGameState()
Returns `gameState` object from localStorage.

### updateGameState(gameState)
Updates `gameState` object in localStorage.<br>
Parameters: 

### initializePlacedTiles()
Resets `placedTiles` object in localStorage to a new, blank object.

### getPlacedTiles()
Returns `placedTiles` object from localStorage.

### updatePlacesTiles(lastPlacedTile)
Updates `placesTiles` object in localStorage with `lastPlacedTile` 

### getTileValidation(row, column, topDeckTile)
returns true or false for valid tile placement and matching sides

### keepAdjacentsMatch(adjacentSides)
Returns a boolean indicating whether tile is allowed to be placed per game rules
 


## utils/make-user.js
makeUser(formData)
Creates a user object from form data.
Returns a user object.

const user = {
        name: formData.get('name'),
        meep: formData.get('meep'), 
        cityConnections: 0,
        roadConnections: 0, 
        monasteries: 0,
    };
***
***


Game Name: Alchimia
    by The Meeps
Goals
- MVP by Wednesday morning
- Group Understanding
- Mob programming
- Teaching on tasks we complete seperatly
- Psuedo code
MVP:
- Tile based board game random tile generator
and place into board grid, then place new
tile adjacent and save results.
Game Flow
1.   Log in Page:
    - user login
    - choose map
    - Instructions (pop up window)
2.  Game Board:
    - grid
    - header (how many tiles left)
    - tile stack (like solitare)
3.  Results
    - #tiles placed
Seperate pages:
Meet the Meeps
- names
- Meeps
Stretch Goals
1. Tile placement validation
2. Tile rotation
3. Score
    - cities
    - roads
    - table on side for points
4. Score based on completed objects
5. Mobile friendly
6. Result with board snap shot
7. multiplayer
8. themes
9. randomly render river


Conflict Plan:
What will your group do when they encounter a conflict?
1. Say the safe word, "Mongoose"
2. Step back from computers and breath for 3ish mins.
3. Everyone says how they're feeling. 
4. Outline the problem directly.
5. Present solutions and their pros and cons.
6. Vote.
7. If vote is tied grab a TA.
8. Evaluate the resolution process and re-adjust as necessary.
9. Hug it out.

How will you raise concerns to members who are not adequately contributing?
1. Pull in people to conversation, don't call out unless it's becoming a problem.
1. Reminding of shared purpose
1. If continued addresing it kindly/tactfully.

How and when will you escalate the conflict if your attempts are unsuccessful?
1. If we can't come to a group concensus then grab a TA.



Communication Plan:
How will you communicate after hours and on the weekend?
1. Slack
2. Make sure we check our slacks reguarly.

What is your strategy for ensuring everyone's voices are heard?
1. 15 minutes before every break, get together and chat as a whole team.
1. Gently pull those who haven't spoken into convo.
1. Be mindful of how much you've spoken.
1. Be ok being reminded of being checked.

How will you ensure that you are creating a safe environment where everyone feels comfortable speaking up?
1. Monitor your tone.
1. Don't target people. 
1. Don't interrupt. 
