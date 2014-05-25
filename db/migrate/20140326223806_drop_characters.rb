class DropCharacters < ActiveRecord::Migration
  def change
    drop_table :characters
  end
end
