class CreateBattleMatTiles < ActiveRecord::Migration
  def self.up
    create_table :battle_mat_tiles do |t|
      t.integer :x_position
      t.integer :y_position
      t.integer :battle_mat_texture_id
      t.integer :battle_mat_id
      t.timestamps
    end
  end

  def self.down
    drop_table :battle_mat_tiles
  end
end
