class BattleMat < ActiveRecord::Base
  has_many :battle_mat_tiles

  validates_numericality_of :width, :greater_than_or_equal_to => 0
  validates_numericality_of :height, :greater_than_or_equal_to => 0
  
  def before_destroy
    self.battle_mat_tiles.delete_all
  end
end
