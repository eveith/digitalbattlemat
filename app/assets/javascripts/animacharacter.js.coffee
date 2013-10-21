class AnimaCharacter 
    constructor: (options) ->
        {
            @name,
            @level,
            @characteristics,
            @lifePoints
        } = options
        
        @currentWeapon = null

        # Handle parameters:

        if not @lifePoints
            @lifePoints = this.baseLifePoints()


    baseLifePoints: ->
        20 + @characteristics.constitution * 10


    basePresence: ->
        30 + (@level - 1) * 5


    baseInitiative: ->
        20 +
        this.characteristicsModifier(@characteristics.dexterity) +
        this.characteristicsModifier(@characteristics.agility)


    fullLifePoints: ->
        @baseLifePoints()


    unarmed: ->
        @currentWeapon == null


    initiative: ->
        initiative = this.baseInitiative()
        if this.unarmed()
            initiative += 20
        initiative


    characteristicsModifier: (value) ->
        characteristicBonuses = [
            -1000,
            -30,
            -20,
            -10,
            -5,
            0,
            5,
            5,
            10,
            10,
            15,
            20,
            20,
            25,
            25,
            30,
            35,
            35,
            40,
            40,
            45 ]
        characteristicBonuses[value]


class AnimaWeapon
    constructor: ->
        @baseDamage = 0
        @at = 1


    hit: (character) ->
        @character.hitPoints -= @damage


window.AnimaCharacter = AnimaCharacter
