class BattleMatTile < ActiveRecord::Base
  belongs_to :battle_mat, :validate => true

  validates_numericality_of :x_position, :greater_than_or_equal_to => 0
  validates_numericality_of :y_position, :greater_than_or_equal_to => 0
  validates_inclusion_of :visibility, :in => %w(visible hidden)
end
