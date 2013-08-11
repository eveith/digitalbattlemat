class CreateMats < ActiveRecord::Migration
  def change
    create_table :mats do |t|
      t.string :unique_hash
      t.integer :user_id
      t.string :title

      t.timestamps
    end
    add_index :mats, :unique_hash, unique: true
    add_index :mats, :user_id, unique: true
  end
end
