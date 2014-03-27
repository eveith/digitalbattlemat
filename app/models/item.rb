class Item < ActiveRecord::Base
  has_and_belongs_to_many :items, {
    :join_table => :items_relations,
    :foreign_key => :parent_id,
    :association_foreign_key => :child_id
  }


  validates :name, :ruleset, :item_type, presence: true


  RULESETS = [
    :anima
  ]


  ITEM_TYPES = [
    :attribute,
    :skill
  ]


  def ruleset=(ruleset)
    ruleset = RULESETS.find_index(ruleset) if Symbol == ruleset.class
    write_attribute(:ruleset, ruleset)
  end


  def ruleset
    RULESETS[read_attribute(:ruleset)]
  end


  def item_type=(item_type)
    type = TYPES.find_index(item_type) if Symbol == item_type.class
    write_attribute(:item_type, item_type)
  end


  def item_type
    ITEM_TYPES[read_attribute(:item_type)]
  end
end
