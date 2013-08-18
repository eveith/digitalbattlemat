require 'digest'


class Mat < ActiveRecord::Base
  self.primary_key = "unique_hash"
  validates :unique_hash, uniqueness: true


  before_create do
    sha1 = Digest::SHA1.new
    self.unique_hash = sha1.hexdigest(
        "#{Time.new().strftime("%s")}-#{Random::rand}").slice(0, 8)
  end
end
