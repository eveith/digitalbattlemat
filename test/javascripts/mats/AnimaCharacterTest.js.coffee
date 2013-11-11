#anima = require("../../../app/assets/javascripts/animacharacter.js.coffee")
#assert = require("assert")


describe 'AnimaCombat', ->
    describe '#hitresult', ->
        it 'should yield the proper values', ->
            c = new AnimaCombat()
            chai.assert.equal(0, c.hitResult(20, 0))
            chai.assert.equal(0, c.hitResult(55, 9))
            chai.assert.equal(70, c.hitResult(95, 2))

            chai.assert.equal(-1, c.hitResult(-5, 5))
            chai.assert.equal(-1, c.hitResult(-10, 4))

            chai.assert.equal(-30, c.hitResult(-61, 4))
            chai.assert.equal(-30, c.hitResult(-66, 4))
            chai.assert.equal(-30, c.hitResult(-70, 4))

            chai.assert.equal(50, c.hitResult(95, 4))
