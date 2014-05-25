class AnimaCharacter < Character
  include Mongoid::Document


  DEFAULT_CHARACTERISTICS = {
      :agility => 0,
      :strength => 0,
      :dexterity => 0,
      :constitution => 0,
      :intelligence => 0,
      :power => 0,
      :willpower => 0
    }


  field :characteristics, type: Hash, default: DEFAULT_CHARACTERISTICS


  validates_each :characteristics do |record, attr, value|
    unless value.keys == DEFAULT_CHARACTERISTICS.keys then
      record.errors.add(
          :attr,
          'Does not contain the correct characteristics')
    end
  end
end
