# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/


class MatModel
    constructor: ->
        @characters = ko.observableArray()
        @nRounds = ko.observable(0)
        @triggers = []
        @isGameMaster = ko.observable(true)


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
            $(".charactercard .ui-accordion").accordion("option", "active", false)
        @nRounds(@nRounds()+1)

        @characters().forEach((o, i) ->
            o.rollInitiative())

        @characters.sort((a, b) ->
            a.initiative() > b.initiative() ? 1 : -1)

        # Deactivate some buttons:

        $('.action-edit-character').button("disable")
        $('.action-remove-character').button("disable")
        if not @isGameMaster()
            $('#card-add').toggle()

        # Activate action buttons:
        
        $('.action-attack').button("enable")
        $('.action-cast-spell').button("enable")

        $('.action-set-weapon').prop("disabled", false)

        # Show triggers, if set:

        while @triggers.length > 0 && @triggers[0].round == @nRounds()
            trigger = @triggers.shift()
            $.jGrowl(trigger.text, { 
                    header: "Trigger in Round " + @nRounds(),
                    life: 10000 })

        # Sort character card divs:

        divs = $('.character-card').detach()
        $('#card-container').masonry('reloadItems')

        divs.sort((a, b) ->
            aval = $(a).find('dd.character-initiative').first().text()
            bval = $(b).find('dd.character-initiative').first().text()
            return (aval > bval ? 1 : -1))

        $('#card-container').prepend(divs)
        $('#card-container').masonry('prepended', divs)


class CharacterModel
    constructor: (character, mat) ->
        @character = character
        @name = ko.observable("Alric #" + Math.ceil(Math.random() * 100))
        @level = ko.observable(@character.level)
        @className = ko.observable("Warrior")
        @mat = mat

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


    cloneCharacter: =>
        newCharacter = $.extend(true, {}, @character)
        @mat.characters.unshift(new CharacterModel(newCharacter, @mat))



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
        window.matModel.characters.unshift(new CharacterModel(
            new AnimaCharacter({
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
                    perception: 0 }}),
            matModel))
        $('.action-attack').on('click', (event) -> (
            $(this).parents('.character-card').find('.action-set-weapon').prop("disabled", true)
        ))
    ))


    # Setup roll dice dialog:

    $("#action-roll-dice").click(->
        div = $("#dialog-roll-dice-template").clone()

        div.find('form').first().submit((event) ->
            event.preventDefault()
            diceCode = div.find('input[name=dice-roll-dicecode]').val()
            $.ajax('http://rolz.org/api/?' + diceCode + '.jsonp', {
                    dataType: 'jsonp'
                })
                .done((data)->
                    $(div).data("rollResult", data.result)
                    div.find('.dialog-roll-dice-result').text(data.result)
                    div.find('.dialog-roll-dice-result-p').toggle()
                    $(div.find('form')[1]).toggle())
                .fail(->
                    $('#dialog-roll-error').dialog({
                        modal: true, 
                        buttons: {
                            'OK': ->
                                $(this).dialog("close")
                        }
                    })))

        div.dialog({
            buttons: {
                "Set Trigger": (->
                    rollResult = $(div).data("rollResult")
                    rollTitle = $(div).find(
                            'input[name=dialog-roll-dice-trigger-title]')
                            .val()

                    $.jGrowl("Trigger set to fire in " + rollResult +
                            " rounds: " + rollTitle)

                    matModel.triggers.push({
                            round: matModel.nRounds() + rollResult,
                            text: rollTitle
                        })
                    matModel.triggers.sort((a, b) ->
                        return (a.round > b.round ? 1 : -1))
                    console.log(matModel.triggers)

                    $(this).dialog("close")
                    )
                "Close": -> 
                    $(this).dialog("close")
                }
            })

        $(div.find('button')[2]).toggle()
        div.find('input[name=dialog-roll-dice-set-trigger]').click(->
            $(div.find('button')[2]).toggle())
    )
