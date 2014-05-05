class CharactersListViewModel
    constructor: (characters) ->
        @characters = ko.observableArray(characters)

        @characters.subscribe((characters) =>
            this.addCharacter(characters[characters.length-1]))


    addCharacter: (character) ->
        initial = character.name.substr(0, 1).toUpperCase()
        heading = $("#characters-list-items h2:contains(#{initial})")[0]

        unless heading
            container = $('<div class="ioslist-group-container"></div>')
            heading = $("<div class=\"ioslist-group-header\">" +
                    "<h2>#{initial}</h2></div>")
            container.append(heading)

            allInitials = $("#characters-list h2")
            if allInitials.length == 0
                $("#characters-list-items").append(container)
            else
                allInitials.each((i, o) ->
                    if initial > $(o).text()
                        $(container).insertAfter(
                                $(o).parents(".ioslist-group-container"))
                        return true
                    if initial < $(o).text() && 0 == i
                        $(container).insertBefore(
                                $(o).parents(".ioslist-group-container"))
                        return true
                )

            $("<ul><li>#{character.name}</li></ul>").insertAfter(heading)
        else
            container = $(heading).parent()
            $(container).next("ul").append("<li>#{character.name}</li>")
            ul = $(container).next("ul").find("li")
            ul.detach()
            ul = ul.sort((a, b) ->
                if $(a).text() > $(b).text()
                    return 1
                if $(a).text() < $(b).text()
                    return -1
                return 0)
            $(container).next("ul").append(ul)
        heading


    sortCharactersList: (list) ->
        list.sort((a, b) ->
            if a.name > b.name
                return -1
            if a.name < b.name
                return 1
            return 0)
        list




window.CharactersListViewModel = CharactersListViewModel
window.CharactersModel = CharactersListViewModel
