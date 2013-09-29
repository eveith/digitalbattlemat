# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/


class MatModel
    constructor: ->
        @characters = ko.observableArray()
        @nRounds = ko.observable(0)


    addItems: (elements) ->
        elements.forEach((element, i) =>
            $(element).find(".characteristics-container").accordion({
                collapsible: true })
            $('#card-container').masonry('prepended', element)

            # Setup per-character action buttons:

            $(element).find(".character-actions button:first")
                .button({
                    icons: { primary: "ui-icon-trash" },
                    text: false
                }).next().button({
                    icons: { primary: "ui-icon-pencil" },
                    text: false
                }).next().button({
                    icons: { primary: "ui-icon-copy" },
                    text: false
                }).next().button({
                    icons: { primary: "ui-icon-gear" },
                    text: false,
                    disabled: true
                }).next().button({
                    icons: { primary: "ui-icon-script" },
                    text: false,
                    disabled: true
                })
            $(element).find(".character-actions").buttonset())



    rollInitiative: ->
        if @characters().length == 0
            return false

        if @nRounds() == 0
            $("#card-add").hide("highlight", { }, 1000)
            $(".charactercard .ui-accordion").accordion("option", "active", false)

        @nRounds(@nRounds()+1)

        @characters().forEach((o, i) ->
            o.rollInitiative())

        @characters.sort((a, b) ->
            a.initiative() > b.initiative() ? 1 : -1)

        # Deactivate some buttons:

        $('.action-edit-character').button("disable")
        $('.action-remove-character').button("disable")

        # Activate action buttons:
        
        $('.action-attack').button("enable")
        $('.action-cast-spell').button("enable")


class CharacterModel
    constructor: (character) ->
        @character = character
        @name = ko.observable("Alric #" + Math.ceil(Math.random() * 100))
        @level = ko.observable(@character.level)
        @className = ko.observable("Warrior")

        @characteristics = {}
        $.each(character.characteristics, (i, o) =>
            @characteristics[i] = ko.observable(character.characteristics[i]))

        @lifePoints = ko.observable(@character.fullLifePoints())

        @initiative = ko.observable(0)

        ko.computed((->
            @character.name = ko.unwrap(@name)
            @character.level = ko.unwrap(@level)

            $.each(@characteristics, (i, o) =>
                @character.characteristics[i] = ko.unwrap(@characteristics[i]))

            @lifePoints(@character.fullLifePoints())
        ), this)


    edit: (model, event) ->
        card = $(event.target).parents('.charactercard')
        card.find('input').toggle()
        card.find('span.editable').toggle()


    rollInitiative: ->
        @initiative(Math.ceil(Math.random() * 100))



document.setupActionBar = ->
    $("button").button()


$(document).ready ->
    $('#card-container')
        .masonry({ 
            itemSelector: '.charactercard',
            gutter: 20 })

    @setupActionBar()

    window.matModel = new MatModel()
    ko.applyBindings(window.matModel)

    $('#card-add a').on('click', (event) => (
        event.preventDefault()
        window.matModel.characters.unshift(new CharacterModel(new AnimaCharacter({
            name: "",
            level: 1,
            characteristics: {
                strength: 0,
                constitution: 0,
                dexterity: 0,
                agility: 0,
                intelligence: 0,
                power: 0,
                willpower: 0,
                perception: 0 }})))))



    # Allow edit:

    $("#card-container").on("click", "a.character-action-edit", (event) ->
        event.preventDefault()
        $(this).parents(".charactercard").find(".editable").toggle()
        $(this).parents(".charactercard").find("input").toggle())
