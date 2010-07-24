require 'test_helper'

class BattleMatsTest < ActiveSupport::TestCase
  def test_must_provide_default_width_and_height
    b = BattleMat.new
    b.save

    assert_not_nil b.width, 'Mat must have a default width'
    assert_not_nil b.height, 'Mat must have a default height'
  end


  def test_must_enforce_valid_width_and_height
    b = BattleMat.new
    b.width = -1
    b.height = -1
    b.save

    assert b.errors.on(:width), 'Must enforce valid width'
    assert b.errors.on(:height), 'Must enforce valid height'
  end


  def test_must_delete_all_tiles_on_deletion
    b = BattleMat.new
    b.save
    b.battle_mat_tiles.create :x_position => 0, :y_position => 0

    assert !b.battle_mat_tiles.empty?, 'Must have one tile associated with the mat'

    mat_id = b.id

    b.destroy
    
    assert BattleMatTile.find(:all,
        :conditions => { :battle_mat_id => mat_id }).empty?,
      'There must be no orphaned tiles after mat deletion'
  end
end
