class AddVisibility < ActiveRecord::Migration
  def self.up
    add_column :battle_mat_tiles, :visibility, :string
  end

  def self.down
    remove_column :battle_mat_tiles, :visibility
  end
end
