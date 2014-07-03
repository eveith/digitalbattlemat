class CharactersListViewModel
    constructor: (characters) ->
        @characters         = ko.observableArray(characters)
        @currentCharacter   = ko.observable(undefined)

        @characters.subscribe((characters) =>
            this.addCharacter(characters[characters.length-1]))

        $(document).ready(=>
            this.setupActionButtons())


    displayCharacter: (characterViewModel) ->
        type    = characterViewModel._type()
        id      = characterViewModel.id["$oid"]()

        # Retrieve template:

        $.ajax({
            url: "characters/#{id}",
            mimeType: "text/x-knockout-template",
            accepts: [ "text/html" ]
        }).done((data) =>
            $("#character-template").text(data))
        .then(
            $.getJSON("characters/#{id}").done((data) =>
                gameModel = new CharacterTypeMap[type].gameModel(data)
                viewModel = new CharacterTypeMap[type].viewModel(gameModel)
                @currentCharacter(viewModel)))


    setupTemplateUI: (elements, model) ->



        $("#character-details-container *[pattern]").on("keydown", (event) ->
            return unless 1 == event.key.length
            text    = $(event.target).text() + event.key
            pattern = new RegExp($(event.target).attr("pattern"))
            event.preventDefault() unless pattern.exec(text))

        model.setupTemplateUI()


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


    search: (name) ->
        if "" == name
            $("#characters-list-items li").css("display", "list-item")
            return true

        $("#characters-list-items li").each((i, li) =>
            if null != $(li).children("a").text().match(new RegExp(name, "i"))
                $(li).css("display", "list-item")
            else
                $(li).css("display", "none"))


    sortCharactersList: (list) ->
        list.sort((a, b) ->
            if a.name > b.name
                return -1
            if a.name < b.name
                return 1
            return 0)
        list


    setupActionButtons: ->
        $("#new-character-dialog").dialog({
            autoOpen: false,
            show: {
                effect: "blind"
            },
            hide: {
                effect: "blind"
            },
            buttons: {
                "Create": =>
                    $.post(
                        "characters",
                        $("#new-character-dialog form").serialize(),
                        true,
                        'json')
                    .done((data) =>
                        this.addCharacter(new CharacterViewModel(data))
                        $("#new-character-dialog").dialog("close"))
                "Cancel": ->
                    $("#new-character-dialog input[name=name]").val("")
                    $("#new-character-dialog").dialog("close")
            }
        })

        $("#new-character-dialog select").select2()

        $(".action-add-character").click(->
            $("#new-character-dialog input").val("")
            $("#new-character-dialog").dialog("open"))

        $("#search-character").on("input", (event) =>
            this.search($("#search-character").val()))


class CharacterViewModel


    # Constructs a new CharacterViewModel. 
    # Requires an initialized Character object.
    #
    constructor: (@character) ->
        observedCharacter = this.createObservables(@character)
        for propertyName of observedCharacter
            Object.defineProperty(
                this,
                propertyName,
                {
                    value: observedCharacter[propertyName]
                })

        @editable = ko.observable(false)

        # Knockout callback helpers:

        @toggleInventoryItemEditable = (data, event) =>
            return unless @editable()
            return if event.target.tagName == "SPAN" and 
                $(event.currentTarget).hasClass("editable-active")
            $(event.currentTarget).toggleClass("editable-active")
            $(event.currentTarget).children("button").fadeToggle()

        @removeInventoryItem = (item) =>
            @inventory.remove(item)


    # Creates observables from a given Character object
    #
    createObservables: (targetObject) ->
        observedObject = new Object()
        Object.keys(targetObject).forEach((property, i) =>
            propertyValue = targetObject[property]

            if null == propertyValue or undefined == propertyValue
                observable = ko.observable(propertyValue)
            else if propertyValue instanceof Array
                observable = ko.observableArray(propertyValue)
            else if "object" == typeof propertyValue
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

        # Now do the same for functions:

        Object.keys(targetObject.__proto__).forEach((f, i) =>
            fun = targetObject[f]
            return if fun.length > 0

            observable = ko.computed(->
                boundFunction = targetObject[f].bind(targetObject)
                boundFunction.call())
            observedObject[f] = observable)
        observedObject


    # Sets up actions within the Character UI template.
    #
    setupTemplateUI: ->

        # Set up the edit character toggle button:

        $("#action-character-editable-toggle").button({
            text: false,
            icons: { primary: "ui-icon-pencil" }
        })
        .on("click", (event) =>
            event.preventDefault()

            @editable(true)

            $("#character-details-container span[data-bind]").each((i, o) ->
                data_bind = $(o).attr("data-bind").replace(/^text/, "value")
                siblings = $(o).siblings("input[data-bind='#{data_bind}']")
                    
                $(o).toggle() if siblings.length > 0)

            $("#character-details-container *[contenteditable]").each((i, o) ->
                if $(o).attr("contenteditable") == "true"
                    $(o).attr("contenteditable", "false")
                else
                    $(o).attr("contenteditable", "true"))

            $("#character-details-container input").toggle())

        # Action for adding items to the inventory:

        $("#character-action-inventory-add").on("keypress", (event) =>
            return unless "Enter" == event.key
            @inventory.push($(event.target).val())
            $(event.target).val(""))


        # Setup/style inventory items:

        @inventory.subscribe((contents) =>
            $("#character-inventory button").button({
                text: false,
                icons: {
                    primary: "ui-icon-trash"
                }
            })

            if @editable()
                $("#character-inventory span").attr("contenteditable", "true")
            else
                $("#character-inventory span").attr("contenteditable", "false"))



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
