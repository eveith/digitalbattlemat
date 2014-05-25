


# A penalty that hinders a character during combat or other actions.
class AnimaPenalty
    constructor: (penalty) ->
        {
            @value
            @reduceRatio
            @unit
            @type
        } = penalty


class AnimaCombat
    hitResult: (difference, at) ->
        if at > 10
            return 0

        if 0 > difference
            if -301 >= difference
                return -150
            else if -10 <= difference
                return -1
            else
                if difference % 10 == 0
                    difference += 1
                return (Math.floor(difference / 10) + 1) * 5
        else
            result = 0
            if difference <= 29
                return 0
            else if difference >= 30 and difference <= 39
                if at in [0, 1, 2]
                    return 10
                else
                    return 0
            else if difference >= 40 and difference <= 49
                if at == 0
                    return 30
                else if at in [1, 2]
                    return 20
                else if at == 3
                    return 0
                else
                    return 0
            else if difference >= 50
                result = difference - (difference % 10) - at * 10

            if result < 0
                return 0
            else
                return result



class AnimaCharacter extends Character
    constructor: (options) ->
        super options
        {
            @class
            @level,
            @characteristics,
            @lifePoints
        } = options
        
        @currentWeapon  = null
        @penalties      = []

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


    # Rolls initiative. Also takes penalties into account, and reduces them,
    # if possible.
    initiative: ->
        initiative = this.baseInitiative()
        if this.unarmed()
            initiative += 20

        @penalties = @penalties.filter((penalty) =>
          return penalty unless penalty.unit = "combat round"
          penalty.value -= penalty.reduceRatio
          return false unless penalty.value > 0
          initiative -= penalty.value if penalty.type = "all action"
        )
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


    # Attacks another character. Takes this character's penalties, splash
    # damage, etc into account and rolls the dices. It then handles the attack
    # state object to the other character's defend method.
    attack: (character) ->
      true


    # Defends the character against an attack of any kind, taking armor and
    # damage type into account as well as penalties.
    defend: (character) ->
      true



class AnimaWeapon
    constructor: ->
        @baseDamage = 0
        @at = 1


    hit: (character) ->
        @character.hitPoints -= @damage


root = exports ? window  
root.AnimaCharacter     = AnimaCharacter
root.AnimaCombat        = AnimaCombat
