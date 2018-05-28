# Threes Dice Game (Client Side JavaScript)
Threes is a dice game where the goal is to get the lowest score (with each die face counting for that value, with the exception of threes, which count as 0). It's played with 5 dice. In our version there are two players, the user and the computer.

A player starts off buy rolling 5 dice.
The player then chooses 1 or more dice to pin (that is, to save and count towards their score).
Once at least 1 die is pinned, the player rolls the remaining dice …
The player then chooses 1 or more dice to pin.
This process repeats until the player either pins all of the remaining dice, or there's only 1 die left, and the player is forced to pin that die.
Once all of a player's dice are pinned, the values of all of the rolls are added to determine a player's score.
3's count as 0
for example, if the pinned dice were: 1, 4, 1, 2, 3
… then the score would be: 8
The other player then repeats steps 1 - 6 to get their score.
The player with the lower score wins.
