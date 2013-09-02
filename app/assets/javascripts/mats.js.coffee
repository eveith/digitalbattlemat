# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/


class MatModel
    constructor: ->
        @characters = ko.observableArray()

    addItems: (elements) ->
        elements.forEach((element, i) ->
            $('#card-container').masonry('prepended', element))

    edit: (element) ->
        $(element).children('input').css("display", "inline" )


class CharacterModel
    constructor: (character) ->
        @character = character
        @name = ko.observable(@character.name)
        @level = ko.observable(@character.level)
        @className = ko.observable("Warrior")
        @characteristics = ko.mapping.fromJS(@character.characteristics)
        @lifePoints = ko.observable(@character.baseLifePoints())

        ko.computed((->
            @character.name = ko.unwrap(@name)
            @character.level = ko.unwrap(@level)
            @character.characteristics = ko.mapping.toJS(@characteristics)
            @lifePoints = ko.observable(@character.baseLifePoints())
        ), this)


$(document).ready ->
    $('#card-container')
        .masonry({ 
            itemSelector: '.charactercard',
            gutter: 20 })

    window.matModel = new MatModel()
    ko.applyBindings(window.matModel)

    $('#card-add a').on('click', (event) -> (
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
