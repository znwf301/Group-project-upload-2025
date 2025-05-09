/////////////////////////////////////////////////////////////////////////////////////////////// A SHATTERED REALITY \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\


///////////////////////////////////////////////////////////////////////////////////////////////// Initialisation \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
let GameFont
let Overlay
let ScreenHandler = 0 //[0] Cutscene, [1] Overworld, [2] Battle, [3] W/L screen, [4] shop
let WL_State = false

///////////////////////////////////////////////////////////////////////////////////////////////////// Cutscene \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

let Dialogue_Prog = 0
let CC_Asset = []
let CC_Dialogue = ["*wakes up*","Player: Where on earth am I?","*draws sword*","*nocks arrow*","Skeleton: youll never find your brother","Skeleton: my master will make sure of that","*sniggers*"]
let CC_Dialogue1 = ["*plated boots sink into the muddy floor*","Player: “this place stinks of death","Slime: *squelch, squelch, squelch*","Player:  I guess my sword needs a good varnish "]
let CC_Dialogue2 = ["*heaves sword out of the frozen scabbard*", "Player: Im starting to miss the warmth… What was that?"]
let CC_Dialogue3 = ["Player: That blizzard was treacherous","*Possessed knights draw their swords, their eyes delirious*","Player: Those poor souls… the wizard who did this will PAY!"]
let CC_Dialogue4 = ["*her brother huddles locked under bricks of the castle.*","*Mainyu the Dark wizard stands above, in front of the throne, looking pleased at her arrival*","Mainyu: Ive been expecting you, Hecate ","*waves staff to produce as dark cloud that covers underneath the roof of the castle*","Player: *Enraged*","Player: Your magic tricks do not scare me"]
let CC_Dialogue5 = ["*Mainyu falls like a tonne of bricks*","*His eyes roll back and as he breaths his last breath...*", "*He disappears into ashes*","*Hecate breaks open the brick floor and embraces her unconscious brother.*","Player: You are Safe! OH how I have worried.","*Gives a good look at her brother*","Lets get you out of this hell hole","*They flee the castle back home, where Hecate never had to take the sword again*"]

////////////////////////////////////////////////////////////////////////////////////////////////////// Battle \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//Player Stats - Assets
let PlayerStats = [100,0,0]   // HP, Defence,Coins

//Enemy Stats
let Enemy_Names = ["Skelaton", "Slime", "Snake", "Ice Spirit", "Posessed Knight", "Mainyu"]
let EnemyStats = [100, 10] //HP, Attack
let MaxEnemyHP

//Image Handler
let E_B_Sprite = [] //Enemy Sprites
let H_B_Sprite // Hero Sprite
let fx_B_Sprite = [] //Battle fx
let B_Background = [] //Battle Background
let Gui_Elements = []

let currentTime
let EndTime
let TimerInitiated = false
let TimerFinished = false
let FrameRest = true
let Waiting = false

// FTS 
let config = false 

//Battle Logic
let AttackPhase = false
let H_Phase = false //Hero Attack Phase anim + damage
let H_Attack = false //F = Defend, T = Attack

let E_Phase = false //Enemy Attack Phase anim + damage
let LB_Checker = false


/////////////////////////////////////////////////////////////////////////////////////////////// Open world (TileMap) \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//INTIALISE PLAYER VARIABLES
let player;
let playerSprite;
let playerSpeed = 5;
let CanMove = true //Used to enable and disable movement during battle and Cutscenes

//INITIALISE TILEMAP VARIABLES
let tileMap = []; //This is an array we will store our tiles in later
let tilesX = 10; //This will be how many tiles there will be on the x axis (horizontally)
let tilesY = 10; //This will be how many tiles there will be on the y axis (vertically)
let tileSize = 50; //How many pixels across each tile will be.
let textures = []; //value to store our textures for the graphics Map
let enemyWatcher = [false,false,false,false,false,false] //Checks if enemy is alive or dead (Used to display enemies on map)
let ShopChestHandler = [false, false] //Checks if a chest or shop has been interacted with (Used to display shop / chest on map)

//LEVEL DATA OBJECTS
let level0 = {
    graphicsMap: [ 
       //         2nd VALUE (x)
       //0  1  2  3  4  5  6  7  8  9
        [10, 10, 10, 9, 18, 6, 14, 10, 0, 16], //0
        [10, 10, 10, 3, 0, 10, 10, 10, 0, 4], //1
        [10, 10, 10, 4, 0, 0, 0, 9, 7, 15], //2
        [19, 1, 0, 3, 1, 1, 1, 4, 0, 0], //3
        [13, 6, 7, 8, 7, 5, 6, 15, 10, 10], //4  1st VALUE (y)
        [10, 10, 1, 0, 1, 4, 0, 10, 10, 0], //5
        [10, 10, 10, 1, 0, 3, 10, 10, 0, 1], //6
        [10, 10, 10, 10, 0, 4, 0, 0, 1, 17], //7
        [10, 10, 10, 10, 0, 3, 10, 1, 0, 1], //8
        [10, 10, 10, 10, 0, 2, 10, 0, 1, 0], //9
     ],

    tileRules: [ 
       //         2nd VALUE (x)
       //0  1  2  3  4  5  6  7  8  9
        [1, 1, 1, 0, 3, 0, 5, 1, 0, 2], //0
        [1, 1, 1, 0, 3, 1, 1, 1, 0, 0], //1
        [1, 1, 1, 0, 3, 0, 0, 0, 0, 0], //2
        [3, 3, 3, 3, 3, 3, 3, 3, 3, 3], //3
        [4, 0, 0, 0, 3, 0, 0, 0, 1, 1], //4  1st VALUE (y)
        [1, 1, 0, 0, 3, 0, 0, 1, 1, 0], //5
        [1, 1, 1, 0, 3, 0, 1, 1, 0, 0], //6
        [1, 1, 1, 1, 3, 3, 3, 3, 3, 3], //7
        [1, 1, 1, 1, 3, 0, 1, 0, 0, 0], //8
        [1, 1, 1, 1, 3, 0, 1, 0, 0, 0], //9

        //RULES
        // 0 = walkable
        // 1 = collision/unwalkable
        // 2 = BossBattle
        // 3 = Battle
        // 4 = Shop
        // 5 = Chest
    ],

     startTileX: 5,  //Sets X tile to start player on
     startTileY: 9   //Sets Y tile to start player on
}

let level1 = {
    graphicsMap: [
    //         2nd VALUE (x)  
    //    0  1  2  3  4  5  6  7  8  9
        [20, 23, 28, 23, 22, 23, 21, 23, 23, 23], // 0
        [21, 23, 29, 32, 20, 21, 23, 27, 26, 25], // 1
        [20, 20, 23, 20, 21, 21, 20, 29, 23, 23], // 2 
        [21, 20, 31, 23, 20, 20, 20, 21, 31, 20], // 3
        [20, 20, 23, 22, 20, 21, 28, 20, 21, 23], // 4
        [22, 21, 20, 20, 21, 20, 29, 20, 21, 21], // 5
        [23, 20, 21, 21, 20, 21, 23, 21, 20, 21], // 6
        [23, 22, 23, 20, 21, 23, 28, 23, 20, 21], // 7
        [33, 31, 20, 21, 23, 27, 30, 31, 21, 20], // 8
        [22, 20, 23, 23, 24, 30, 23, 22, 20, 34]  // 9
    ],

    tileRules: [
    //         2nd VALUE (x)  
    //   0  1  2  3  4  5  6  7  8  9
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1], // 0
        [0, 1, 1, 4, 0, 0, 1, 1, 1, 1], // 1
        [0, 0, 1, 0, 0, 0, 0, 1, 1, 1], // 2 
        [3, 3, 3, 1, 3, 3, 3, 3, 3, 0], // 3
        [0, 0, 1, 1, 0, 0, 1, 0, 0, 1], // 4  1st VALUE (y)
        [1, 0, 0, 0, 0, 0, 1, 0, 0, 0], // 5
        [1, 0, 0, 0, 0, 0, 1, 0, 0, 0], // 6
        [1, 1, 1, 0, 0, 1, 1, 1, 0, 0], // 7
        [5, 3, 3, 3, 1, 1, 1, 3, 3, 3], // 8
        [1, 0, 1, 1, 1, 1, 1, 1, 0, 2]  // 9
    ],

    startTileX: 0, //Sets X tile to start player on
    startTileY: 0  //Sets Y tile to start player on
}

let level2 = {

    graphicsMap: [ 
    //              2nd Value (x)
    //   0  1  2  3  4  5  6  7  8  9 
        [37, 37, 46, 37, 35, 35, 35, 35, 37, 37], // 0
        [36, 35, 35, 35, 35, 35, 35, 35, 35, 37], // 1
        [35, 35, 35, 38, 37, 35, 35, 38, 35, 35], // 2
        [35, 35, 35, 37, 37, 35, 38, 37, 35, 35], // 3
        [37, 35, 35, 47, 37, 37, 35, 35, 35, 35], // 4    1st Value (y)
        [35, 35, 35, 35, 38, 37, 37, 36, 35, 35], // 5
        [35, 45, 35, 35, 35, 35, 37, 37, 35, 35], // 6
        [42, 44, 43, 35, 35, 35, 38, 37, 35, 35], // 7
        [39, 40, 41, 35, 35, 35, 37, 37, 36, 35], // 8
        [35, 48, 35, 35, 35, 35, 38, 37, 35, 35]  // 9
    ],

    tileRules: [ 
    //              2nd Value (x)
    //   0  1  2  3  4  5  6  7  8  9 
        [1, 1, 4, 1, 0, 0, 0, 3, 1, 1], // 0
        [1, 0, 0, 3, 0, 0, 0, 3, 0, 1], // 1
        [0, 0, 0, 3, 1, 3, 3, 3, 0, 0], // 2
        [0, 0, 0, 1, 1, 0, 0, 1, 0, 0], // 3
        [1, 0, 0, 0, 1, 1, 0, 0, 0, 0], // 4    1st Value (y)
        [0, 0, 0, 5, 0, 1, 1, 1, 0, 0], // 5
        [0, 1, 0, 0, 0, 0, 1, 1, 0, 0], // 6
        [1, 1, 1, 3, 3, 3, 3, 1, 0, 0], // 7
        [1, 1, 1, 0, 0, 0, 1, 1, 1, 0], // 8
        [1, 2, 3, 3, 3, 3, 3, 1, 0, 0]  // 9
    ],

    startTileX: 9, //Sets X tile to start player on
    startTileY: 9  //Sets Y tile to start player on
}

let level3 = {

    graphicsMap: [ 
    //              2nd Value (x)
    //   0  1  2  3  4  5  6  7  8  9 
        [49, 54, 51, 51, 51, 60, 62, 51, 51, 51], // 0
        [50, 52, 50, 51, 51, 64, 66, 54, 51, 51], // 1
        [51, 55, 54, 60, 51, 52, 60, 52, 50, 51], // 2
        [51, 51, 52, 60, 51, 55, 65, 66, 53, 54], // 3
        [51, 51, 67, 51, 51, 49, 52, 49, 67, 52], // 4    1st Value (y)
        [51, 50, 52, 51, 67, 50, 52, 50, 51, 52], // 5
        [67, 49, 52, 49, 51, 64, 56, 51, 64, 56], // 6
        [60, 49, 58, 53, 53, 56, 51, 67, 52, 49], // 7
        [67, 50, 52, 50, 51, 51, 50, 64, 56, 51], // 8
        [61, 53, 56, 51, 51, 51, 60, 63, 60, 49]  // 9
    ],

    tileRules: [ 
    //              2nd Value (x)
    //   0  1  2  3  4  5  6  7  8  9 
        [0, 0, 1, 1, 1, 1, 4, 1, 1, 1], // 0
        [0, 0, 3, 1, 1, 0, 0, 0, 1, 1], // 1
        [1, 0, 3, 1, 1, 0, 1, 0, 0, 1], // 2
        [1, 1, 0, 1, 1, 0, 0, 0, 0, 0], // 3
        [1, 1, 0, 1, 1, 3, 3, 3, 3, 0], // 4    1st Value (y)
        [1, 0, 0, 1, 3, 3, 3, 3, 1, 0], // 5
        [3, 3, 3, 3, 1, 0, 0, 1, 0, 0], // 6
        [1, 0, 0, 0, 0, 0, 1, 3, 3, 3], // 7
        [3, 3, 3, 0, 1, 1, 0, 0, 0, 1], // 8
        [5, 0, 0, 1, 1, 1, 1, 2, 1, 0]  // 9
    ],

    startTileX: 0, //Sets X tile to start player on
    startTileY: 0  //Sets Y tile to start player on
}

let level4 = {

    graphicsMap: [ 
    //              2nd Value (x)
    //   0  1  2  3  4  5  6  7  8  9 
        [68, 68, 68, 68, 68, 68, 68, 68, 68, 68], // 0
        [68, 68, 68, 68, 68, 68, 68, 68, 68, 68], // 1
        [73, 73, 72, 73, 73, 73, 72, 73, 73, 73], // 2
        [71, 71, 71, 71, 71, 71, 71, 71, 71, 71], // 3
        [69, 69, 69, 69, 69, 69, 69, 69, 69, 74], // 4    1st Value (y)
        [69, 69, 69, 69, 69, 69, 69, 69, 69, 75], // 5
        [70, 70, 70, 70, 70, 70, 70, 70, 70, 70], // 6
        [73, 72, 73, 73, 73, 72, 73, 73, 73, 73], // 7
        [68, 68, 68, 68, 68, 68, 68, 68, 68, 68], // 8
        [68, 68, 68, 68, 68, 68, 68, 68, 68, 68]  // 9
    ],

    tileRules: [ 
    //              2nd Value (x)
    //   0  1  2  3  4  5  6  7  8  9 
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // 0
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // 1
        [0, 3, 3, 0, 0, 3, 3, 0, 0, 0], // 2
        [0, 3, 3, 0, 0, 3, 3, 0, 0, 0], // 3
        [0, 3, 3, 0, 0, 3, 3, 0, 0, 2], // 4    1st Value (y)
        [0, 3, 3, 0, 0, 3, 3, 0, 0, 1], // 5
        [0, 3, 3, 0, 0, 3, 3, 0, 0, 0], // 6
        [0, 3, 3, 0, 0, 3, 3, 0, 0, 0], // 7
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // 8
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]  // 9
    ],

    startTileX: 0, //Sets X tile to start player on
    startTileY: 5  //Sets Y tile to start player on
}

let level5 = {
    //End of the journey nothing to see here 
    graphicsMap: [ 
    //              2nd Value (x)
    //   0  1  2  3  4  5  6  7  8  9 
        [100, 100, 100, 100, 100, 100, 100, 100, 100, 100], // 0
        [100, 100, 100, 100, 100, 100, 100, 100, 100, 100], // 1
        [100, 100, 100, 100, 100, 100, 100, 100, 100, 100], // 2
        [100, 100, 100, 100, 100, 100, 100, 100, 100, 100], // 3
        [100, 100, 100, 100, 100, 100, 100, 100, 100, 100], // 4    1st Value (y)
        [100, 100, 100, 100, 100, 100, 100, 100, 100, 100], // 5
        [100, 100, 100, 100, 100, 100, 100, 100, 100, 100], // 6
        [100, 100, 100, 100, 100, 100, 100, 100, 100, 100], // 7
        [100, 100, 100, 100, 100, 100, 100, 100, 100, 100], // 8
        [100, 100, 100, 100, 100, 100, 100, 100, 100, 100]  // 9
    ],

    tileRules: [ 
    //              2nd Value (x)
    //   0  1  2  3  4  5  6  7  8  9 
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 0], // 0
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 0], // 1
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 2
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 3
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 4    1st Value (y)
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 5
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 6
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 7
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 8
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]  // 9
    ],

    startTileX: 100, //Sets X tile to start player on
    startTileY: 100  //Sets Y tile to start player on
}

//LEVEL CONTROL VARIABLES
let levels = [level0, level1, level2, level3, level4, level5];
let currentLevel = 0;
let graphicMap;
let tileRules;
let count;
let countMax = 10;

function preload() {
    GameFont = loadFont("Fonts/PixelOperator-Bold.ttf")
    Overlay = loadImage("Images/Overlay_Andrew_Magic.png")

    ///////////// Tilemap Asset preloading \\\\\\\\\\\\\
    //Level 1
    textures[0] = loadImage("Images/Level Map/Level 1/GrassVariation1.png"); //Grass Var1
    textures[1] = loadImage("Images/Level Map/Level 1/GrassVariation2.png"); //Grass Var2
    textures[2] = loadImage("Images/Level Map/Level 1/Vertical_DeadEnd.png"); //Vertical D-End
    textures[3] = loadImage("Images/Level Map/Level 1/Vertical_Path_Variation1.png"); //Vertical Var1
    textures[4] = loadImage("Images/Level Map/Level 1/Vertical_Path_Variation2.png"); //Vertical Var1
    textures[5] = loadImage("Images/Level Map/Level 1/Vertical_T-Junction.png"); //Vertical T-Junction
    textures[6] = loadImage("Images/Level Map/Level 1/Horizontal_Path_Variation1.png"); //Horizontal Var1
    textures[7] = loadImage("Images/Level Map/Level 1/Horizontal_Path_Variation2.png"); //Horizontal Var1
    textures[8] = loadImage("Images/Level Map/Level 1/Vertical_T-Junction_Alt.png") //Vertical T-Junction Alt
    textures[9] = loadImage("Images/Level Map/Level 1/Vertical_Right_Turn.png") //Vertical R-Turn
    textures[10] = loadImage("Images/Level Map/Level 1/Tree.png") //Tree
    textures[11] = loadImage("Images/Level Map/Level 1/Horizontal_DeadEnd_Variation1.png") //Horizontal D-End Var1
    textures[12] = loadImage("Images/Level Map/Level 1/Horizontal_DeadEnd_Variation2.png") //Horizontal D-End Var2
    textures[13] = loadImage("Images/Level Map/Level 1/Shop.png") //Shop
    textures[14] = loadImage("Images/Level Map/Level 1/Chest.png") //Chest
    textures[15] = loadImage("Images/Level Map/Level 1/Horizontal_Left_Turn.png") //Horizontal L-Turn
    textures[16] = loadImage("Images/Level Map/Level 1/BossPortal.png") //Horizontal L-Turn
    textures[17] = loadImage("Images/Level Map/Level 1/EnemyID1.png") //Enemy1
    textures[18] = loadImage("Images/Level Map/Level 1/EnemyID2.png") //Enemy2
    textures[19] = loadImage("Images/Level Map/Level 1/EnemyID3.png") //Enemy3

    //Level 2
    textures[20] = loadImage("Images/Level Map/Level 2/Swamp_Floor_Var1.PNG") //Swamp Var1
    textures[21] = loadImage("Images/Level Map/Level 2/Swamp_Floor_Var2.PNG") //Swamp Var2
    textures[22] = loadImage("Images/Level Map/Level 2/SmallWetland.PNG") //Small Wetland
    textures[23] = loadImage("Images/Level Map/Level 2/SwampTree.png") //Swampfire.... I mean a Swamp Tree
    textures[24] = loadImage("Images/Level Map/Level 2/Horizontal_D-END_Variation1.PNG") // Wetland Horizontal D-END Var left
    textures[25] = loadImage("Images/Level Map/Level 2/Horizontal_D-END_Variation2.PNG") // Wetland Horizontal D-END Var right
    textures[26] = loadImage("Images/Level Map/Level 2/Horizontal_Wetland.PNG") //Horizontal Wetland
    textures[27] = loadImage("Images/Level Map/Level 2/Vertical_Right_Turn_Wetland.PNG") // Vert R-Turn Wetland
    textures[28] = loadImage("Images/Level Map/Level 2/Vertical_D-END_Variation1.PNG") //Wetland Vert Dead end Var1
    textures[29] = loadImage("Images/Level Map/Level 2/Vertical_D-END_Variation2.PNG") //Wetland Vert Dead end Var2
    textures[30] = loadImage("Images/Level Map/Level 2/Horizontal_L-Turn.PNG")
    textures[31] = loadImage("Images/Level Map/Level 2/SwampEnemy.png") //Enemy
    textures[32] = loadImage("Images/Level Map/Level 2/Shop.png") //Shop
    textures[33] = loadImage("Images/Level Map/Level 2/Chest.png") //Chest
    textures[34] = loadImage("Images/Level Map/Level 2/Boss_Portal.png") //Boss Battle

    //Level 3
    textures[35] = loadImage("Images/Level Map/Level 3/Sand.PNG") //Sand
    textures[36] = loadImage("Images/Level Map/Level 3/Cactus.png") //Cactus
    textures[37] = loadImage("Images/Level Map/Level 3/Rock.PNG") //Rock
    textures[38] = loadImage("Images/Level Map/Level 3/EnemySnake.png") //Enemy snake
    textures[39] = loadImage("Images/Level Map/Level 3/Ground_Left_Pyramid.png") // GLP (The file name is self-explanitory)
    textures[40] = loadImage("Images/Level Map/Level 3/Ground_Middle_Pyramid.png") //GMP
    textures[41] = loadImage("Images/Level Map/Level 3/Ground_Right_Pyramid.png") //GRP
    textures[42] = loadImage("Images/Level Map/Level 3/Floor1_Left_Pyramid.png") //F1LP
    textures[43] = loadImage("Images/Level Map/Level 3/Floor1_Right_Pyramid.png") //F1RP
    textures[44] = loadImage("Images/Level Map/Level 3/Pyramid_Piece.PNG") // PP
    textures[45] = loadImage("Images/Level Map/Level 3/Pyramid_Top.png") // PT
    textures[46] = loadImage("Images/Level Map/Level 3/Shop.png") // Shop
    textures[47] = loadImage("Images/Level Map/Level 3/Chest.png") // Chest
    textures[48] = loadImage("Images/Level Map/Level 3/Boss_Portal.png") // Boss portal

    //Level 4
    textures[49] = loadImage("Images/Level Map/Level 4/Ice_Floor_Var1.PNG") // Ice floor var1
    textures[50] = loadImage("Images/Level Map/Level 4/Ice_Floor_Var2.PNG") // Ice floor var1
    textures[51] = loadImage("Images/Level Map/Level 4/Tree.png") //Tree
    textures[52] = loadImage("Images/Level Map/Level 4/Ice_Vertical.PNG") // Ice Vertical
    textures[53] = loadImage("Images/Level Map/Level 4/Ice_Horizontal.PNG") // Ice Horizontal
    textures[54] = loadImage("Images/Level Map/Level 4/Vertical_L_Turn.PNG") // Ice Vertical L Turn
    textures[55] = loadImage("Images/Level Map/Level 4/Vertical_R_Turn.PNG") // Ice Vertical R Turn
    textures[56] = loadImage("Images/Level Map/Level 4/Horizontal_L_Turn.png") // Ice Horizontal L Turn
    textures[57] = loadImage("Images/Level Map/Level 4/Horizontal_R_Turn.png") // Ice Horizontal R Turn
    textures[58] = loadImage("Images/Level Map/Level 4/Horizontal_T-Junction_Var1.PNG") // Ice Horizontal T-Junction var1
    textures[59] = loadImage("Images/Level Map/Level 4/Horizontal_T-Junction_Var2.PNG") /// Ice Horizontal T-Junction var2
    textures[60] = loadImage("Images/Level Map/Level 4/Ice_Mountain.png") //Ice mountains
    textures[61] = loadImage("Images/Level Map/Level 4/Chest.png") //Chest
    textures[62] = loadImage("Images/Level Map/Level 4/Shop.png") //Shop
    textures[63] = loadImage("Images/Level Map/Level 4/Boss_Portal.png") //Boss Portal
    textures[64] = loadImage("Images/Level Map/Level 4/Alt_Turn.png") //Another turn
    textures[65] = loadImage("Images/Level Map/Level 4/Vertical_T-Junction_Var1.PNG") // Ice Vertical T-Junction var1
    textures[66] = loadImage("Images/Level Map/Level 4/Vertical_T-Junction_Var2.PNG") /// Ice Vertical T-Junction var2
    textures[67] = loadImage("Images/Level Map/Level 4/Ice_Enemy.png") /// Ice Enemy

    //Level 5
    textures[68] = loadImage("Images/Level Map/Level 5/Brick_Wall.PNG") //Brick Wall
    textures[69] = loadImage("Images/Level Map/Level 5/Carpet_Middle.PNG") //Carpet Middle
    textures[70] = loadImage("Images/Level Map/Level 5/Carpet_Bottom.PNG") //Carpet Bottom
    textures[71] = loadImage("Images/Level Map/Level 5/Carpet_Top.PNG") //Carpet Top
    textures[72] = loadImage("Images/Level Map/Level 5/Cursed_Knight.PNG") //Enemy
    textures[73] = loadImage("Images/Level Map/Level 5/Floor.PNG") //floor
    textures[74] = loadImage("Images/Level Map/Level 5/Final_Boss.PNG") // Final Boss
    textures[75] = loadImage("Images/Level Map/Level 5/Brother.PNG") // Brother

    // Void
    textures[100] = loadImage("void_50x.png") //Void
    
    //Player Overworld
    playerSprite = loadImage("Images/Level Map/Player.png");

    ///////////// Can't Escape, Fight! \\\\\\\\\\\\\
  
    //Hero Sprites 
    H_B_Sprite = loadImage("Images/Battle/Battle Anims/Heroine.gif") //Hero
  
    // Enemy Sprites
    E_B_Sprite[0] = loadImage("Images/Battle/Battle Anims/Skeleton.gif") // Skelaton Image
    E_B_Sprite[1] = loadImage("Images/Battle/Battle Anims/Slime.gif") // Slime Image
    E_B_Sprite[2] = loadImage("Images/Battle/Battle Anims/Snake.gif") // Snake Image
    E_B_Sprite[3] = loadImage("Images/Battle/Battle Anims/Ice_Spirit.gif") // Ice Spirit Image
    E_B_Sprite[4] = loadImage("Images/Battle/Battle Anims/Posessed-knight.gif") // Chad knight Image
    E_B_Sprite[5] = loadImage("Images/Battle/Battle Anims/Wizard.gif") // Wizard Image
    
    // Battle Effects
    fx_B_Sprite[0] = loadImage("Images/Battle/Battle Anims/Knight_Slash.gif") //H slash
    fx_B_Sprite[1] = loadImage("Images/Battle/Battle Anims/Enemy_Slash.gif") // E Slash
  
    //Battle Backgrounds
    B_Background[0] = loadImage("Images/Battle/Background/Forest_Background.png")
    B_Background[1] = loadImage("Images/Battle/Background/Swamp_Background.png")
    B_Background[2] = loadImage("Images/Battle/Background/Desert_Background.png")
    B_Background[3] = loadImage("Images/Battle/Background/Frost_Background.png")
    B_Background[4] = loadImage("Images/Battle/Background/Castle_Background.png")
    B_Background[5] = loadImage("Images/Battle/Background/Castle_Background.png")
  
    //GUI Elements
    Gui_Elements[0] = loadImage("Images/Battle/GUI/Frame.png") //Frame
    Gui_Elements[1] = loadImage("Images/Battle/GUI/HP_Defence_Container.png") // HP/Defence Container
    Gui_Elements[2] = loadImage("Images/Battle/GUI/Attack_Hover.png") // A hover
    Gui_Elements[3] = loadImage("Images/Battle/GUI/Defend_Hover.png") //D Hover

    CC_Asset[0] = loadImage("Images/Cutscene/Dialogue box.png") //Dialogue box
    CC_Asset[1] = loadImage("Images/Cutscene/Knight_Cutscene.png") //Knight
    CC_Asset[2] = loadImage("Images/Cutscene/Skeleton_Cutscene.png") //Skeleton
    CC_Asset[3] = loadImage("Images/Cutscene/Slime Cutscene.png") //Slime
    CC_Asset[6] = loadImage("Images/Cutscene/Posessed_Knight.png") //Posessed Knight
    CC_Asset[7] = loadImage("Images/Cutscene/Wizard.png") //Mainyu

    //Shop
    textures[578] = loadImage("Images/Shop/Shop_Image_LOL.png") //I REFUSE TO EXPLAIN
}

function setup() {
    createCanvas(500, 500);
    textFont(GameFont)

    frameRate(60)
    //Create Player
    player = new Player(playerSprite,6, 8, tileSize, tileRules);

    //Load Graphic Data
    loadLevel();
    
    fx_B_Sprite[0].setFrame(0)
    fx_B_Sprite[1].setFrame(0)
}

function loadLevel() {
    //Load Graphics Data
    graphicsMap = levels[currentLevel].graphicsMap;
    tileRules = levels[currentLevel].tileRules;

    let tileID = 0; //Sets ID for each tile

    //Tile Creation Starts
    for (let tileX = 0; tileX < tilesX; tileX++) {
        tileMap[tileX] = [];
        for (let tileY = 0; tileY < tilesY; tileY++) {

            let texture = graphicsMap[tileY][tileX]; //sets texture value to pass from array
            tileMap[tileX][tileY] = new Tile(textures[texture], tileX, tileY, tileSize, tileID); //TILE CREATION

            tileID++;
        }
    }
    //Tile Creation Finished
}

function draw() {
    //Overlay / run for all
    textFont(GameFont)
    image(Overlay,0,0)

    frameRate(60)
    if (ScreenHandler == 0) {
        cutscene()
    } else if (ScreenHandler == 1) {
        AdventureMap()
    } else if (ScreenHandler == 2) {
        BattleMode()
    } else if (ScreenHandler == 3) {
        WL_SCREEN()
    }else if (ScreenHandler == 4) {
        shop()
    }

    image(Overlay,0,0)
}

function AdventureMap() {
    frameRate(30)
    background(0)
    for (let tileX = 0; tileX < tilesX; tileX++) {
        for (let tileY = 0; tileY < tilesY; tileY++) {
            tileMap[tileX][tileY].display();
            //tileMap[tileX][tileY].debugGrid();
        }
    }

    if (player.transition) { 
        //CALLED ONCE PER FRAME: first checks if count is equal to countMax.
        //If it is, it sets player.transition to false
        //Otherwise, it simply adds 1 to count! This repeats until count is same as countMax!
        if (count === countMax) player.transition = false; 
        else count++;                          
    }

    player.display();
    player.setDirection();
    player.move();
}

class Player{
    constructor(sprite, startX, startY, tileSize, tileRules) {
        //PLAYER SPRITES
        this.sprite = sprite;

        //TILE POSITION DATA
        this.tileX = startX,
        this.tileY = startY,

        //PIXEL POSITION DATA
        this.xPos = startX * tileSize;
        this.yPos = startY * tileSize;

        //DIRECTION PLAYER WANTS TO MOVE
        this.dirX = 0;
        this.dirY = 0;

        //PLAYER'S TARGET PIXEL POSITION
        this.tx = this.xPos;
        this.ty = this.yPos;
        
        //MOVEMENT
        this.isMoving = false;
        this.transition = false;
        this.speed = 2;

        //TILE DATA
        this.tileSize = tileSize;
        this.tileRules = tileRules;
        this.transition = false
    }

    display() {
        image(this.sprite, this.xPos, this.yPos, this.tileSize, this.tileSize)
    }

    setDirection() {
        //Variables for the keycode for keyIsDown
        let up = 87;        //w
        let down = 83       //s
        let left = 65;      //a
        let right = 68;     //d

        if (!this.isMoving && CanMove == true) { //CHECK IF PLAYER IS CURRENT MOVING, IF NOT, RUN THE CODE BELOW:

            if (keyIsDown(up) || keyIsDown(UP_ARROW)) {
                this.dirX = 0;
                this.dirY = -1;
            }

            if (keyIsDown(down) || keyIsDown(DOWN_ARROW)) {
                this.dirX = 0;
                this.dirY = 1;
            }

            if (keyIsDown(left) || keyIsDown(LEFT_ARROW)) {
                this.dirX = -1;
                this.dirY = 0;
            }

            if (keyIsDown(right) || keyIsDown(RIGHT_ARROW)) {
                this.dirX = 1;
                this.dirY = 0;
            }

            this.checkTargetTile()
            
        }
    }

    checkTargetTile() {
        if (this.transition) {
            this.dirX = 0;
            this.dirY = 0;
        }

        //Calculate tile position of currentTile
        this.tileX = Math.floor(this.xPos / this.tileSize);
        this.tileY = Math.floor(this.yPos / this.tileSize);

        //Calculate tile coordinates of next Tile;
        let nextTileX = this.tileX + this.dirX;
        let nextTileY = this.tileY + this.dirY;

        //Check if nextTileX and nextTileY are both inbounds
        //Remember && means AND (i.e. if ALL conditions are true)
        if (nextTileX >= 0 &&       //left side of map
            nextTileX < tilesX &&   //right side of map
            nextTileY >= 0 &&       //top of map
            nextTileY < tilesY) {  //bottom of map 

            if (tileRules[nextTileY][nextTileX] === 2) { //Check for Transition Tile
                //Resets both handlers
                enemyWatcher = [false,false,false,false,false,false]
                ShopChestHandler = [false,false]
                console.log(enemyWatcher[1])
                currentLevel++;

                if (currentLevel == 0 ||currentLevel ==  1 ||currentLevel ==  3 ||currentLevel ==  4 || currentLevel == 5){
                    ScreenHandler = 0
                }
                

                if (currentLevel >= levels.length) {
                    currentLevel = 0; //Checks if currentLevel is out of range, if so, sets to 0
                }      
                loadLevel(); //Loads the next level in our levels array
                
                //Set Player Start Position
                this.setPlayerPosition();
                count = 0;
                this.transition = true;
            } else if (tileRules[nextTileY][nextTileX] === 4){
                ScreenHandler = 4
                if (currentLevel == 0) {
                    levels[currentLevel].tileRules[4][0] = 0
                } else if (currentLevel == 1) {
                    levels[currentLevel].tileRules[1][3] = 0
                } else if (currentLevel == 2) {
                    levels[currentLevel].tileRules[0][2] = 0
                } else if (currentLevel == 3) {
                    levels[currentLevel].tileRules[0][6] = 0
                }



            } else if (tileRules[nextTileY][nextTileX] === 5){
                if (currentLevel == 0) {
                    levels[currentLevel].tileRules[0][6] = 0
                } else if (currentLevel == 1) {
                    levels[currentLevel].tileRules[8][0] = 0
                } else if (currentLevel == 2) {
                    levels[currentLevel].tileRules[0][2] = 0
                } else if (currentLevel == 3) {
                    levels[currentLevel].tileRules[9][0] = 0
                }
                PlayerStats[2] = PlayerStats[2] + 100
            }

                
            //Check if next tile is NOT walkable
            else if (tileRules[nextTileY][nextTileX] != 1) { //!= means IS NOT
                if (currentLevel == 0) {
                    //Enemy1
                    if (this.tileX >= 4 && this.tileX < 6 && this.tileY == 7 && enemyWatcher[0] == false) {
                        //Initiate battle when within enemy detection zone
                        CanMove = false
                        ScreenHandler = 2

                        //Changes Tile images + TileRule to prevent continuous activation
                        enemyWatcher[0] = true
                        levels[currentLevel].tileRules[7][5] = 0
                        levels[currentLevel].tileRules[7][6] = 0
                        levels[currentLevel].tileRules[7][7] = 0
                        levels[currentLevel].tileRules[7][8] = 0
                        levels[currentLevel].tileRules[7][9] = 0
                        levels[currentLevel].graphicsMap[7][9] = 1
                        console.log("Enemy 1 deleted")

                        //Checks if enemy2 has been defeated to prevent an additional battle
                        if (enemyWatcher[1] == true) {
                            levels[currentLevel].tileRules[7][4] = 0 
                        }
                        loadLevel()

                    }
                    
                    //Enemy2
                    else if (this.tileX > 3 && this.tileX < 5 && this.tileY <= 9 && this.tileY >= 0 && enemyWatcher[1] == false) {
                        //Initiate battle when within enemy detection zone
                        CanMove = false
                        ScreenHandler = 2

                        //Changes Tile images + TileRule to prevent continuous activation
                        enemyWatcher[1] = true
                        levels[0].tileRules[0][4] = 0
                        levels[0].tileRules[1][4] = 0
                        levels[0].tileRules[2][4] = 0
                        levels[0].tileRules[4][4] = 0
                        levels[0].tileRules[5][4] = 0
                        levels[0].tileRules[6][4] = 0
                        levels[0].tileRules[8][4] = 0
                        levels[0].tileRules[9][4] = 0
                        levels[0].graphicsMap[0][4] = 6
                        console.log("Enemy 2 deleted")

                        //Checks if enemy1 has been defeated to prevent an additional battle
                        if (enemyWatcher[0] == true) {
                            levels[0].tileRules[7][4] = 0 
                        }

                        //Checks if enemy3 has been defeated to prevent an additional battle
                        else if (enemyWatcher[2] == true) {
                            levels[0].tileRules[3][4] = 0 
                        }
                        loadLevel()

                    }

                    //Enemy3
                    else if (this.tileX >= 0 && this.tileX <= 9 && this.tileY == 3 && enemyWatcher[2] == false) {
                        //Initiate battle when within enemy detection zone
                        CanMove = false
                        ScreenHandler = 2

                        //Changes Tile images + TileRule to prevent continuous activation
                        enemyWatcher[2] = true
                        levels[0].tileRules[0][4] = 0
                        levels[0].tileRules[1][4] = 0
                        levels[0].tileRules[2][4] = 0
                        levels[0].tileRules[4][4] = 0
                        levels[0].tileRules[5][4] = 0
                        levels[0].tileRules[6][4] = 0
                        levels[0].tileRules[8][4] = 0
                        levels[0].tileRules[9][4] = 0
                        levels[0].graphicsMap[3][0] = 1
                        console.log("Enemy 3 deleted")

                        //Checks if enemy2 has been defeated to prevent an additional battle
                        if (enemyWatcher[1] == true) {
                            levels[0].tileRules[3][4] = 0 
                        }
                        loadLevel()

                    }
                }

                else if (currentLevel == 1) {
                    //Enemy1
                    if (this.tileX >= 0 && this.tileX <= 2 && this.tileY == 3 && enemyWatcher[0] == false) {
                        //Initiate battle when within enemy detection zone
                        CanMove = false
                        ScreenHandler = 2

                        //Changes Tile images + TileRule to prevent continuous activation
                        enemyWatcher[0] = true
                        levels[currentLevel].tileRules[3][0] = 0
                        levels[currentLevel].tileRules[3][1] = 0
                        levels[currentLevel].tileRules[3][2] = 0
                        levels[currentLevel].graphicsMap[3][2] = 20
                        console.log("Enemy 1 deleted")
                        loadLevel()

                    }
                    
                    //Enemy2
                    else if (this.tileX >= 1 && this.tileX <= 3 && this.tileY == 8 && enemyWatcher[1] == false) {
                        //Initiate battle when within enemy detection zone
                        CanMove = false
                        ScreenHandler = 2

                        //Changes Tile images + TileRule to prevent continuous activation
                        enemyWatcher[1] = true
                        levels[currentLevel].tileRules[8][1] = 0
                        levels[currentLevel].tileRules[8][2] = 0
                        levels[currentLevel].tileRules[8][3] = 0
                        levels[currentLevel].graphicsMap[8][1] = 20
                        console.log("Enemy 2 deleted")
                        loadLevel()

                    }

                    //Enemy3
                    else if (this.tileX >= 4 && this.tileX <= 8 && this.tileY == 3 && enemyWatcher[2] == false) {
                        //Initiate battle when within enemy detection zone
                        CanMove = false
                        ScreenHandler = 2

                        //Changes Tile images + TileRule to prevent continuous activation
                        enemyWatcher[2] = true
                        levels[currentLevel].tileRules[3][5] = 0
                        levels[currentLevel].tileRules[3][6] = 0
                        levels[currentLevel].tileRules[3][7] = 0
                        levels[currentLevel].tileRules[3][8] = 0
                        levels[currentLevel].graphicsMap[3][8] = 20
                        console.log("Enemy 3 deleted")
                        loadLevel()

                    }

                    //Enemy4
                    else if (this.tileX >= 7 && this.tileX <= 9 && this.tileY == 8 && enemyWatcher[3] == false) {
                        //Initiate battle when within enemy detection zone
                        CanMove = false
                        ScreenHandler = 2

                        //Changes Tile images + TileRule to prevent continuous activation
                        enemyWatcher[3] = true
                        levels[currentLevel].tileRules[8][7] = 0
                        levels[currentLevel].tileRules[8][8] = 0
                        levels[currentLevel].tileRules[8][9] = 0
                        levels[currentLevel].graphicsMap[8][7] = 20
                        console.log("Enemy 4 deleted")
                        loadLevel()

                    }
                }

                else if (currentLevel == 2) {
                    //Enemy1
                    if (this.tileX >= 5 && this.tileX <= 9 && this.tileY == 2 && enemyWatcher[0] == false || this.tileX == 7 && this.tileY >= 0 && this.tileY <= 2 && enemyWatcher[0] == false) {
                        //Initiate battle when within enemy detection zone
                        CanMove = false
                        ScreenHandler = 2

                        //Changes Tile images + TileRule to prevent continuous activation
                        enemyWatcher[0] = true
                        levels[currentLevel].tileRules[0][7] = 0
                        levels[currentLevel].tileRules[1][7] = 0
                        levels[currentLevel].tileRules[2][7] = 0
                        levels[currentLevel].tileRules[2][9] = 0
                        levels[currentLevel].tileRules[2][8] = 0
                        levels[currentLevel].tileRules[2][7] = 0
                        levels[currentLevel].tileRules[2][5] = 0
                        levels[currentLevel].graphicsMap[2][7] = 35
                        console.log("Enemy 1 deleted")

                        //Checks if enemy2 has been defeated to prevent an additional battle
                        if (enemyWatcher[1] == true) {
                            levels[currentLevel].tileRules[2][6] = 0 
                        }
                        loadLevel()

                    }
                    
                    //Enemy2
                    else if (this.tileX == 6 && this.tileY >= 0 && this.tileY <= 4 && enemyWatcher[1] == false) {
                        //Initiate battle when within enemy detection zone
                        CanMove = false
                        ScreenHandler = 2

                        //Changes Tile images + TileRule to prevent continuous activation
                        enemyWatcher[1] = true
                        levels[currentLevel].tileRules[0][6] = 0
                        levels[currentLevel].tileRules[1][6] = 0
                        levels[currentLevel].tileRules[3][6] = 0
                        levels[currentLevel].tileRules[4][6] = 0
                        levels[currentLevel].graphicsMap[3][6] = 35
                        console.log("Enemy 2 deleted")

                        if (enemyWatcher[0] == true) {
                            levels[currentLevel].tileRules[2][6] = 0 
                        }
                        loadLevel()

                    }

                    //Enemy3
                    else if (this.tileX == 3 && this.tileY == 1 && enemyWatcher[2] == false) {
                        //Initiate battle when within enemy detection zone
                        CanMove = false
                        ScreenHandler = 2

                        //Changes Tile images + TileRule to prevent continuous activation
                        enemyWatcher[2] = true
                        levels[currentLevel].tileRules[1][3] = 0
                        levels[currentLevel].tileRules[2][3] = 0
                        levels[currentLevel].graphicsMap[2][3] = 35
                        console.log("Enemy 3 deleted")
                        loadLevel()

                    }

                    //Enemy4
                    else if (this.tileX >= 0 && this.tileX <= 4 && this.tileY == 5 && enemyWatcher[3] == false) {
                        //Initiate battle when within enemy detection zone
                        CanMove = false
                        ScreenHandler = 2

                        //Changes Tile images + TileRule to prevent continuous activation
                        enemyWatcher[3] = true
                        levels[currentLevel].tileRules[5][0] = 0
                        levels[currentLevel].tileRules[5][1] = 0
                        levels[currentLevel].tileRules[5][2] = 0
                        levels[currentLevel].tileRules[5][3] = 0
                        levels[currentLevel].tileRules[5][4] = 0
                        levels[currentLevel].graphicsMap[5][4] = 35
                        console.log("Enemy 4 deleted")
                        loadLevel()

                    }

                    //Enemy5
                    else if (this.tileX >= 3 && this.tileX <= 6 && this.tileY == 7 && enemyWatcher[4] == false) {
                        //Initiate battle when within enemy detection zone
                        CanMove = false
                        ScreenHandler = 2
                        
                        //Changes Tile images + TileRule to prevent continuous activation
                        enemyWatcher[4] = true
                        levels[currentLevel].tileRules[7][3] = 0
                        levels[currentLevel].tileRules[7][4] = 0
                        levels[currentLevel].tileRules[7][5] = 0
                        levels[currentLevel].tileRules[7][6] = 0
                        levels[currentLevel].graphicsMap[7][6] = 35
                        console.log("Enemy 5 deleted")
                        loadLevel()

                    }

                    //Enemy6
                    else if (this.tileX >= 3 && this.tileX <= 6 && this.tileY == 9 && enemyWatcher[5] == false) {
                        //Initiate battle when within enemy detection zone
                        CanMove = false
                        ScreenHandler = 2

                        //Changes Tile images + TileRule to prevent continuous activation
                        enemyWatcher[5] = true
                        levels[currentLevel].tileRules[9][3] = 0
                        levels[currentLevel].tileRules[9][4] = 0
                        levels[currentLevel].tileRules[9][5] = 0
                        levels[currentLevel].tileRules[9][6] = 0
                        levels[currentLevel].graphicsMap[9][6] = 35
                        console.log("Enemy 5 deleted")
                        loadLevel()

                    }
                }
                
                else if (currentLevel == 3) {
                    //Enemy1
                    if (this.tileX == 2 && this.tileY >= 1 && this.tileY <= 2 && enemyWatcher[0] == false) {
                        //Initiate battle when within enemy detection zone
                        CanMove = false
                        ScreenHandler = 2

                        //Changes Tile images + TileRule to prevent continuous activation
                        enemyWatcher[0] = true
                        levels[currentLevel].tileRules[2][2] = 0
                        levels[currentLevel].tileRules[1][2] = 0

                        levels[currentLevel].graphicsMap[4][2] = 52
                        console.log("Enemy 1 deleted")
                        loadLevel()

                    }
                    
                    //Enemy2
                    else if (this.tileY == 6 && this.tileX >= 1 && this.tileX <= 2 && enemyWatcher[1] == false) {
                        //Initiate battle when within enemy detection zone
                        CanMove = false
                        ScreenHandler = 2

                        //Changes Tile images + TileRule to prevent continuous activation
                        enemyWatcher[1] = true
                        levels[currentLevel].tileRules[6][0] = 0
                        levels[currentLevel].tileRules[6][1] = 0
                        levels[currentLevel].tileRules[6][2] = 0
                        levels[currentLevel].tileRules[6][3] = 0
                        levels[currentLevel].graphicsMap[6][0] = 50
                        console.log("Enemy 2 deleted")

                        loadLevel()

                    }

                    //Enemy3
                    else if (this.tileX >= 1 && this.tileX <= 3 && this.tileY == 8 && enemyWatcher[2] == false) {
                        //Initiate battle when within enemy detection zone
                        CanMove = false
                        ScreenHandler = 2

                        //Changes Tile images + TileRule to prevent continuous activation
                        enemyWatcher[2] = true
                        levels[currentLevel].tileRules[8][3] = 0
                        levels[currentLevel].tileRules[8][2] = 0
                        levels[currentLevel].tileRules[8][1] = 0
                        levels[currentLevel].graphicsMap[8][0] = 49
                        console.log("Enemy 3 deleted")
                        loadLevel()

                    }

                    //Enemy4
                    else if (this.tileX >= 5 && this.tileX <= 7 && this.tileY == 5 && enemyWatcher[3] == false) {
                        //Initiate battle when within enemy detection zone
                        CanMove = false
                        ScreenHandler = 2

                        //Changes Tile images + TileRule to prevent continuous activation
                        enemyWatcher[3] = true
                        levels[currentLevel].tileRules[5][4] = 0
                        levels[currentLevel].tileRules[5][5] = 0
                        levels[currentLevel].tileRules[5][6] = 0
                        levels[currentLevel].tileRules[5][7] = 0
                        levels[currentLevel].graphicsMap[5][4] = 50
                        console.log("Enemy 4 deleted")
                        loadLevel()

                    }

                    //Enemy5
                    else if (this.tileX >= 5 && this.tileX <= 7 && this.tileY == 4 && enemyWatcher[4] == false) {
                        //Initiate battle when within enemy detection zone
                        CanMove = false
                        ScreenHandler = 2

                        //Changes Tile images + TileRule to prevent continuous activation
                        enemyWatcher[4] = true
                        levels[currentLevel].tileRules[4][8] = 0
                        levels[currentLevel].tileRules[4][5] = 0
                        levels[currentLevel].tileRules[4][6] = 0
                        levels[currentLevel].tileRules[4][7] = 0
                        levels[currentLevel].graphicsMap[4][8] = 49
                        console.log("Enemy 5 deleted")
                        loadLevel()

                    }

                    //Enemy6
                    else if (this.tileX >= 8 && this.tileX <= 9 && this.tileY == 7 && enemyWatcher[5] == false) {
                        //Initiate battle when within enemy detection zone
                        CanMove = false
                        ScreenHandler = 2

                        //Changes Tile images + TileRule to prevent continuous activation
                        enemyWatcher[5] = true
                        levels[currentLevel].tileRules[7][8] = 0
                        levels[currentLevel].tileRules[7][9] = 0
                        levels[currentLevel].tileRules[7][7] = 0
                        levels[currentLevel].graphicsMap[7][7] = 50
                        console.log("Enemy 5 deleted")
                        loadLevel()

                    }
                }

                else if (currentLevel == 4) {
                    //Enemy1
                    if (this.tileX == 1 && this.tileY >= 2 && this.tileY <= 7 && enemyWatcher[0] == false) {
                        //Initiate battle when within enemy detection zone
                        CanMove = false
                        ScreenHandler = 2

                        //Changes Tile images + TileRule to prevent continuous activation
                        enemyWatcher[0] = true
                        levels[currentLevel].tileRules[7][1] = 0
                        levels[currentLevel].tileRules[6][1] = 0
                        levels[currentLevel].tileRules[5][1] = 0
                        levels[currentLevel].tileRules[4][1] = 0
                        levels[currentLevel].tileRules[3][1] = 0
                        levels[currentLevel].tileRules[2][1] = 0
                        levels[currentLevel].graphicsMap[7][1] = 73
                        console.log("Enemy 1 deleted")
                        loadLevel()

                    }
                    
                    //Enemy2
                    else if (this.tileX == 2 && this.tileY >= 2 && this.tileY <= 7 && enemyWatcher[1] == false) {
                        //Initiate battle when within enemy detection zone
                        CanMove = false
                        ScreenHandler = 2

                        //Changes Tile images + TileRule to prevent continuous activation
                        enemyWatcher[1] = true
                        levels[currentLevel].tileRules[7][2] = 0
                        levels[currentLevel].tileRules[6][2] = 0
                        levels[currentLevel].tileRules[5][2] = 0
                        levels[currentLevel].tileRules[4][2] = 0
                        levels[currentLevel].tileRules[3][2] = 0
                        levels[currentLevel].tileRules[2][2] = 0
                        levels[currentLevel].graphicsMap[2][2] = 73
                        console.log("Enemy 2 deleted")

                        loadLevel()

                    }

                    //Enemy3
                    else if (this.tileX == 5 && this.tileY >= 2 && this.tileY <= 7 && enemyWatcher[2] == false) {
                        //Initiate battle when within enemy detection zone
                        CanMove = false
                        ScreenHandler = 2


                        //Changes Tile images + TileRule to prevent continuous activation
                        enemyWatcher[2] = true
                        levels[currentLevel].tileRules[7][5] = 0
                        levels[currentLevel].tileRules[6][5] = 0
                        levels[currentLevel].tileRules[5][5] = 0
                        levels[currentLevel].tileRules[4][5] = 0
                        levels[currentLevel].tileRules[3][5] = 0
                        levels[currentLevel].tileRules[2][5] = 0
                        levels[currentLevel].graphicsMap[7][5] = 73
                        console.log("Enemy 3 deleted")
                        loadLevel()

                    }

                    //Enemy4
                    else if (this.tileX == 6 && this.tileY >= 2 && this.tileY <= 7 && enemyWatcher[3] == false) {
                        //Initiate battle when within enemy detection zone
                        CanMove = false
                        ScreenHandler = 2

                        //Changes Tile images + TileRule to prevent continuous activation
                        enemyWatcher[3] = true
                        levels[currentLevel].tileRules[7][6] = 0
                        levels[currentLevel].tileRules[6][6] = 0
                        levels[currentLevel].tileRules[5][6] = 0
                        levels[currentLevel].tileRules[4][6] = 0
                        levels[currentLevel].tileRules[3][6] = 0
                        levels[currentLevel].tileRules[2][6] = 0
                        levels[currentLevel].graphicsMap[2][6] = 73
                        console.log("Enemy 4 deleted")
                        loadLevel()

                    }

                }

                console.log(levels[0].tileRules[this.tileY][this.tileX])
                console.log(this.tileX, this.tileY)

                //If walkable, set tx and ty (pixel postiions)
                this.tx = nextTileX * tileSize;
                this.ty = nextTileY * tileSize;

                //set this.isMoving to true to start Movement
                this.isMoving = true;
            }
        }
    }

    move() {
        //This is in our draw loop, so called move() is called every frame BUT...
        if (this.isMoving) {
            //this code block will only activate when this.isMoving = true. Otherwise, nothing happens.
            //So first, start by moving in direction set by setDirection()
            this.xPos += this.speed * this.dirX;
            this.yPos += this.speed * this.dirY;

            //Now check if player has reached targetX
            if (this.xPos === this.tx && this.yPos === this.ty) {
                //if there, stop moving and reset our variables
                this.isMoving = false;
                this.dirX = 0;
                this.dirY = 0;
            }
        }
    }

    setPlayerPosition() {
        this.tileX = levels[currentLevel].startTileX;
        this.tileY = levels[currentLevel].startTileY;
        this.xPos = levels[currentLevel].startTileX * tileSize;
        this.yPos = levels[currentLevel].startTileY * tileSize;
    }
} //End of Player Class

class Tile{
    constructor(texture, tileX, tileY, tileSize, tileID) {
        //YOU SHOULD ADD COMMENTS EXPLAINING WHAT THESE VARIABLES MEAN
        this.texture = texture;
        this.tileX = tileX;
        this.tileY = tileY;
        this.xPos = tileX * tileSize;
        this.yPos = tileY * tileSize;
        this.tileSize = tileSize;
        this.tileID = tileID;
    }
    display() {
        image(this.texture, this.xPos, this.yPos, this.tileSize, this.tileSize)
    }
    debugGrid() {

        let xPadding = 2; //pads text so it displays within the box (x axis)
        let yCoordinatePadding = 8; //pads coordinate text so it display within the box (y axis) but above ID text
        let yIDPadding = 18; //pads ID text so it displays within the box (y axis) and below the coordinate text
        
        //All Text Settings
        strokeWeight(1)
        stroke("black")
        fill("yellow")

        //Display X and Y coordinate Text
        textSize(8)
        text("X: " + this.tileX + ", Y: " + this.tileY, this.xPos + xPadding, this.yPos + yCoordinatePadding)

        //Display tileID text
        textSize(10)
        text("ID: " + this.tileID, this.xPos + xPadding, this.yPos + yIDPadding)

        //Create rect around tile
        noFill();
        stroke('yellow');
        rect(this.xPos, this.yPos, this.tileSize, this.tileSize);
    }
    displayMessage() {
        let xPadding = 2;
        let yPadding = 40;

        strokeWeight(1)
        stroke("black")
        fill("white")
        textSize(10)
        text("Accessed!", this.xPos + xPadding, this.yPos + yPadding)
    }
}


function BattleMode() {
  textSize(20)
  frameRate(8)
  //Initialising enemyStats
  if (config == false && ScreenHandler == 2) {
    if (currentLevel == 0) {
      //Skeleton stats loading
      EnemyStats[0] = 25
      MaxEnemyHP = 25
      EnemyStats[1] = 5
    } else if (currentLevel == 1) {
      //Slime stats loading
      EnemyStats[0] = 50
      MaxEnemyHP = 50
      EnemyStats[1] = 5
      PlayerStats[1] = 5
    } else if (currentLevel == 2) {
      //Snake stats loading
      EnemyStats[0] = 150
      MaxEnemyHP = 150
      EnemyStats[1] = 10
      PlayerStats[1] = 10
    } else if (currentLevel == 3) {
      //Ice Spirit stats loading
      EnemyStats[0] = 300
      MaxEnemyHP = 300
      EnemyStats[1] = 25
      PlayerStats[1] = 20
    } else if (currentLevel == 4) {
        //CHAD KNIGHT loading
        EnemyStats[0] = 500
        MaxEnemyHP = 500
        EnemyStats[1] = 10
        PlayerStats[1] = 50
    } else if (currentLevel == 5) {
          //Maingra
          EnemyStats[0] = 1000
          MaxEnemyHP = 1000
          EnemyStats[1] = 15
          PlayerStats[1] = 75
    }      
    config = true
  }

  //Checks if battle ended  
  if (EnemyStats[0] <= 0) {
    if (currentLevel == 5) {
      ScreenHandler = 0
      LB_Checker = true
      WL_State == true
    } else {
      PlayerStats[1] = 0
      PlayerStats[2] = PlayerStats[2] + (5*(currentLevel+1))
      ScreenHandler = 1
      CanMove = true
      config = false
    }
  } else if (PlayerStats[0] <= 0) {
    ScreenHandler = 3
  }


  //Characters + Background
  image(B_Background[currentLevel],0,0)
  image(E_B_Sprite[currentLevel],0,0)

  image(H_B_Sprite,0,0)
  
  //Gui
  image(Gui_Elements[0],0,0)
  image(Gui_Elements[1],8,50)
  image(Gui_Elements[1],8,90)
  image(Gui_Elements[1],338,50)

  fill(150,0,0)
  noStroke()
  rect(340,52,151*(EnemyStats[0]/MaxEnemyHP),9)
  fill(50,100,250)
  if (PlayerStats[1] <= 100) {
    rect(10,92,151*(PlayerStats[1]/100),9)
  } else {
    rect(10,92,151,9)
  }
  

  if (PlayerStats[0] <= 100) {
    fill(150,0,0)
    rect(10,52,151*(PlayerStats[0]/100),9)
  } else {
    fill(150,150,0)
    rect(10,52,151,9)
  }


  if (mouseX >= 170 && mouseX <= 330 && mouseY >= 64 && mouseY <= 108) {
    image(Gui_Elements[3],170,64)
  } else if (mouseX >= 170 && mouseX <= 330 && mouseY >= 5 && mouseY <= 59) {
    image(Gui_Elements[2],170,5)
  }


  //Text
  fill(0) //Hero HP Text
  text("HP",11,47)
  fill(255)
  text("HP",10,46)

  fill(0) //Enemy HP Text
  text("HP",341,47)
  fill(255)
  text("HP",340,46)

  fill(0) //Hero DEF Text
  text("DEF",11,87)
  fill(255)
  text("DEF",10,86)

  fill(0)
  text("Knight",11,21)
  fill(255)
  text("Knight",10,20)
    fill(0)
    text(Enemy_Names[currentLevel],341,21)
    fill(255)
    text(Enemy_Names[currentLevel],340,20)

  textSize(40)
  fill(0)
  text("ATTACK",192,42)
  text("DEFEND",192,97)
  fill(255)
  text("ATTACK",190,40)
  text("DEFEND",190,95)
  
  image(Overlay, 0,0)
  AnimDamageHandler()

  
}

function wait(time) {
  //time = number of frames to wait
  if (TimerInitiated == false) {
    currentTime = frameCount
    EndTime = currentTime + time
  }
  console.log(currentTime)
  currentTime = frameCount
  TimerInitiated = true

  if (currentTime == EndTime) {
    TimerFinished = true
    TimerInitiated = false
    
  }
}

function mousePressed() {
  if (ScreenHandler == 0) {
    if (currentLevel == 0) {
        Dialogue_Prog = Dialogue_Prog + 1
        if ((Dialogue_Prog + 1) > CC_Dialogue.length) {
            ScreenHandler = 1
            Dialogue_Prog = 0
        }
    } else if (currentLevel == 1) {
        Dialogue_Prog = Dialogue_Prog + 1
        if ((Dialogue_Prog + 1) > CC_Dialogue1.length) {
            ScreenHandler = 1
            Dialogue_Prog = 0
        }
    } else if (currentLevel == 3) {
        Dialogue_Prog = Dialogue_Prog + 1
        if ((Dialogue_Prog + 1) > CC_Dialogue2.length) {
            ScreenHandler = 1
            Dialogue_Prog = 0
        }
    } else if (currentLevel == 4) {
        Dialogue_Prog = Dialogue_Prog + 1
        if ((Dialogue_Prog + 1) > CC_Dialogue3.length) {
            ScreenHandler = 1
            Dialogue_Prog = 0
        }
    } else if (currentLevel == 5 && LB_Checker == true) {
        Dialogue_Prog = Dialogue_Prog + 1
        if ((Dialogue_Prog + 1) > CC_Dialogue5.length) {
            ScreenHandler = 3
            Dialogue_Prog = 0
        }
    } else if (currentLevel == 5) {
        Dialogue_Prog = Dialogue_Prog + 1
        if ((Dialogue_Prog + 1) > CC_Dialogue3.length) {
            ScreenHandler = 2
            Dialogue_Prog = 0
        }
    }
        
  } else if (ScreenHandler == 2 && AttackPhase == false && PlayerStats[0] > 0) {
    if (mouseX >= 170 && mouseX <= 330 && mouseY >= 64 && mouseY <= 108) {
      H_Attack = false
      AttackPhase = true
      H_Phase = true
    } else if (mouseX >= 170 && mouseX <= 330 && mouseY >= 5 && mouseY <= 59) {
      H_Attack = true
      AttackPhase = true
      H_Phase = true
      console.log("it fucking works")
    }
  } else if (ScreenHandler == 4) {
    if (mouseX >=112 && mouseX <=180 && mouseY >= 377 && mouseY <= 477) {
        if (PlayerStats[2] >= 5) {
            PlayerStats[2] = PlayerStats[2] - 5
            PlayerStats[0] = PlayerStats[0] + 10
        }
    } else if (mouseX >= 360 && mouseX <= 500 && mouseY >=0 && mouseY <= 63) {
        ScreenHandler = 1
    }

  } 
}

function AnimDamageHandler() {
  //Run only if the attack phase is active
  if (AttackPhase == true) {
    //Run only if it is the knights turn to attack or defend
    if (H_Phase == true) {
      if (H_Attack == true) {
        image(fx_B_Sprite[0],0,0)
        wait(5)
        if (TimerFinished == true) {
          EnemyStats[0] = EnemyStats[0] - 10
          H_Phase = false
          E_Phase = true
        }
      } else {
        PlayerStats[1] = PlayerStats[1] + 10
        H_Phase = false
        E_Phase = true
      }
    } else {
      image(fx_B_Sprite[1],0,0)
      wait(4)
      if (TimerFinished == true) {
        PlayerStats[0] = PlayerStats[0] - (EnemyStats[1]*(1-(PlayerStats[1]/100)))
        H_Phase = false
        E_Phase = false
        AttackPhase = false
        if (PlayerStats[1] > 0) {
           PlayerStats[1] = PlayerStats[1] - 5 
        }
      }  
    }
  }
}

function shop() {
    image(textures[578],0,0)
    textSize(30)


    fill(0)
    text(`Coins: ${PlayerStats[2]}`,351, 491 )
    fill(102,0,255)
    text(`Coins: ${PlayerStats[2]}`,350, 490 )

    text([mouseX,mouseY],300,200)
  text(frameRate(),300,300)
  text(frameCount,300,400)
}

function cutscene() {
    image(B_Background[currentLevel],0,0)
    if (currentLevel == 3) {

    } else {
        image(CC_Asset[currentLevel+2],280,117)
    }
    image(CC_Asset[1],-62,37)

    image(CC_Asset[0],0,337)

    textSize(20)
    fill(255)
    if (currentLevel == 0) {
        text(CC_Dialogue[Dialogue_Prog],20,430)
    } else if (currentLevel == 1) {
        text(CC_Dialogue1[Dialogue_Prog],20,430)
    } else if (currentLevel == 3) {
        text(CC_Dialogue2[Dialogue_Prog],20,430)
    } else if (currentLevel == 4) {
        text(CC_Dialogue3[Dialogue_Prog],20,430)
    }  else if (currentLevel == 5 && LB_Checker == false) {
        text(CC_Dialogue4[Dialogue_Prog],20,430)
    } else if (currentLevel == 5 && LB_Checker == true) {
        text(CC_Dialogue5[Dialogue_Prog],20,430)
    }    
}

function WL_SCREEN() {
    if (EnemyStats[0] <= 0 && currentLevel == 5) {
        background(0,255,0)
        fill(0)
        text("YOU WIN", 250,250)
    } else {
            background(255,0,0)
            fill(0)
            text("MAINYU CONTROLS YOU", 0,250)
    }
}