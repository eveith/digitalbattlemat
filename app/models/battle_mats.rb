class BattleMats < ActiveRecord::Base
  has_many :battle_mat_tiles
  
  def before_destroy
    self.battle_mat_tiles.delete_all
  end
end
