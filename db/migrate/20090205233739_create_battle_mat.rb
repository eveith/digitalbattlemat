class CreateBattleMat < ActiveRecord::Migration
  def self.up
    create_table :battle_mats do |t|
      t.string :description
      t.string :background
      t.integer :x_dimension
      t.integer :y_dimension
      t.timestamps
    end
  end

  def self.down
    drop_table :battle_mats
  end
end
