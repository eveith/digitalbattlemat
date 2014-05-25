class Character
    constructor: (params) ->
        {
            @name
            @description
        } = params


root = exports ? window  
root.Character = Character
