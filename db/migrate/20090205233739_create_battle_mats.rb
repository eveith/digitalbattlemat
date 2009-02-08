class CreateBattleMats < ActiveRecord::Migration
  def self.up
    create_table :battle_mats do |t|
      t.string :description
      t.timestamps
    end
  end

  def self.down
    drop_table :battle_mats
  end
end
