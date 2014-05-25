class Character
    constructor: (params) ->
        {
            @id
            @name
            @description
        } = params


root = exports ? window  
root.Character          = Character
