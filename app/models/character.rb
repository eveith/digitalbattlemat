class Character
  include Mongoid::Document

  field :name,        type: String
  field :description, type: String

  validates_presence_of :name

  TYPES = {
    :AnimaCharacter => AnimaCharacter
  }
end
