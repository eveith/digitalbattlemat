require 'test_helper'

class BattleMatTilesTest < ActiveSupport::TestCase

  def test_must_enforce_valid_xy_position
    t = BattleMatTile.new :x_position => -1, :y_position => -1
    t.save

    assert t.errors.on(:x_position), 'Must enforce valid X position'
    assert t.errors.on(:y_position), 'Must enforce valid Y position'
  end


  def test_must_have_a_valid_value_for_visibility
    t = BattleMatTile.new :visibility => 'visible'
    t.save
    assert !t.errors.on(:visibility),
      'Must allow "visibile" as valid keyword for "visibility"'

    t = BattleMatTile.new :visibility => 'hidden'
    t.save
    assert !t.errors.on(:visibility),
      'Must allow "hidden" as valid keyword for "visibility"'

    t = BattleMatTile.new :visibility => 'Fubar'
    t.save
    assert t.errors.on(:visibility),
      'Must check for a valid value for "visiblity" attribute'
  end
end
