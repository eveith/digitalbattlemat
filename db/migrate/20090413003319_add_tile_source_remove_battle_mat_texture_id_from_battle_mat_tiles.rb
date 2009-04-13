class AddTileSourceRemoveBattleMatTextureIdFromBattleMatTiles < ActiveRecord::Migration
  def self.up
    add_column :battle_mat_tiles, :tile_source, :string
    remove_column :battle_mat_tiles, :battle_mat_texture_id
  end

  def self.down
    add_column :battle_mat_tiles, :battle_mat_texture_id, :integer
    remove_columns :battle_mat_tiles, :tile_source
  end
end
