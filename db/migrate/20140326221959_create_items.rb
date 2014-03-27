class CreateItems < ActiveRecord::Migration
  def up
    create_table :items do |t|
      t.string  :name
      t.text    :description
      t.integer :ruleset
      t.integer :item_type
      t.float   :value
      t.text    :hook

      t.index   :name
      t.index   :ruleset
      t.index   :item_type
    end

    create_table :items_relations do |t|
      t.integer :parent_id
      t.integer :child_id

      t.index   :parent_id
      t.index   :child_id
    end
  end


  def down
    drop_table :items
    drop_table :items_relations
  end
end
