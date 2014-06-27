class Character
    constructor: (params) ->
        {
            @id
            @name
            @description
            @inventory
        } = params

        @inventory      = [] unless @inventory
        @description    = "" unless @description


root = exports ? window  
root.Character          = Character
