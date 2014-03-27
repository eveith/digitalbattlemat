require 'test_helper'

class ItemTest < ActiveSupport::TestCase
  test "models and rulesets" do
    i = Item.new(:name => "foo", :item_type => 0, :ruleset => 0)
    assert i.save
    assert i.item_type.class == Symbol
    assert i.ruleset.class == Symbol
  end
  # test "the truth" do
  #   assert true
  # end
end
