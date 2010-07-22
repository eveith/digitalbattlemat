class RenameMatDimensionColumns < ActiveRecord::Migration
  def self.up
    rename_column :battle_mats, :x_dimension, :width
    rename_column :battle_mats, :y_dimension, :height

    change_column :battle_mats, :width, :integer,
        { :default => 16, :null => false }
    change_column :battle_mats, :height, :integer,
        { :default => 10, :null => false }
  end

  def self.down
    change_column :battle_mats, :width, :integer,
        { :default => 0, :null => true }
    change_column :battle_mats, :height, :integer,
        { :default => 0, :null => true }

    rename_column :battle_mats, :height, :x_dimension
    rename_column :battle_mats, :height, :y_dimension
  end
end
