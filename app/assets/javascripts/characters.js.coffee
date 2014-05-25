class CharactersListViewModel
    constructor: (characters) ->
        @characters = ko.observableArray(characters)
        @currentCharacter = ko.observable(undefined)

        @characters.subscribe((characters) =>
            this.addCharacter(characters[characters.length-1]))


    displayCharacter: (character) ->
        @currentCharacter(character)


    addCharacter: (character) ->
        initial = character.name().substr(0, 1).toUpperCase()
        heading = $("#characters-list-items h2:contains(#{initial})")[0]
        link    = $("<a href='#{window.location}/#{character.id["$oid"]()}'>" +
                "#{character.name()}</a>").on("click", (e) =>
            e.preventDefault()
            this.displayCharacter(character))
        li      = $("<li></li>").append(link)

        unless heading
            heading     = $("<h2>#{initial}</h2>")
            container   = $('<div class="characters-list-item"></div>')
                    .append(heading)

            allInitials = $("#characters-list-items h2")
            if allInitials.length == 0
                $("#characters-list-items").append(container)
            else
                allInitials.each((i, o) ->
                    if initial > $(o).text()
                        $(container).insertAfter($(o).parent())
                        return true
                    if initial < $(o).text() && 0 == i
                        $(container).insertBefore($(o).parent())
                        return true
                )

            $("<ul></ul>").insertAfter(heading).append(li)
        else
            $(heading).next("ul").append(li)
            ul = $(heading).next("ul").find("li")
            ul.detach()
            ul = ul.sort((a, b) ->
                if $(a).text() > $(b).text()
                    return 1
                if $(a).text() < $(b).text()
                    return -1
                return 0)
            $(heading).next("ul").append(ul)
        link


    sortCharactersList: (list) ->
        list.sort((a, b) ->
            if a.name > b.name
                return -1
            if a.name < b.name
                return 1
            return 0)
        list



class CharacterViewModel
    constructor: (@character) ->
        observedCharacter = this.createObservables(@character)
        for propertyName of observedCharacter
            Object.defineProperty(
                this,
                propertyName,
                {
                    value: observedCharacter[propertyName]
                })


    createObservables: (targetObject) ->
        observedObject = new Object()
        Object.keys(targetObject).forEach((property, i) =>
            propertyValue = targetObject[property]

            if null != propertyValue and "object" == typeof propertyValue
                observable = this.createObservables(propertyValue)
            else
                observable = ko.observable(propertyValue)

                # Handle writing back upon UI change:

                observable.subscribe((newValue) =>
                    targetObject[property] = newValue)

            # Define a new property on us:

            Object.defineProperty(
                    observedObject,
                    property,
                    {
                        enumerable: true,
                        value: observable
                    })
        )
        observedObject


class AnimaCharacterViewModel extends CharacterViewModel
    constructor: (character) ->
        super character


CharacterTypeMap = {
    "AnimaCharacter": {
        gameModel: AnimaCharacter,
        viewModel: AnimaCharacterViewModel
    }
}



root = exports ? window
root.CharacterTypeMap           = CharacterTypeMap
root.CharactersListViewModel    = CharactersListViewModel
root.CharacterViewModel         = CharacterViewModel
root.AnimaCharacterViewModel    = AnimaCharacterViewModel
